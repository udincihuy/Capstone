# Anti-Phishing System (Docker)

Aplikasi lengkap Anti-Phishing dengan Backend (FastAPI), Frontend (React), dan Database (PostgreSQL) - semuanya dalam Docker.

## Prerequisites

- Docker Desktop (https://www.docker.com/products/docker-desktop)
- Docker Compose (included dengan Docker Desktop)

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/mrizqihidayat/capstone.git
cd capstone
```

### 2. Run dengan Docker Compose
```bash
docker-compose up --build
```

Tunggu sampai semua services ready:
```
✓ db (PostgreSQL) - port 5432
✓ backend (FastAPI) - port 8000
✓ frontend (React) - port 5173
```

### 3. Akses Aplikasi
- **Frontend**: http://localhost:5173
- **Backend API**: http://127.0.0.1:8000
- **Swagger Docs**: http://127.0.0.1:8000/docs

## Services

### Database
- **Image**: postgres:15
- **Container**: phishing_db
- **User**: postgres
- **Password**: 123
- **Database**: phishing_db
- **Port**: 5432

### Backend
- **Image**: Custom Python app
- **Container**: phishing_backend
- **Framework**: FastAPI
- **Port**: 8000

### Frontend
- **Image**: Custom Node app
- **Container**: phishing_frontend
- **Framework**: React + Vite
- **Port**: 5173

## Workflow

1. **Submit Report** (Frontend)
   - Buka http://localhost:5173
   - Isi form laporan phishing
   - Click "Kirim"

2. **API Processing** (Backend)
   - Extract URLs & phone numbers
   - Calculate risk score
   - Save to database

3. **View Results**
   - Lihat risk score di frontend
   - Check admin dashboard

## Stop Services
```bash
docker-compose down
```

## Remove All (including data)
```bash
docker-compose down -v
```

## Troubleshooting

### Port sudah terpakai
```bash
# Change port di docker-compose.yml
# Contoh: "8001:8000" untuk backend port 8001
```

### Database connection error
```bash
# Cek logs
docker-compose logs db

# Restart services
docker-compose restart
```

### Frontend tidak connect ke backend
```bash
# Check VITE_API_URL di docker-compose.yml
# Should be: http://backend:8000 (internal Docker network)
```

## Development Notes

- Auto-reload enabled untuk backend
- Frontend build-optimized untuk production
- Database volume persisted (data tidak hilang setelah restart)

Selamat menggunakan! 🚀
