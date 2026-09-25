from fastapi.testclient import TestClient
from app.main import app
from app.seed import seed_database

client = TestClient(app)

def test_recruiter_feedback_adaptive_loop():
    seed_database()
    # 1. Login as recruiter
    rec_resp = client.post("/api/auth/login", json={"email": "recruiter@skillbridge.demo", "password": "Recruiter@123"})
    rec_token = rec_resp.json()["access_token"]
    rec_headers = {"Authorization": f"Bearer {rec_token}"}

    # 2. Get applications
    apps_resp = client.get("/api/applications", headers=rec_headers)
    assert apps_resp.status_code == 200
    apps = apps_resp.json()
    assert len(apps) > 0
    app_id = apps[0]["id"]

    # 3. Submit feedback requesting REST API & deployment experience
    fb_resp = client.post(
        f"/api/applications/{app_id}/feedback",
        json={"feedback_text": "Candidate needs stronger REST API experience and backend deployment exposure."},
        headers=rec_headers
    )
    assert fb_resp.status_code == 200
    fb_data = fb_resp.json()
    assert "REST API" in fb_data["details"]["extracted_skills"]

    # 4. Login as student & verify updated roadmap
    stud_resp = client.post("/api/auth/login", json={"email": "student@skillbridge.demo", "password": "Student@123"})
    stud_token = stud_resp.json()["access_token"]
    stud_headers = {"Authorization": f"Bearer {stud_token}"}

    roadmap_resp = client.get("/api/roadmap", headers=stud_headers)
    assert roadmap_resp.status_code == 200
    items = roadmap_resp.json()["items"]
    rest_items = [i for i in items if i["skill_name"] == "REST API"]
    assert len(rest_items) > 0
    assert rest_items[0]["priority"] == "HIGH"
