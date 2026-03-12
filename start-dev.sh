#!/bin/bash
# ═══════════════════════════════════════════════
#  Alpha Wealth Project — Dev Server Startup
# ═══════════════════════════════════════════════
# Usage: ./start-dev.sh
# This starts both the Django backend and React frontend.

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR"

echo "═══════════════════════════════════════════"
echo "  ALPHA WEALTH — Dev Environment"
echo "═══════════════════════════════════════════"
echo ""

# 1. Start Django backend
echo "▶ Starting Django backend on port 8000..."
cd "$BACKEND_DIR"
python3 manage.py runserver 8000 &
DJANGO_PID=$!
echo "  Django PID: $DJANGO_PID"
echo ""

# Wait for Django to be ready
sleep 2

# 2. Start React frontend
echo "▶ Starting React frontend on port 3000..."
cd "$FRONTEND_DIR"
PORT=3000 npm start &
REACT_PID=$!
echo "  React PID: $REACT_PID"
echo ""

echo "═══════════════════════════════════════════"
echo "  Backend:  http://localhost:8000/api/"
echo "  Frontend: http://localhost:3000"
echo ""
echo "  Admin:    username=admin  password=123"
echo "  User:     username=user   password=123"
echo "═══════════════════════════════════════════"
echo ""
echo "Press Ctrl+C to stop both servers."

# Trap Ctrl+C to kill both
trap "kill $DJANGO_PID $REACT_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
