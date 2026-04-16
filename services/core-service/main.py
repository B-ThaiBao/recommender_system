from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Core Service")

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


class QuizSubmit(BaseModel):
    username: Optional[str] = None
    user_id: Optional[int] = None
    answers: list[int]
    grades: Optional[dict[str, float]] = None


QUIZ_TEMPLATES: dict[str, dict[str, Any]] = {
    "default-career-quiz": {
        "id": "default-career-quiz",
        "name": "Default Career Quiz",
        "version": 2,
        "type": "personality",
        "questions": [
            {"id": 1, "text": "Bạn thích giải quyết vấn đề bằng logic và số liệu hơn là cảm tính?", "dimension": "analytical"},
            {"id": 2, "text": "Bạn thấy thoải mái khi thuyết trình hoặc làm việc nhóm?", "dimension": "social"},
            {"id": 3, "text": "Bạn thích tạo ra sản phẩm có tính sáng tạo hoặc thẩm mỹ?", "dimension": "creative"},
            {"id": 4, "text": "Bạn thích đọc số liệu, thí nghiệm hoặc dữ liệu để ra quyết định?", "dimension": "scientific"},
            {"id": 5, "text": "Bạn thích lập kế hoạch, tổ chức công việc và quản lý tiến độ?", "dimension": "business"},
            {"id": 6, "text": "Bạn sẵn sàng học sâu các công cụ kỹ thuật để xây dựng sản phẩm?", "dimension": "technical"},
        ],
    }
}

CAREERS: list[dict[str, Any]] = [
    {
        "id": "software_engineer",
        "name": "Software Engineer",
        "domain": "tech",
        "personality_weights": {"analytical": 0.35, "technical": 0.35, "scientific": 0.15, "business": 0.15},
        "market_fit": 0.93,
        "universities": ["HUST", "UIT", "FPT University"],
    },
    {
        "id": "data_analyst",
        "name": "Data Analyst",
        "domain": "tech",
        "personality_weights": {"analytical": 0.45, "scientific": 0.25, "business": 0.15, "technical": 0.15},
        "market_fit": 0.9,
        "universities": ["NEU", "HUST", "UET"],
    },
    {
        "id": "ui_ux_designer",
        "name": "UI/UX Designer",
        "domain": "design",
        "personality_weights": {"creative": 0.45, "social": 0.2, "technical": 0.2, "analytical": 0.15},
        "market_fit": 0.84,
        "universities": ["RMIT", "Arena", "FPT University"],
    },
    {
        "id": "business_analyst",
        "name": "Business Analyst",
        "domain": "business",
        "personality_weights": {"business": 0.4, "analytical": 0.25, "social": 0.2, "technical": 0.15},
        "market_fit": 0.87,
        "universities": ["NEU", "FTU", "UEH"],
    },
    {
        "id": "marketing_specialist",
        "name": "Marketing Specialist",
        "domain": "business",
        "personality_weights": {"social": 0.35, "creative": 0.3, "business": 0.2, "analytical": 0.15},
        "market_fit": 0.82,
        "universities": ["UEH", "UEF", "FTU"],
    },
]

UNIVERSITIES: dict[str, dict[str, str]] = {
    "HUST": {"name": "Hanoi University of Science and Technology", "city": "Ha Noi", "tuition_range": "20-35M/năm", "admission_score": "26-29"},
    "UIT": {"name": "University of Information Technology", "city": "HCMC", "tuition_range": "18-28M/năm", "admission_score": "24-28"},
    "FPT University": {"name": "FPT University", "city": "Multi-city", "tuition_range": "30-45M/năm", "admission_score": "Xét tuyển riêng"},
    "NEU": {"name": "National Economics University", "city": "Ha Noi", "tuition_range": "15-35M/năm", "admission_score": "26-28"},
    "UET": {"name": "VNU University of Engineering and Technology", "city": "Ha Noi", "tuition_range": "12-25M/năm", "admission_score": "24-28"},
    "RMIT": {"name": "RMIT University Vietnam", "city": "HCMC / Ha Noi", "tuition_range": "280-350M/năm", "admission_score": "Xét tuyển riêng"},
    "UEH": {"name": "University of Economics Ho Chi Minh City", "city": "HCMC", "tuition_range": "25-40M/năm", "admission_score": "25-28"},
    "UEF": {"name": "University of Economics and Finance", "city": "HCMC", "tuition_range": "35-50M/năm", "admission_score": "Xét tuyển riêng"},
    "FTU": {"name": "Foreign Trade University", "city": "Ha Noi / HCMC", "tuition_range": "20-35M/năm", "admission_score": "27-29"},
    "Arena": {"name": "Arena Multimedia", "city": "Multi-city", "tuition_range": "40-60M/khóa", "admission_score": "Xét tuyển riêng"},
}

_attempts: list[dict[str, Any]] = []
_recommendations_by_key: dict[str, dict[str, Any]] = {}


def _storage_key(username: Optional[str] = None, user_id: Optional[int] = None) -> str:
    if user_id is not None:
        return f"user:{user_id}"
    if username:
        return f"username:{username}"
    return "guest"

@app.get("/")
def read_root():
    return {"message": "Core Service (Quiz/Recs) is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/live")
def health_live():
    return {"status": "live"}


@app.get("/health/ready")
def health_ready():
    return {"status": "ready"}


def _quiz_payload():
    template = QUIZ_TEMPLATES["default-career-quiz"]
    return {
        "questions": [
            {
                "id": question["id"],
                "text": question["text"],
                "dimension": question["dimension"],
                "options": [1, 2, 3, 4, 5],
            }
            for question in template["questions"]
        ]
    }


@app.get("/quiz")
def get_quiz():
    return {"template": QUIZ_TEMPLATES["default-career-quiz"], **_quiz_payload()}


@app.get("/v1/quiz/templates")
def get_quiz_templates_v1():
    template = QUIZ_TEMPLATES["default-career-quiz"]
    return {
        "templates": [
            {"id": template["id"], "name": template["name"], "version": template["version"], "type": template["type"]}
        ]
    }


@app.get("/v1/quiz/templates/{template_id}")
def get_quiz_template_detail_v1(template_id: str):
    template = QUIZ_TEMPLATES.get(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Quiz template not found")
    return template


def _scale_answer(answer: int) -> float:
    return max(0.0, min(1.0, (answer - 1) / 4))


def _normalize_grades(grades: Optional[dict[str, float]]) -> float:
    if not grades:
        return 0.68
    values = [value for value in grades.values() if isinstance(value, (int, float))]
    if not values:
        return 0.68
    return max(0.0, min(1.0, sum(values) / (len(values) * 10)))


def _career_score(scores: dict[str, float], grades_fit: float, career: dict[str, Any]) -> tuple[float, dict[str, float]]:
    personality_fit = sum(scores.get(key, 0.0) * weight for key, weight in career["personality_weights"].items())
    market_fit = career["market_fit"]
    total = round((0.4 * personality_fit + 0.35 * grades_fit + 0.25 * market_fit) * 100, 2)
    return total, {
        "personality_fit": round(personality_fit * 100, 2),
        "academic_fit": round(grades_fit * 100, 2),
        "market_fit": round(market_fit * 100, 2),
        "total": total,
    }


def _build_recommendation(payload: QuizSubmit) -> dict[str, Any]:
    template = QUIZ_TEMPLATES["default-career-quiz"]
    if len(payload.answers) != len(template["questions"]):
        raise HTTPException(status_code=400, detail="Answer count does not match quiz template")

    scores = {"analytical": 0.0, "social": 0.0, "creative": 0.0, "scientific": 0.0, "business": 0.0, "technical": 0.0}
    ordered_dimensions = [question["dimension"] for question in template["questions"]]
    for answer, dimension in zip(payload.answers, ordered_dimensions):
        value = _scale_answer(answer)
        scores[dimension] += value
        if dimension == "analytical":
            scores["technical"] += value * 0.35
        elif dimension == "technical":
            scores["analytical"] += value * 0.25
        elif dimension == "creative":
            scores["social"] += value * 0.15

    max_score = max(scores.values()) or 1.0
    normalized_scores = {key: round(value / max_score, 3) for key, value in scores.items()}
    grades_fit = _normalize_grades(payload.grades)

    ranked_careers: list[dict[str, Any]] = []
    for career in CAREERS:
        total_score, breakdown = _career_score(normalized_scores, grades_fit, career)
        dominant_dimension = max(career["personality_weights"], key=career["personality_weights"].get)
        why_map = {
            "analytical": "Bạn có xu hướng thích bài toán logic và xử lý dữ liệu.",
            "social": "Bạn thoải mái giao tiếp và làm việc với người khác.",
            "creative": "Bạn phù hợp với công việc cần sáng tạo và thẩm mỹ.",
            "scientific": "Bạn có xu hướng ra quyết định dựa trên dữ liệu và bằng chứng.",
            "business": "Bạn có thiên hướng tổ chức, lập kế hoạch và định hướng mục tiêu.",
            "technical": "Bạn sẵn sàng học công cụ kỹ thuật và xây sản phẩm thực tế.",
        }
        ranked_careers.append(
            {
                "id": career["id"],
                "name": career["name"],
                "domain": career["domain"],
                "score": total_score,
                "breakdown": breakdown,
                "why": [
                    why_map[dominant_dimension],
                    f"Điểm học tập hiện tại đang được quy đổi ở mức {round(grades_fit * 100, 1)}% phù hợp.",
                    f"Thị trường cho nhóm nghề này đang ở mức {round(career['market_fit'] * 100, 1)}% hấp dẫn.",
                ],
                "universities": [dict(UNIVERSITIES[name], code=name) for name in career["universities"]],
                "risk_flags": [
                    flag
                    for flag in [
                        "Nên kiểm tra lại học lực môn nền nếu muốn vào nhóm ngành cạnh tranh cao." if grades_fit < 0.6 else "",
                        "Nên bổ sung portfolio hoặc dự án cá nhân nếu chọn nhóm ngành công nghệ/sáng tạo." if normalized_scores["technical"] > 0.6 or normalized_scores["creative"] > 0.6 else "",
                    ]
                    if flag
                ],
            }
        )

    ranked_careers.sort(key=lambda item: item["score"], reverse=True)
    top_careers = ranked_careers[:5]

    top_universities: list[dict[str, Any]] = []
    seen_universities: set[str] = set()
    for career in top_careers:
        for university in career["universities"]:
            if university["code"] in seen_universities:
                continue
            seen_universities.add(university["code"])
            top_universities.append(university)
    top_universities = top_universities[:5]

    recommendation = {
        "recommendation_id": len(_attempts) + 1,
        "user_key": _storage_key(payload.username, payload.user_id),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "quiz_version": template["version"],
        "score_summary": {
            "personality_fit": round(max(normalized_scores.values()) * 100, 2),
            "academic_fit": round(grades_fit * 100, 2),
            "market_fit": round(top_careers[0]["breakdown"]["market_fit"], 2),
        },
        "top_careers": top_careers,
        "top_universities": top_universities,
        "why_recommended": [
            "Bản đồ tính cách của bạn đang nghiêng về nhóm nghề có thiên hướng phân tích và hành động.",
            f"Kết quả học tập quy đổi đang ở mức {round(grades_fit * 100, 1)}%, đủ để bám theo các ngành top đầu.",
            "Nhu cầu thị trường hiện ưu tiên kỹ năng số, tư duy giải quyết vấn đề và giao tiếp rõ ràng.",
        ],
        "risk_flags": [
            flag
            for flag in [
                "Cần kiểm tra lại học lực môn nền nếu muốn vào nhóm ngành cạnh tranh cao." if grades_fit < 0.6 else "",
                "Nên bổ sung portfolio hoặc dự án cá nhân để tăng khả năng cạnh tranh." if normalized_scores["technical"] > 0.6 or normalized_scores["creative"] > 0.6 else "",
            ]
            if flag
        ],
        "next_actions": [
            "Chọn 2-3 ngành mục tiêu và so sánh tổ hợp môn xét tuyển.",
            "Hoàn thành một bài test kỹ năng hoặc portfolio nhỏ.",
            "Tra cứu học phí, học bổng và điểm chuẩn của 3 trường phù hợp nhất.",
        ],
        "input_snapshot": {
            "answers": payload.answers,
            "grades": payload.grades or {},
        },
    }

    key = recommendation["user_key"]
    _recommendations_by_key[key] = recommendation
    _attempts.append(
        {
            "attempt_id": recommendation["recommendation_id"],
            "user_key": key,
            "answers": payload.answers,
            "created_at": recommendation["created_at"],
        }
    )

    return recommendation


def _mock_recommendation_result():
    return _recommendations_by_key.get("guest") or _build_recommendation(QuizSubmit(answers=[4, 4, 3, 4, 4, 5]))

@app.post("/quiz/submit")
def submit_quiz(data: QuizSubmit):
    return _build_recommendation(data)


@app.post("/v1/quiz/attempts")
def submit_quiz_attempt_v1(data: QuizSubmit):
    return {
        "attempt_id": len(_attempts) + 1,
        "answers_count": len(data.answers),
        "result": _build_recommendation(data),
    }


@app.get("/v1/recommendations/latest")
def get_latest_recommendations_v1(username: Optional[str] = Query(default=None), user_id: Optional[int] = Query(default=None)):
    key = _storage_key(username, user_id)
    return _recommendations_by_key.get(key) or _recommendations_by_key.get("guest") or _mock_recommendation_result()


@app.post("/v1/recommendations/recompute")
def recompute_recommendations_v1(data: QuizSubmit):
    return {"status": "recomputed", "result": _build_recommendation(data)}


@app.get("/v1/careers/{career_id}")
def get_career_detail_v1(career_id: str):
    career = next((item for item in CAREERS if item["id"] == career_id), None)
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")
    return career
