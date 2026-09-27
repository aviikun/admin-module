# Satark Drishti — Inspector Portal (Member 2)

React + Vite Inspector Portal for Satark Drishti. This is a website section/portal, not a separate Flutter app.

## Connected to Member 3

The portal now consumes the FastAPI backend at `http://localhost:8000` by default.

- `GET /api/schedule` — inspection schedule
- `GET /api/inspections` — inspection records
- `GET /api/inspections/{id}` — record detail
- `POST /api/inspections` — submit an inspection record

Set `VITE_API_BASE_URL` in `.env` if the backend runs somewhere else. See `.env.example`.

## Current screens

- Inspection Schedule
- Inspection Details
- On-Site Inspection workflow
- Inspection Records
- Inspection Record Detail

## Intentionally not implemented

Database/PostgreSQL/PostGIS, camera/live photo capture, GPS capture, offline sync, CCTV/RTSP/MediaMTX/WebRTC, authentication, AI, notifications, analytics, and other Member 4/5/6 work are not included in this module.

## Run

```powershell
npm install
npm run dev
```

The FastAPI backend must be running for live schedule/record data:

```powershell
cd ..\backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Then run the portal from `inspector-portal` with `npm run dev`.
