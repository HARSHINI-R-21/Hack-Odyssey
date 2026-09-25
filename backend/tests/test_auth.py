from fastapi.testclient import TestClient
from app.main import app
from app.seed import seed_database

client = TestClient(app)

def test_login_demo_student():
    seed_database()
    response = client.post(
        "/api/auth/login",
        json={"email": "student@skillbridge.demo", "password": "Student@123"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "student@skillbridge.demo"
    assert data["user"]["role"] == "STUDENT"

def test_login_invalid_password():
    response = client.post(
        "/api/auth/login",
        json={"email": "student@skillbridge.demo", "password": "WrongPassword"}
    )
    assert response.status_code == 401
