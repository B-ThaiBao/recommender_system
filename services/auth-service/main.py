import hashlib
import os
import time
import uuid

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

app = FastAPI(title="Auth Service")

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

JWT_SECRET = os.getenv("JWT_SECRET", "dev-change-me-secret")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = int(os.getenv("ACCESS_TOKEN_EXPIRE_SECONDS", "1800"))
REFRESH_TOKEN_EXPIRE_SECONDS = int(os.getenv("REFRESH_TOKEN_EXPIRE_SECONDS", "604800"))
PASSWORD_SALT = os.getenv("PASSWORD_SALT", "dev-password-salt")

auth_scheme = HTTPBearer(auto_error=False)


def _hash_password(password: str) -> str:
    return hashlib.sha256(f"{PASSWORD_SALT}:{password}".encode("utf-8")).hexdigest()


_users = {
    "student": {
        "email": "student@example.com",
        "password_hash": _hash_password("123456"),
        "user_id": 1,
        "role": "student",
    }
}

_refresh_store = {}


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


def _issue_tokens(username: str, role: str):
    now = int(time.time())
    access_payload = {
        "sub": username,
        "role": role,
        "type": "access",
        "iat": now,
        "exp": now + ACCESS_TOKEN_EXPIRE_SECONDS,
    }
    refresh_jti = str(uuid.uuid4())
    refresh_payload = {
        "sub": username,
        "role": role,
        "type": "refresh",
        "jti": refresh_jti,
        "iat": now,
        "exp": now + REFRESH_TOKEN_EXPIRE_SECONDS,
    }

    access_token = jwt.encode(access_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    _refresh_store[refresh_jti] = {
        "username": username,
        "exp": refresh_payload["exp"],
        "revoked": False,
    }

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_SECONDS,
    }


def _decode_token(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError as err:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired") from err
    except jwt.PyJWTError as err:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from err


def _get_current_user(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

    payload = _decode_token(credentials.credentials)
    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")

    username = payload.get("sub")
    user = _users.get(username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return username, user


@app.get("/")
def read_root():
    return {"message": "Auth Service is running"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/live")
def health_live():
    return {"status": "live"}


@app.get("/health/ready")
def health_ready():
    return {"status": "ready"}


@app.post("/v1/auth/login")
def login_v1(data: LoginRequest):
    user = _users.get(data.username)
    if not user or user["password_hash"] != _hash_password(data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token_bundle = _issue_tokens(data.username, user["role"])
    return {
        **token_bundle,
        "user": {
            "user_id": user["user_id"],
            "username": data.username,
            "email": user["email"],
            "role": user["role"],
        },
    }


@app.post("/login")
def login(data: LoginRequest):
    return login_v1(data)


@app.post("/v1/auth/register", status_code=status.HTTP_201_CREATED)
def register_v1(data: RegisterRequest):
    if data.username in _users:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")

    next_id = max((item["user_id"] for item in _users.values()), default=0) + 1
    _users[data.username] = {
        "email": data.email,
        "password_hash": _hash_password(data.password),
        "user_id": next_id,
        "role": "student",
    }
    return {"message": "Registration successful", "user_id": next_id}


@app.post("/register")
def register(data: RegisterRequest):
    return register_v1(data)


@app.post("/v1/auth/refresh")
def refresh_token_v1(data: RefreshRequest):
    payload = _decode_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    refresh_jti = payload.get("jti")
    stored = _refresh_store.get(refresh_jti)
    if not stored or stored["revoked"]:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked")
    if stored["exp"] < int(time.time()):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    username = payload.get("sub")
    user = _users.get(username)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    stored["revoked"] = True
    return _issue_tokens(username, user["role"])


@app.post("/v1/auth/logout")
def logout_v1(data: RefreshRequest):
    payload = _decode_token(data.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    refresh_jti = payload.get("jti")
    if refresh_jti in _refresh_store:
        _refresh_store[refresh_jti]["revoked"] = True
    return {"message": "Logged out"}


@app.get("/v1/auth/me")
def me_v1(current_user=Depends(_get_current_user)):
    username, user = current_user
    return {
        "user_id": user["user_id"],
        "username": username,
        "email": user["email"],
        "role": user["role"],
    }
