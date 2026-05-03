FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Run init_db and then start server
CMD ["sh", "-c", "python init_db.py && python -m uvicorn main:app --host 0.0.0.0 --port 8000"]
