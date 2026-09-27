"""
Satark Drishti — Backend (Member 3)

FastAPI application entry point. Run with:

    uvicorn app.main:app --reload

Swagger docs are available at /docs once the server is running.
"""

import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router

load_dotenv()  # loads variables from a local .env file, if present

app = FastAPI(
    title="Satark Drishti — Backend",
    description=(
        "Member 3 backend for Satark Drishti. Serves demo/in-memory data "
        "for users, inspection schedules and inspection records. "
        "Database integration (PostgreSQL/PostGIS) is Member 4's scope "
        "and is not implemented here."
    ),
    version="0.1.0",
)

# CORS: allow the Inspector Portal (Member 2) to call this API from the
# browser during local development. Configurable via .env / ALLOWED_ORIGINS.
_default_origins = "http://localhost:5173,http://127.0.0.1:5173"
allowed_origins = os.getenv("ALLOWED_ORIGINS", _default_origins).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", tags=["Health"])
def health_check():
    """Simple liveness check for the backend."""
    return {"status": "ok"}


app.include_router(api_router, prefix="/api")
