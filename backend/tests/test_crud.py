import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

# Use in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    app.dependency_overrides[get_db] = override_get_db
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.clear()


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["docs"] == "/docs"
    assert data["health"] == "/health"


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database_connected"] is True


def test_create_item(client):
    payload = {
        "title": "Test Item 1",
        "description": "Test description",
        "completed": False,
    }
    response = client.post("/api/items/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["title"] == payload["title"]
    assert data["description"] == payload["description"]
    assert data["completed"] is False
    assert "created_at" in data
    assert "updated_at" in data


def test_create_item_validation_error(client):
    # Missing required 'title' field
    response = client.post("/api/items/", json={"description": "No title"})
    assert response.status_code == 422


def test_get_items_list_and_pagination(client):
    # Create 3 items
    for i in range(3):
        client.post(
            "/api/items/",
            json={"title": f"Task {i+1}", "completed": i % 2 == 0},
        )

    # Fetch list
    response = client.get("/api/items/?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 3
    assert len(data["items"]) == 3

    # Test limit=2
    response_limited = client.get("/api/items/?skip=0&limit=2")
    assert response_limited.status_code == 200
    assert len(response_limited.json()["items"]) == 2

    # Test filter by completed=true
    response_completed = client.get("/api/items/?completed=true")
    assert response_completed.status_code == 200
    assert response_completed.json()["total"] == 2


def test_get_item_by_id(client):
    # Create an item
    create_resp = client.post("/api/items/", json={"title": "Unique Task"})
    item_id = create_resp.json()["id"]

    # Fetch it
    response = client.get(f"/api/items/{item_id}")
    assert response.status_code == 200
    assert response.json()["id"] == item_id
    assert response.json()["title"] == "Unique Task"


def test_get_item_not_found(client):
    response = client.get("/api/items/99999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_update_item(client):
    create_resp = client.post(
        "/api/items/",
        json={"title": "Original Title", "description": "Original desc", "completed": False},
    )
    item_id = create_resp.json()["id"]

    # Update
    update_payload = {"title": "Updated Title", "completed": True}
    update_resp = client.put(f"/api/items/{item_id}", json=update_payload)
    assert update_resp.status_code == 200
    data = update_resp.json()
    assert data["title"] == "Updated Title"
    assert data["completed"] is True
    assert data["description"] == "Original desc"


def test_patch_item(client):
    create_resp = client.post("/api/items/", json={"title": "Initial", "completed": False})
    item_id = create_resp.json()["id"]

    patch_resp = client.patch(f"/api/items/{item_id}", json={"completed": True})
    assert patch_resp.status_code == 200
    assert patch_resp.json()["completed"] is True
    assert patch_resp.json()["title"] == "Initial"


def test_delete_item(client):
    create_resp = client.post("/api/items/", json={"title": "To be deleted"})
    item_id = create_resp.json()["id"]

    # Delete
    del_resp = client.delete(f"/api/items/{item_id}")
    assert del_resp.status_code == 200

    # Ensure it no longer exists
    get_resp = client.get(f"/api/items/{item_id}")
    assert get_resp.status_code == 404


def test_delete_item_not_found(client):
    del_resp = client.delete("/api/items/99999")
    assert del_resp.status_code == 404

