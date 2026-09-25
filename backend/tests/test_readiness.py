from fastapi.testclient import TestClient
from app.main import app
from app.seed import seed_database

client = TestClient(app)

def get_auth_token(email="student@skillbridge.demo", password="Student@123"):
    resp = client.post("/api/auth/login", json={"email": email, "password": password})
    return resp.json()["access_token"]

def test_readiness_calculation():
    seed_database()
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/readiness", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["target_role"] == "Backend Developer"
    assert "overall_readiness" in data
    assert data["highest_impact_gap"] == "REST API"

def test_skill_gaps_endpoint():
    token = get_auth_token()
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/skill-gaps", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["gaps"]) > 0
