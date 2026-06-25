"""Backend API tests for ZenBot Employee Assistant.
Tests three minimal endpoints: /api/, /api/health, /api/config.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://zensar-hr-connect.preview.emergentagent.com").rstrip("/")


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# /api/ root
class TestRoot:
    def test_root_status(self, client):
        r = client.get(f"{BASE_URL}/api/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("service") == "zensar-ai-assistant"
        assert data.get("status") == "ok"


# /api/health endpoint
class TestHealth:
    def test_health_status(self, client):
        r = client.get(f"{BASE_URL}/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "healthy"
        assert data.get("supabase_configured") is True


# /api/config endpoint
class TestConfig:
    def test_config_returns_supabase(self, client):
        r = client.get(f"{BASE_URL}/api/config")
        assert r.status_code == 200
        data = r.json()
        assert "supabase_url" in data
        assert "supabase_publishable_key" in data
        assert data["supabase_url"].startswith("https://")
        assert len(data["supabase_publishable_key"]) > 0


# 404 behavior for unknown api routes
class TestNotFound:
    def test_unknown_api_route(self, client):
        r = client.get(f"{BASE_URL}/api/does-not-exist")
        # FastAPI returns 404 for unknown routes
        assert r.status_code == 404
