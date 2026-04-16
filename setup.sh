#!/bin/bash
# Demo Setup Script - One Command to Run Everything

echo "🚀 Career Compass Demo - One Command Setup"
echo "=========================================="
echo ""

# Check if .env exists, if not copy from .env.example
if [ ! -f .env ]; then
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env created (adjust GOOGLE_API_KEY if needed)"
else
    echo "✅ .env already exists"
fi

# Check if frontend .env exists
if [ ! -f frontend/.env ]; then
    echo "📋 Creating frontend/.env..."
    cat > frontend/.env << 'EOF'
VITE_AUTH_API_BASE_URL=http://localhost:9001
VITE_CORE_API_BASE_URL=http://localhost:9002
VITE_GRADE_API_BASE_URL=http://localhost:9003
VITE_CHATBOT_API_BASE_URL=http://localhost:9014
EOF
    echo "✅ frontend/.env created"
else
    echo "✅ frontend/.env already exists"
fi

echo ""
echo "🐳 Building and starting all services with Docker Compose..."
echo "============================================================"
echo ""
echo "Services will be available at:"
echo "  🌐 Frontend:      http://localhost:5173"
echo "  🔐 Auth Service:  http://localhost:9001"
echo "  📚 Core Service:  http://localhost:9002"
echo "  📊 Grade Service: http://localhost:9003"
echo "  💬 Chatbot:       http://localhost:9014"
echo "  🗄️  Database:      localhost:5432"
echo ""
echo "Test account: student / 123456"
echo ""

# Run docker-compose
docker-compose up --build

echo ""
echo "✨ Demo stopped. Services are shut down."
