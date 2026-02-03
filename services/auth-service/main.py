from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Auth Service")

class LoginRequest(BaseModel):
    username: str
    password: str

@app.get("/")
def read_root():
    return {"message": "Auth Service is running"}

@app.post("/login")
def login(data: LoginRequest):
    # MVP: Dummy login
    if data.username == "student" and data.password == "123456":
         return {"token": "dummy-token", "user_id": 1, "role": "student"}
    return {"error": "Invalid credentials"}

@app.post("/register")
def register():
    return {"message": "Registration endpoint"}
