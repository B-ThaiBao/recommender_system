import json
import traceback
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag_engine import get_rag_chain

app = FastAPI(title="CareerGraph Chatbot API")

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


class ChatRequest(BaseModel):
    message: str


class CreateSessionRequest(BaseModel):
    user_id: int | None = None
    title: str | None = None


class SessionMessageRequest(BaseModel):
    message: str


_chat_sessions: dict[str, dict[str, Any]] = {}
_chat_messages: dict[str, list[dict[str, Any]]] = {}
_session_counter = 0


def _load_local_careers() -> list[dict[str, Any]]:
    data_path = Path(__file__).resolve().parent / "data.standard.json"
    if not data_path.exists():
        data_path = Path(__file__).resolve().parent / "data.json"
    if not data_path.exists():
        return []
    with data_path.open("r", encoding="utf-8") as file:
        return json.load(file)


_local_careers = _load_local_careers()


def _fallback_reply(message: str) -> str:
    lowered = message.lower()
    if not _local_careers:
        return "Mình chưa có dữ liệu sâu ở chế độ fallback, nhưng bạn có thể nói rõ hơn về ngành hoặc trường mình đang cân nhắc."

    matched = []
    for item in _local_careers:
        career_name = item.get("career_name", "ngành này")
        brief_description = item.get("brief_description", "")
        domain = item.get("domain", "")
        haystack = f"{career_name} {brief_description} {domain}".lower()
        if any(keyword in lowered for keyword in [career_name.lower(), domain.lower(), "ngành", "trường", "lương", "học"]):
            matched.append(item)

    if matched:
        best = matched[0]
        career_name = best.get("career_name", "ngành này")
        brief_description = best.get("brief_description", "")
        return (
            f"Mình thấy bạn đang hỏi về {career_name}. {brief_description} "
            "Nếu muốn, mình có thể gợi ý thêm trường học, tổ hợp môn hoặc lộ trình ôn tập phù hợp."
        )

    headline = _local_careers[0]
    return (
        f"Mình có thể hỗ trợ bạn về các ngành như {headline.get('career_name', 'công nghệ')}. "
        "Bạn muốn mình gợi ý theo điểm số, sở thích hay cơ hội việc làm?"
    )


def _generate_reply(message: str) -> str:
    try:
        chain = get_rag_chain()
        response = chain.invoke(message)
        return response.content
    except Exception:
        return _fallback_reply(message)


def _create_session(user_id: int | None = None, title: str | None = None) -> dict[str, Any]:
    global _session_counter
    _session_counter += 1
    session_id = f"chat-{_session_counter}"
    session = {
        "session_id": session_id,
        "user_id": user_id,
        "title": title or "Career guidance chat",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _chat_sessions[session_id] = session
    _chat_messages[session_id] = []
    return session


def _append_message(session_id: str, role: str, content: str) -> dict[str, Any]:
    message = {
        "role": role,
        "content": content,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    _chat_messages.setdefault(session_id, []).append(message)
    return message


@app.get("/")
def read_root():
    return {"message": "Chatbot Service is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/live")
def health_live():
    return {"status": "live"}


@app.get("/health/ready")
def health_ready():
    return {"status": "ready"}


@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        return {"reply": _generate_reply(request.message)}
    except Exception as err:
        print("====== CHATBOT BACKEND ERROR ======")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(err))


@app.post("/v1/chat")
async def chat_endpoint_v1(request: ChatRequest):
    return await chat_endpoint(request)


@app.post("/v1/chat/sessions")
def create_chat_session(request: CreateSessionRequest):
    session = _create_session(user_id=request.user_id, title=request.title)
    welcome = "Chào bạn, mình có thể hỗ trợ chọn ngành, chọn trường, và giải thích vì sao một ngành phù hợp."
    _append_message(session["session_id"], "assistant", welcome)
    return session | {"welcome_message": welcome}


@app.get("/v1/chat/sessions/{session_id}/messages")
def get_chat_session_messages(session_id: str):
    if session_id not in _chat_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return {
        "session": _chat_sessions[session_id],
        "messages": _chat_messages.get(session_id, []),
    }


@app.post("/v1/chat/sessions/{session_id}/messages")
def add_chat_session_message(session_id: str, request: SessionMessageRequest):
    if session_id not in _chat_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    _append_message(session_id, "user", request.message)
    reply = _generate_reply(request.message)
    _append_message(session_id, "assistant", reply)
    return {
        "session_id": session_id,
        "reply": reply,
        "messages": _chat_messages.get(session_id, []),
    }