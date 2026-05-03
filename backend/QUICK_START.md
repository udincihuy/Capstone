# 🚀 QUICK START - Anti-Phishing Backend

## ⏱️ 3 Langkah untuk Menjalankan

### **Step 1: Setup Database (5 menit)**

**Menggunakan Docker (Recommended):**
```powershell
docker run --name phishing_db `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=phishing_db `
  -p 5432:5432 `
  -d postgres:15

# Verify
docker ps
```

**Atau Local PostgreSQL:**
- Install PostgreSQL dari https://www.postgresql.org/download/
- Create database: `createdb -U postgres phishing_db`
- Update `.env` dengan credentials

---

### **Step 2: Initialize Backend (2 menit)**

```powershell
# Go to backend folder
cd d:\capstone\backend

# Create .env from template
cp .env.example .env
# Edit DATABASE_URL if needed

# Install dependencies
pip install -r requirements.txt

# Initialize database (creates tables + seed data)
python init_db.py
```

**Expected Output:**
```
✅ Connected to database
✅ Created submissions table
✅ Created whitelist_urls table
✅ Created whitelist_phones table
✅ Added 7 whitelisted URLs
✅ Added 6 whitelisted phone numbers
✅ Database initialized successfully!
```

---

### **Step 3: Start Server (1 menit)**

```powershell
uvicorn main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

**Open in Browser:**
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc
- Health: http://127.0.0.1:8000/health

---

## 🧪 Testing

### **Option 1: Swagger UI (Interactive)**
1. Open http://127.0.0.1:8000/docs
2. Try out endpoints:
   - `POST /api/submissions` - Submit message
   - `GET /api/submissions/{ticket_id}` - Check status
   - `GET /admin/submissions` - List all
   - `PUT /admin/submissions/{ticket_id}` - Update
