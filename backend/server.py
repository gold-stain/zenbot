"""
ZenBot Employee Assistant backend.

The API stays intentionally small for now: it exposes health and public
configuration checks while the frontend talks to Supabase directly with the
publishable key.
"""
import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI
from starlette.middleware.cors import CORSMiddleware

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
        "supabase_configured": bool(
            os.environ.get("SUPABASE_URL")
            and os.environ.get("SUPABASE_PUBLISHABLE_KEY")
        ),
    }


@api_router.get("/config")
async def public_config():
    """Return only public Supabase config that is safe for the browser."""
    return {
        "supabase_url": os.environ.get("SUPABASE_URL", ""),
        "supabase_publishable_key": os.environ.get("SUPABASE_PUBLISHABLE_KEY", ""),
    }


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
