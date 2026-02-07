import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from main import app
from db.base import Base
from db.session import get_db

SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

def test_register_user_ok():
    payload = {
        "username": "test_user",
        "email": "testuser@example.com",
        "password": "TestPassword123",
        "phone_number": None,
    }

    response = client.post("/auth/register", json=payload)
    data = response.json()

    assert response.status_code == 200  
    assert data["username"] == payload["username"]
    assert data["email"] == payload["email"]
    assert "password" not in data

def test_register_duplicate_email():
    payload_1 = {
        "username": "test_user",
        "email": "testuser@example.com",
        "password": "TestPassword123",
        "phone_number": None,
    }

    payload_2 = {
        "username": "test_user_2",
        "email": "testuser@example.com",
        "password": "TestPassword123",
        "phone_number": None,
    }

    client.post("/auth/register", json=payload_1)
    response = client.post("/auth/register", json=payload_2)

    assert response.status_code == 400

def test_register_duplicate_username():
    payload_1 = {
        "username": "test_user",
        "email": "testuser@gmail.com",
        "password": "TestPassword123",
        "phone_number": None,
    }

    payload_2 = {
        "username": "test_user",
        "email": "testuser_2@gmail.com",
        "password": "TestPassword123",
        "phone_number": None,
    }

    client.post("/auth/register", json=payload_1)
    response = client.post("/auth/register", json=payload_2)

    assert response.status_code == 400

def test_pwd_hasnt_digit():
    payload = {
        "username": "test_user",
        "email": "testuser@gmail.com",
        "password": "Aasdfadfscvacaasd",
        "phone_number": None,
    }

    response = client.post("/auth/register", json=payload)
    data = response.json()

    assert response.status_code == 422
    assert "Password must contain at least one digit" in data["detail"][0]["msg"]

def test_pwd_hasnt_uppercase():
    payload = {
        "username": "test_user",
        "email": "testuser@gmail.com",
        "password": "aasdfadfscvacaasd1",
        "phone_number": None,
    }

    response = client.post("/auth/register", json=payload)
    data = response.json()

    assert response.status_code == 422
    assert "Password must contain at least one uppercase letter" in data["detail"][0]["msg"]

def test_pwd_hasnt_lowercase():
    payload = {
        "username": "test_user_0",
        "email": "testuser_0@gmail.com",
        "password": "ASDFASDFASDFASDF1",
        "phone_number": None,
    }

    response = client.post("/auth/register", json=payload)

    data = response.json()
    assert response.status_code == 422
    assert "Password must contain at least one lowercase letter" in data["detail"][0]["msg"]
    