#!/bin/sh
set -e

echo "🔄 Starting database initialization..."
python init_db.py

echo "✅ Database initialized, starting server..."
python -m uvicorn main:app --host 0.0.0.0 --port 8000
