# 🚀 SETUP GUIDE - Anti-Phishing Backend

Panduan lengkap untuk setup dan menjalankan sistem anti-phishing backend.

## ✅ Prerequisites

Pastikan sudah terinstall:
- Python 3.8+
- PostgreSQL 12+ (atau use Docker)
- pip atau uv package manager

## 📦 Step 1: Install Dependencies

```bash
# Di folder d:\capstone\backend
cd d:\capstone\backend

# Activate virtual environment (jika belum)
.\.venv\Scripts\Activate.ps1

# Install dependencies dari requirements.txt
pip install -r requirements.txt
```

## 🗄️ Step 2: Setup PostgreSQL Database

### Option A: Using PostgreSQL Locally (Windows)

1. **Install PostgreSQL** dari https://www.postgresql.org/download/windows/

2. **Start PostgreSQL Service**:
   - Windows: Buka Services (services.msc), cari "postgresql-x64-xx", pastikan running
   - Atau: `net start postgresql-x64-14` (sesuaikan versi)

3. **Create Database & User**:
   ```sql
   -- Buka pgAdmin atau gunakan psql command line
   CREATE USER phishing_user WITH PASSWORD 'phishing_pass';
   CREATE DATABASE phishing_db OWNER phishing_user;
   ```

4. **Update `.env` file**:
   ```bash
   # d:\capstone\backend\.env
   DATABASE_URL=postgresql+asyncpg://phishing_user:phishing_pass@localhost:5432/phishing_db
   APP_NAME=Anti-Phishing Risk Scoring System
   DEBUG=True
   ```

### Option B: Using Docker (Recommended for Quick Start)

1. **Install Docker** dari https://www.docker.com/products/docker-desktop

2. **Run PostgreSQL Container**:
   ```bash
   docker run --name phishing_db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=phishing_db \
     -p 5432:5432 \
     -d postgres:15
   ```

3. **Update `.env` file**:
   ```bash
   DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/phishing_db
   APP_NAME=Anti-Phishing Risk Scoring System
   DEBUG=True
   ```

4. **Verify Connection**:
   ```bash
   # Test apakah PostgreSQL accessible
   .\.venv\Scripts\python.exe -c "import asyncpg; print('✅ asyncpg installed')"
   ```

## 🌱 Step 3: Initialize Database (Create Tables & Seed Data)

```bash
# Navigate ke backend folder
cd d:\capstone\backend

# Run init script
.\.venv\Scripts\python.exe init_db.py
```

**Expected Output**:
```
🔄 Starting database initialization...
📌 Database URL: postgresql+asyncpg://...
📋 Creating database tables...
✅ Tables created successfully!
🌱 Inserting seed data...
  ✅ Added 7 whitelisted URLs
  ✅ Added 6 whitelisted phone numbers
✅ Seed data inserted successfully!

🎉 Database initialization completed!
```

Jika error, pastikan:
- PostgreSQL service sudah running
- DATABASE_URL di `.env` benar
- Username/password sesuai

## 🚀 Step 4: Run FastAPI Server

```bash
# Di folder d:\capstone\backend
cd d:\capstone\backend

# Activate venv (jika belum)
.\.venv\Scripts\Activate.ps1

# Run server
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

**Expected Output**:
```
INFO:     Started server process [XXXX]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

✅ Server ready di: http://127.0.0.1:8000

## 📚 Step 5: Access API

### Interactive Documentation

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

### Health Check

```bash
curl http://127.0.0.1:8000/health
```

## 🧪 Step 6: Test Endpoints

### Test 1: Submit Message

```bash
# PowerShell
$body = @{
    raw_message = "Klik di sini segera! https://phishing-site.com dan hubungi +62215250200"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/submissions" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

**Or with cURL**:
```bash
curl -X POST http://127.0.0.1:8000/api/submissions \
  -H "Content-Type: application/json" \
  -d "{\"raw_message\":\"Klik di sini segera! https://phishing-site.com dan hubungi +62215250200\"}"
```

**Expected Response**:
```json
{
  "ticket_id": "550e8400-e29b-41d4-a716-446655440000",
  "risk_score": 85.0,
  "extracted_urls": ["https://phishing-site.com"],
  "extracted_phones": ["+62215250200"]
}
```

### Test 2: Check Submission Status

```bash
curl http://127.0.0.1:8000/api/submissions/{ticket_id}
```

Replace `{ticket_id}` dengan ticket_id dari response sebelumnya.

### Test 3: Admin List Submissions (Triage)

```bash
curl http://127.0.0.1:8000/admin/submissions?sort_by_risk=true&limit=10
```

### Test 4: Admin Update Submission

```bash
curl -X PUT http://127.0.0.1:8000/admin/submissions/{ticket_id} \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"reviewed\",\"final_decision\":\"phishing\"}"
```

## 🐛 Troubleshooting

### Error: "Could not import module main"
- Pastikan working directory adalah `d:\capstone\backend`
- Pastikan `.env` file sudah ada

### Error: "password authentication failed"
- Periksa DATABASE_URL di `.env` file
- Pastikan PostgreSQL service running
- Pastikan username/password benar

### Error: "Module not found: sqlalchemy"
- Jalankan: `pip install -r requirements.txt`
- Pastikan venv ter-activate

### Port 8000 already in use
- Gunakan port berbeda: `uvicorn main:app --reload --port 8001`
- Atau kill process yang menggunakan port 8000

## 📝 Environment Variables

File `.env` harus berisi:

```env
# Database (required)
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/phishing_db

# App settings
APP_NAME=Anti-Phishing Risk Scoring System
DEBUG=True
```

## 🔗 Folder Structure (Quick Reference)

```
d:\capstone\backend/
├── app/
│   ├── api/              # Endpoints
│   ├── core/             # Config, Database
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic
│   └── __init__.py
├── main.py               # FastAPI app
├── init_db.py            # DB initialization
├── requirements.txt      # Dependencies
├── .env                  # Environment (create from .env.example)
├── .env.example          # Template
└── README.md             # API documentation
```

## 🎯 Next Steps

1. ✅ Setup PostgreSQL
2. ✅ Run `init_db.py` untuk create tables
3. ✅ Run `uvicorn` untuk start server
4. ✅ Test endpoints di Swagger UI (/docs)
5. 🚀 Integrate IndoBERT model di `app/services/ml_scoring_service.py`

---

Butuh bantuan? Cek dokumentasi API di http://127.0.0.1:8000/docs setelah server running.

Good luck! 🎉
