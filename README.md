# Career Guidance & University Recommendation Platform

## Architecture
This project uses a Microservices architecture.

Full system blueprint (Vietnamese): `docs/system-design-vi.md`

### Services
- **Services**: `services/`
    - `auth-service`: Authentication & Privacy (FastAPI).
    - `core-service`: Quizzes, Career Logic (FastAPI).
    - `grade-service`: Grade processing & Auto-fill (FastAPI).
    - `chatbot-service`: Chatbot integration (FastAPI).
- **Frontend**: `frontend/` (React + Tailwind CSS).
- **Database**: PostgreSQL (Dockerized).

## Getting Started

### Quick Start (One Command - Recommended for Demo)

```bash
# Windows (PowerShell)
.\setup.ps1

# macOS / Linux
bash setup.sh
```

This will:
1. Create `.env` file from `.env.example`
2. Build all services (backend + frontend)
3. Start everything with Docker Compose
4. Services ready at:
   - **Frontend**: http://localhost:5173
   - **Auth**: http://localhost:9001
   - **Core**: http://localhost:9002
   - **Grade**: http://localhost:9003
   - **Chatbot**: http://localhost:9014
   - **Database**: localhost:5432

**Test Account**: `student` / `123456`

### Prerequisites
- Docker & Docker Compose
- Node.js & npm (if running frontend separately)
- Python 3.9+ (if running services separately)

### Manual Setup (Alternative)

#### Backend Only
```bash
copy .env.example .env
docker-compose up --build
```

Services will run on ports:
- Auth: 9001
- Core: 9002
- Grade: 9003
- Chatbot: 9014
- Database: 5432

#### Frontend (Separate Development Server)
```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` with hot-reload for development.

## Features (MVP)
1. Login/Register (Dummy account available).
2. Personality Quiz.
3. Grade Entry (Auto-fill mock).
4. Career Recommendations.
5. Chatbot Advice.

## Privacy
Data is processed locally or via secure services in compliance with PDPA (Vietnam) and GDPR.
