"""
ZenBot Employee Assistant — Backend
Intentionally minimal: the user is wiring most server logic themselves.
This file exposes a health endpoint and a Supabase config endpoint so
the frontend / future integrations can verify connectivity.
"""
from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

app = FastAPI(title="ZenBot Employee Assistant API")
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"service": "zensar-ai-assistant", "status": "ok"}


@api_router.get("/health")
async def health():
    return {
        "status": "healthy",
        "supabase_configured": bool(os.environ.get("SUPABASE_URL")),
    }


@api_router.get("/config")
async def public_config():
    """Returns non-secret Supabase config the frontend can use as a fallback."""
    return {
        "supabase_url": os.environ.get("SUPABASE_URL", ""),
        "supabase_publishable_key": os.environ.get("SUPABASE_PUBLISHABLE_KEY", ""),
    }


# Placeholder routers — to be filled in by the user
# Example expansion points:
#   /api/chat          → proxy to n8n /chat webhook
#   /api/policies      → upload trigger /embed-policy
#   /api/escalate      → routes to /escalate

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
