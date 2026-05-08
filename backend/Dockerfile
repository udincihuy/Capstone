FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Run init_db and then start server
# Add set -e to exit if init_db fails
CMD ["sh", "-c", "set -e; python init_db.py; echo 'Database initialized successfully'; python -m uvicorn main:app --host 0.0.0.0 --port 8000"]
