from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Core Service")

class QuizSubmit(BaseModel):
    answers: List[int]

@app.get("/")
def read_root():
    return {"message": "Core Service (Quiz/Recs) is running"}

@app.get("/quiz")
def get_quiz():
    return {
        "questions": [
            {"id": 1, "text": "Do you like math?", "options": ["Yes", "No"]},
            {"id": 2, "text": "Do you like art?", "options": ["Yes", "No"]}
        ]
    }

@app.post("/quiz/submit")
def submit_quiz(data: QuizSubmit):
    # MVP: Mock logic
    return {
        "personality": "Analytical",
        "recommended_careers": ["Software Engineer", "Data Analyst"],
        "recommended_universities": ["FPT University", "Hust"]
    }
