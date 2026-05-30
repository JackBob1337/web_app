import pytest

def test_register_user(client):
    response = client.post("/auth/register", 
                           json={
                               "username": "newuser",
                               "email": "newuser@example.com",
                               "password": "TestPass123",
                               "phone_number": "0987654321"
                           })
    data = response.json()
    
    assert response.status_code == 200
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_register_user_existing_email(client, user):
    response = client.post("/auth/register", 
                           json={
                               "username": "newuser",
                               "email": "testuser@example.com",
                               "password": "TestPass123",
                               "phone_number": "0987654321"
                           })
    assert response.status_code == 400

def test_login_user(client, user):
    response = client.post("/auth/login", json={
        "email": "testuser@example.com",
        "password": "Password123"
    })

    data = response.json()

    assert response.status_code == 200
    assert "access_token" in data

def test_login_user_invalid_password(client, user):
    response = client.post("/auth/login",
                           json={
                                "email": "testuser@example.com",
                                "password": "WrongPassword"
                           })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_login_user_invalid_email(client, user):
    response = client.post("/auth/login",
                           json={
                                "email": "wrongemail@example.com",
                                "password": "Password123"
                           })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"

def test_login_validation_error(client):
    response = client.post("/auth/login", json={
        "email": "",
        "password": ""
    })

    assert response.status_code == 422

def test_login_missing_fields(client):
    response = client.post("/auth/login", json={
        "email": "test@example.com"
    })

    assert response.status_code == 422