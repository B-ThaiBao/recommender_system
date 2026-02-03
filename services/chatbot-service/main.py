from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Chatbot Service")

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "Chatbot Service is running"}

@app.post("/chat")
def chat(data: ChatRequest):
    return {
        "response": f"I received your message: '{data.message}'. This is a mock AI response."
    }
