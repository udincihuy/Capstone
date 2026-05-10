FROM python:3.11-slim

WORKDIR /app

# Install dependencies
# First install torch with PyTorch official index (CPU-only)
# Then install other requirements
COPY requirements.txt .
RUN pip install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Run init_db and then start server
CMD ["sh", "-c", "set -e; python init_db.py; echo 'Database initialized successfully'; python -m uvicorn main:app --host 0.0.0.0 --port 8000"]
