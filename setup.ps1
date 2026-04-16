# Demo Setup Script - One Command to Run Everything
# Usage: .\setup.ps1

Write-Host "Career Compass Demo - One Command Setup" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists, if not copy from .env.example
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ".env created (adjust GOOGLE_API_KEY if needed)" -ForegroundColor Green
} else {
    Write-Host ".env already exists" -ForegroundColor Green
}

# Check if frontend .env exists
if (-not (Test-Path "frontend\.env")) {
    Write-Host "Creating frontend\\.env..." -ForegroundColor Yellow
    $frontendEnv = @"
VITE_AUTH_API_BASE_URL=http://localhost:9001
VITE_CORE_API_BASE_URL=http://localhost:9002
VITE_GRADE_API_BASE_URL=http://localhost:9003
VITE_CHATBOT_API_BASE_URL=http://localhost:9014
"@
    Set-Content -Path "frontend\.env" -Value $frontendEnv -Encoding UTF8
    Write-Host "frontend\\.env created" -ForegroundColor Green
} else {
    Write-Host "frontend\\.env already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Building and starting all services with Docker Compose..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services will be available at:" -ForegroundColor Cyan
Write-Host "  Frontend:      http://localhost:5173" -ForegroundColor White
Write-Host "  Auth Service:  http://localhost:9001" -ForegroundColor White
Write-Host "  Core Service:  http://localhost:9002" -ForegroundColor White
Write-Host "  Grade Service: http://localhost:9003" -ForegroundColor White
Write-Host "  Chatbot:       http://localhost:9014" -ForegroundColor White
Write-Host "  Database:      localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "Test account: student / 123456" -ForegroundColor Yellow
Write-Host ""

# Run docker compose
if (Get-Command docker -ErrorAction SilentlyContinue) {
    docker compose up --build
} else {
    Write-Host "Docker command not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Demo stopped. Services are shut down." -ForegroundColor Green
