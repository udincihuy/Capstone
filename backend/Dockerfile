FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY requirements-docker.txt .

# Install dependencies with CPU-only torch
RUN pip install --no-cache-dir -r requirements-docker.txt

# Copy app code
COPY . .

# Run init_db and then start server
CMD ["sh", "-c", "set -e; python init_db.py; echo 'Database initialized successfully'; python -m uvicorn main:app --host 0.0.0.0 --port 8000"]
