from fastapi import FastAPI

app = FastAPI(title="Grade Service")

@app.get("/")
def read_root():
    return {"message": "Grade Service is running"}

@app.post("/extract-grades")
def extract_grades():
    # MVP: Mock OCR response for "auto-fill"
    return {
        "math": 8.5,
        "literature": 7.0,
        "english": 9.0
    }
