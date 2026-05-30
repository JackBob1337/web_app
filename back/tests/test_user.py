import pytest
from back.db.user import User as UserModel
from back.core.security import create_access_token, hash_password

def test_get_me(client, user_token_header):
    response = client.get("/users/me", headers=user_token_header)

    data = response.json()

    assert response.status_code == 200
    assert data["email"] == "testuser@example.com"
    assert "username" in data

def test_get_me_unauthorized(client):
    response = client.get("/users/me")

    assert response.status_code == 401

def test_update_profile(client, user_token_header):
    response = client.patch("/users/me", 
                            headers=user_token_header,
                            json={
                                "username": "updateduser",
                                "email": "updateduser@example.com"
                            })
  
    data = response.json()

    assert response.status_code == 200
    assert data["username"] == "updateduser"
    assert data["email"] == "updateduser@example.com"

def test_update_profile_unauthorized(client):
    response = client.patch("/users/me", json={
        "username": "updateduser",
        "email": "updateduser@example.com"
    })

    assert response.status_code == 401

def test_update_profile_duplicate_username(client, user_token_header, user, another_user):
    response = client.patch("/users/me",
                            headers=user_token_header,
                            json={
                                "username": another_user.username
                            })
    assert response.status_code == 400
    assert response.json()["detail"] == "Username already exists"

def test_update_profile_duplicate_email(client, user_token_header, another_user):
    response = client.patch("/users/me",
                            headers=user_token_header,
                            json={
                                "email": another_user.email
                            })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already exists"

def test_change_password(client, user_token_header):
    response = client.patch("/users/me/change_password",
                            headers=user_token_header,
                            json={
                                "current_password": "Password123",
                                "new_password": "NewPassword123"
                            })
    assert response.status_code == 200
    assert response.json()["message"] == "Password updated successfully"

def test_change_password_incorrect_current(client, user_token_header):
    response = client.patch("/users/me/change_password",
                            headers=user_token_header,
                            json={
                                "current_password": "WrongPassword",
                                "new_password": "NewPassword123"
                            })
    assert response.status_code == 400
    assert response.json()["detail"] == "Current password is incorrect"

def test_change_password_unauthorized(client):
    response = client.patch("/users/me/change_password", json={
        "current_password": "Password123",
        "new_password": "NewPassword123"
    })
    assert response.status_code == 401

def test_login_with_old_password_after_change(client, user_token_header, user):
    client.patch(
        "/users/me/change_password",
        headers=user_token_header,
        json={
            "current_password": "Password123",
            "new_password": "NewPassword123",
        },
    )

    response = client.post(
        "/auth/login",
        json={
            "email": "testuser@example.com",
            "password": "Password123",
        },
    )

    assert response.status_code == 401