# Backend Anti-Phishing Sistem

Sistem anti-phishing berbasis Risk Scoring dan NLP menggunakan FastAPI dan PostgreSQL dengan Clean Architecture.

## 📁 Struktur Folder

```
backend/
├── app/
│   ├── api/                    # API Routers
│   │   ├── __init__.py
│   │   ├── submissions.py      # Public endpoints
│   │   └── admin.py            # Admin endpoints
│   ├── core/                   # Configuration & Database
│   │   ├── __init__.py
│   │   ├── config.py           # Settings & environment
│   │   └── database.py         # SQLAlchemy setup
│   ├── models/                 # SQLAlchemy Models
│   │   └── __init__.py
│   ├── schemas/                # Pydantic Models
│   │   └── __init__.py
│   ├── services/               # Business Logic
│   │   ├── __init__.py
│   │   ├── extraction_service.py    # URL/Phone extraction
│   │   ├── whitelist_service.py     # Whitelist validation
│   │   ├── ml_scoring_service.py    # Content analysis
│   │   └── scoring_aggregator.py    # Scoring aggregation
│   └── __init__.py
├── main.py                     # Entry point
├── init_db.py                  # Database initialization & seeding
├── requirements.txt            # Dependencies
├── .env.example                # Environment template
└── README.md                   # Documentation
```

## 🚀 Setup & Installation

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` ke `.env` dan sesuaikan:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/phishing_db
APP_NAME=Anti-Phishing Risk Scoring System
DEBUG=True
```

### 3. Initialize Database

Jalankan seeding dan table creation:

```bash
python init_db.py
```

### 4. Run Application

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server berjalan di: http://localhost:8000

## 📚 API Endpoints

### PUBLIC - User Submission

#### POST `/api/submissions`
Submit pesan mencurigakan untuk analisis.

**Request:**
```json
{
  "raw_message": "Klik di sini segera! Update akun Anda: https://phishing-site.com/login. Hubungi +62215250200 untuk info lebih lanjut."
}
```

**Response (200 OK):**
```json
{
  "ticket_id": "abc-123-xyz",
  "risk_score": 85.5,
  "extracted_urls": ["https://phishing-site.com/login"],
  "extracted_phones": ["+62215250200"]
}
```

#### GET `/api/submissions/{ticket_id}`
Cek status submission.

**Response (200 OK):**
```json
{
  "ticket_id": "abc-123-xyz",
  "raw_message": "Klik di sini segera! ...",
  "extracted_urls": ["https://phishing-site.com/login"],
  "extracted_phones": ["+62215250200"],
  "risk_score": 85.5,
  "status": "on_review",
  "final_decision": null,
  "created_at": "2024-01-15T10:30:00",
  "reviewed_at": null
}
```

### ADMIN - Review & Triage

#### GET `/admin/submissions?sort_by_risk=true&limit=100`
Lihat semua submission, terurut by risk score (triage).

**Query Parameters:**
- `sort_by_risk` (bool): Sort by risk score DESC
- `limit` (int): Jumlah record (default 100)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "ticket_id": "abc-123-xyz",
    "raw_message": "...",
    "extracted_urls": ["https://phishing-site.com/login"],
    "extracted_phones": ["+62215250200"],
    "risk_score": 85.5,
    "status": "on_review",
    "final_decision": null,
    "created_at": "2024-01-15T10:30:00",
    "reviewed_at": null
  }
]
```

#### GET `/admin/submissions/{ticket_id}`
Detail satu submission.

#### PUT `/admin/submissions/{ticket_id}`
Update status & keputusan submission.

**Request:**
```json
{
  "status": "reviewed",
  "final_decision": "phishing"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "ticket_id": "abc-123-xyz",
  ...
  "status": "reviewed",
  "final_decision": "phishing",
  "reviewed_at": "2024-01-15T11:45:00"
}
```

## 🧠 Scoring Logic

### Komponen Scoring:

1. **URL Whitelist Check**: +80 poin per URL yang TIDAK di whitelist
2. **Phone Whitelist Check**: +80 poin per nomor yang TIDAK di whitelist
3. **ML Content Analysis** (Mock):
   - Urgent keywords (urgen, segera, jangan, dll): +15 per keyword
   - Suspicious phrases (klik di sini, verify, confirm, dll): +20 per phrase
   - Pure text + manipulatif (2+ suspicious phrases): Skor = 100

### Skor Final: min(total_points, 100)

Contoh:
- URL tidak di whitelist: +80
- 1 nomor tidak di whitelist: +80
- ML score (2 suspicious phrases): +40
- **Total: 200 → capped at 100**

## 🗄️ Database Schema

### Submission
- `id`: Integer PK
- `ticket_id`: String unique (UUID)
- `raw_message`: Text
- `extracted_urls`: JSON array
- `extracted_phones`: JSON array
- `risk_score`: Float (0-100)
- `status`: Enum (on_review, reviewed)
- `final_decision`: Enum (phishing, safe, null)
- `created_at`: DateTime
- `reviewed_at`: DateTime nullable

### WhitelistURL
- `id`: Integer PK
- `domain`: String unique
- `is_active`: Boolean
- `created_at`: DateTime

### WhitelistPhone
- `id`: Integer PK
- `phone_number`: String unique
- `is_active`: Boolean
- `created_at`: DateTime

## 🔧 Seed Data

Default whitelist data sudah tersedia di `init_db.py`:

**Whitelisted URLs:**
- cimbniaga.co.id
- bca.co.id
- mandiri.co.id
- bni.co.id
- google.com
- github.com
- stackoverflow.com

**Whitelisted Phones:**
- +62215606666 (CIMB Niaga)
- +62215511111 (BCA)
- +62215250200 (Mandiri)
- +62212900900 (BNI)
- +62800111999 (Customer Service)
- +14041111111 (Support USA)

## 🔄 Next Steps: ML Integration

Untuk mengintegrasikan IndoBERT model:

1. Update `app/services/ml_scoring_service.py`
2. Load model pada startup
3. Replace mock `analyze_content()` dengan real prediction
4. Optionally: Add async task queue (Celery) untuk scoring async

## 📝 Development Notes

- Latensi target: < 3 detik per request
- Async operations untuk scalability
- JSON storage untuk extracted data
- Modular architecture untuk mudah maintenance & extension

## 🛠️ Testing

Test endpoints dengan cURL atau Postman:

```bash
# Submit
curl -X POST http://localhost:8000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{"raw_message":"Klik di sini segera! https://phishing.com +62215606666"}'

# Check status
curl http://localhost:8000/api/submissions/{ticket_id}

# Admin list (sorted by risk)
curl http://localhost:8000/admin/submissions?sort_by_risk=true

# Admin update
curl -X PUT http://localhost:8000/admin/submissions/{ticket_id} \
  -H "Content-Type: application/json" \
  -d '{"status":"reviewed","final_decision":"phishing"}'
```

## 📖 Documentation

FastAPI auto-generates interactive docs:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

Dibuat dengan ❤️ untuk sistem anti-phishing yang lebih baik.
