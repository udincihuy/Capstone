#!/bin/sh
set -e

echo "🔄 Waiting for PostgreSQL to be ready..."
sleep 5

echo "🔄 Starting database initialization..."
python init_db.py || {
    echo "⚠️  Database init failed, but continuing..."
}

echo "✅ Starting server..."
python -m uvicorn main:app --host 0.0.0.0 --port 8000
