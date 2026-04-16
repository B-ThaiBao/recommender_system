from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Grade Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def support_api_prefix(request, call_next):
    # Allow both /v1/... and /api/v1/... URLs for easier gateway integration.
    path = request.scope.get("path", "")
    if path == "/api":
        request.scope["path"] = "/"
    elif path.startswith("/api/"):
        request.scope["path"] = path[4:]
    return await call_next(request)


class GradeInput(BaseModel):
    username: Optional[str] = None
    user_id: Optional[int] = None
    math: float
    literature: float
    english: float
    physics: Optional[float] = None
    economics: Optional[float] = None
    art: Optional[float] = None


_latest_grades: dict[str, dict] = {}


def _storage_key(username: Optional[str] = None, user_id: Optional[int] = None) -> str:
    if user_id is not None:
        return f"user:{user_id}"
    if username:
        return f"username:{username}"
    return "guest"


def _grade_payload(data: GradeInput) -> dict:
    subjects = {
        "math": data.math,
        "literature": data.literature,
        "english": data.english,
    }
    if data.physics is not None:
        subjects["physics"] = data.physics
    if data.economics is not None:
        subjects["economics"] = data.economics
    if data.art is not None:
        subjects["art"] = data.art

    values = list(subjects.values())
    average = sum(values) / len(values)
    normalized = max(0.0, min(1.0, average / 10))

    payload = {
        "user_key": _storage_key(data.username, data.user_id),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "subjects": subjects,
        "average_score": round(average, 2),
        "academic_fit": round(normalized * 100, 2),
        "strengths": [
            subject
            for subject, score in subjects.items()
            if score >= 8.0
        ],
        "attention_points": [
            subject
            for subject, score in subjects.items()
            if score < 6.5
        ],
    }
    _latest_grades[payload["user_key"]] = payload
    return payload

@app.get("/")
def read_root():
    return {"message": "Grade Service is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/live")
def health_live():
    return {"status": "live"}


@app.get("/health/ready")
def health_ready():
    return {"status": "ready"}

@app.post("/extract-grades")
def extract_grades():
    # MVP: Mock OCR response for "auto-fill"
    return {
        "math": 8.5,
        "literature": 7.0,
        "english": 9.0,
        "physics": 8.0,
        "economics": 7.5,
    }


@app.post("/v1/grades/upload-transcript")
def upload_transcript_v1(data: GradeInput):
    extracted = extract_grades()
    merged = GradeInput(
        username=data.username,
        user_id=data.user_id,
        math=extracted.get("math", data.math),
        literature=extracted.get("literature", data.literature),
        english=extracted.get("english", data.english),
        physics=extracted.get("physics", data.physics),
        economics=extracted.get("economics", data.economics),
        art=data.art,
    )
    payload = _grade_payload(merged)
    payload["source"] = "transcript-upload"
    return payload


@app.post("/v1/grades/manual")
def submit_manual_grades_v1(data: GradeInput):
    payload = _grade_payload(data)
    payload["status"] = "saved"
    payload["source"] = "manual"
    return payload


@app.get("/v1/grades/latest")
def get_latest_grades_v1(username: Optional[str] = Query(default=None), user_id: Optional[int] = Query(default=None)):
    key = _storage_key(username, user_id)
    if key in _latest_grades:
        return _latest_grades[key]
    raise HTTPException(status_code=404, detail="No grade data found for this user")
