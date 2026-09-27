# Satark Drishti — Backend (Member 3)

This folder contains **only Member 3's scope**: an independent FastAPI
backend that will later connect to:

- **Member 2** — Inspector Portal (React), as an API consumer
- **Member 4** — PostgreSQL + PostGIS, as the future storage layer
- **Member 1** — Authority Website, as another API consumer

## Technologies used

- Python
- FastAPI
- Pydantic (data validation / schemas)
- Uvicorn (ASGI server)
- python-dotenv (loads `.env` for configuration such as CORS origins)

No database, ORM, or authentication library has been added — see
"Intentionally not implemented yet" below.

## Folder structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI app, CORS, health check, router mounting
│   ├── api/
│   │   ├── router.py             # combines all route modules under /api
│   │   └── routes/
│   │       ├── users.py
│   │       ├── schedules.py
│   │       └── inspections.py
│   ├── schemas/
│   │   ├── user.py
│   │   ├── schedule.py
│   │   └── inspection.py
│   └── services/
│       ├── user_service.py       # in-memory demo user data
│       ├── schedule_service.py   # in-memory demo schedule data + generator
│       └── inspection_service.py # in-memory demo inspection records
├── requirements.txt
├── .env.example
└── README.md
```

`schemas/` defines the shape of API data (Pydantic models). `services/`
holds the in-memory demo "storage" and logic. `api/routes/` defines the
actual HTTP endpoints and stays thin — it just calls into `services/`.
This separation is what will let Member 4's database calls replace the
in-memory lists in `services/` without touching the routes or schemas.

## APIs available

All routes are mounted under `/api`.

| Method | Path                     | Description                                   |
|--------|--------------------------|------------------------------------------------|
| GET    | `/api/health`            | Liveness check → `{"status": "ok"}`            |
| GET    | `/api/users`             | List demo users/inspectors                     |
| GET    | `/api/users/{user_id}`   | Get one demo user by id (404 if missing)       |
| GET    | `/api/schedule`          | List demo inspection schedule entries          |
| POST   | `/api/schedule/generate` | Generate random demo schedule entries (`?count=`, default 3) |
| GET    | `/api/inspections`       | List demo inspection records                   |
| GET    | `/api/inspections/{id}`  | Get one demo inspection record (404 if missing)|
| POST   | `/api/inspections`       | Create a new demo inspection record            |

Interactive Swagger documentation is available at **`/docs`** once the
server is running (e.g. `http://127.0.0.1:8000/docs`).

## Demo data notice

All data returned by this API — users, schedule entries, inspection
records — is **demo/in-memory data created for testing only**. It resets
every time the server restarts and does not represent real government or
NGO information.

## How to run

1. Create and activate a virtual environment:

   ```
   python -m venv .venv
   ```

   - Windows: `.venv\Scripts\activate`
   - macOS/Linux: `source .venv/bin/activate`

2. Install requirements:

   ```
   pip install -r requirements.txt
   ```

3. (Optional) Copy `.env.example` to `.env` and adjust `ALLOWED_ORIGINS`
   if the Inspector Portal runs on a different address.

4. Run the server:

   ```
   uvicorn app.main:app --reload
   ```

5. Open Swagger docs at:

   ```
   http://127.0.0.1:8000/docs
   ```

## CORS

The API allows browser requests from the Inspector Portal's local dev
server by default:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

This list is read from `ALLOWED_ORIGINS` in `.env` (comma-separated), and
falls back to the two origins above if not set.

## Intentionally NOT implemented yet

Per Member 3's scope for this phase, the following are deliberately left
out:

- PostgreSQL / PostGIS (Member 4's responsibility) — data is in-memory
  and resets on restart
- A real authentication/authorization system
- React/Flutter frontend code
- Camera, GPS, live photo or video capture
- Offline storage or sync
- CCTV, RTSP, MediaMTX, WebRTC
- AI/ML features
- Notifications
- Analytics or reports

The service layer (`app/services/`) is deliberately isolated from the
route layer so that when Member 4's database is ready, only the service
functions need to change — the API routes, request/response schemas, and
URL contract stay the same for Member 2's Inspector Portal.
