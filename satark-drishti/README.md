# Satark Drishti — Member 2 + Member 3 Connected Modules

This package contains only the two modules assigned to Member 2 and Member 3.

```text
satark-drishti-connected/
├── inspector-portal/   # Member 2 — React Inspector Portal
└── backend/            # Member 3 — FastAPI API
```

## Connection

```text
Inspector Portal (React)
        ↓ REST API
FastAPI Backend
        ↓
In-memory demo data (for now)
```

Member 4 can replace the backend's in-memory services with PostgreSQL/PostGIS later without changing the frontend API paths.

## Run

### Terminal 1 — Backend

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend: `http://localhost:8000`
Swagger: `http://localhost:8000/docs`

### Terminal 2 — Inspector Portal

```powershell
cd inspector-portal
npm install
npm run dev
```

The portal uses `http://localhost:8000` by default. To change it, copy `.env.example` to `.env` and set `VITE_API_BASE_URL`.

## Scope

No database, camera/GPS, offline sync, CCTV, RTSP, MediaMTX, WebRTC, authentication, AI, or other Member 4/5/6 functionality is included.
