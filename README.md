# Career Guidance & University Recommendation Platform

## Architecture
This project uses a Microservices architecture.

### Services
- **Services**: `services/`
    - `auth-service`: Authentication & Privacy (FastAPI).
    - `core-service`: Quizzes, Career Logic (FastAPI).
    - `grade-service`: Grade processing & Auto-fill (FastAPI).
    - `chatbot-service`: Chatbot integration (FastAPI).
- **Frontend**: `frontend/` (React + Tailwind CSS).
- **Database**: PostgreSQL (Dockerized).

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js & npm
- Python 3.9+

### Running Backend
```bash
docker-compose up --build
```
Services will run on ports:
- Auth: 8001
- Core: 8002
- Grade: 8003
- Chatbot: 8004
- Database: 5432

### Running Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` (or 3000 depending on Vite config).

## Features (MVP)
1. Login/Register (Dummy account available).
2. Personality Quiz.
3. Grade Entry (Auto-fill mock).
4. Career Recommendations.
5. Chatbot Advice.

## Privacy
Data is processed locally or via secure services in compliance with PDPA (Vietnam) and GDPR.
