import pytest
from unittest.mock import Mock, patch
from fastapi import HTTPException

from services.user import UserService
from models.user import User_Create

@patch("services.user.get_user_by_email")
@patch("services.user.get_user_by_username")
@patch("services.user.create_user")
def test_register_user_success(mock_create_user, mock_get_by_username, mock_get_by_email):
    mock_db = Mock()

    mock_get_by_email.return_value = None
    mock_get_by_username.return_value = None
    mock_create_user.return_value = {"id": 1, "username": "testuser", "email": "test@example.com"}

    service = UserService(mock_db)

    user_data = User_Create(
        username="testuser",
        email="test@example.com",
        password="TestPass123",
        phone_number="+48123123123"
    )

    result = service.register_user(user_data)

    assert result["username"] == user_data.username
    assert result["email"] == user_data.email

@patch("services.user.get_user_by_username")
@patch("services.user.get_user_by_email")
def test_register_user_duplicate_email(mock_get_by_email, mock_get_by_username):
    mock_db = Mock()

    service = UserService(mock_db)

    user_data = User_Create(
        username="testuser",
        email="existing@example.com",
        password="TestPass123",
        phone_number="+48123123123"
    )

    mock_get_by_email.return_value = {"id": 1, "email": user_data.email}
    mock_get_by_username.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        service.register_user(user_data)
    
    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Email already exists"

@patch("services.user.get_user_by_email")
@patch("services.user.get_user_by_username")
def test_register_user_duplicate_username(mock_get_by_username, mock_get_by_email):
    mock_db = Mock()
    service = UserService(mock_db)

    user_data = User_Create(
        username="testuser",
        email="existing@example.com",
        password="TestPass123",
        phone_number="+48123123123"
    )

    mock_get_by_username.return_value = {"id": 1, "username": user_data.username}
    mock_get_by_email.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        service.register_user(user_data)

    assert exc_info.value.status_code == 400
    assert exc_info.value.detail == "Username already exists"

@patch("services.user.verify_password")
@patch("services.user.get_user_by_email")
def test_login_user_success(mock_get_by_email, mock_verify_password):
    mock_db = Mock()

    service = UserService(mock_db)

    mock_user = Mock(id=1, email="test@example.com", hashed_password="hashed_pass")
    mock_get_by_email.return_value = mock_user
    mock_verify_password.return_value = True

    result = service.login_user("test@example.com", "TestPass123")

    mock_get_by_email.assert_called_once_with(mock_db, "test@example.com")
    mock_verify_password.assert_called_once_with("TestPass123", "hashed_pass")
    
    assert result.id == 1
    assert result.email == "test@example.com"


@patch("services.user.verify_password")
@patch("services.user.get_user_by_email")
def test_login_user_invalid_password(mock_get_by_email, mock_verify_password):
    mock_db = Mock()

    service = UserService(mock_db)

    mock_user = Mock(id=1, email="test@example.com", hashed_password="hashed_pass")
    mock_get_by_email.return_value = mock_user
    mock_verify_password.return_value = False

    with pytest.raises(HTTPException) as exc_info:
        service.login_user("test@example.com", "WrongPass")

    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid email or password"

@patch("services.user.verify_password")
@patch("services.user.get_user_by_email")
def test_login_user_nonexistent_email(mock_get_by_email, mock_verify_password):
    mock_db = Mock()

    service = UserService(mock_db)

    mock_get_by_email.return_value = None
    mock_verify_password.return_value = True

    with pytest.raises(HTTPException) as exc_info:
        service.login_user("invalid@example.com", "TestPass123")
    
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail == "Invalid email or password"

@patch("services.user.set_admin_role")
def test_set_user_role_admin_success(mock_set_admin_role):
    mock_db = Mock()
    service = UserService(mock_db)
    
    mock_user = Mock(id=1, username="test_user", role="admin")
    mock_set_admin_role.return_value = mock_user

    result = service.set_user_role_admin(1)

    assert result.role == "admin"

@patch("services.user.get_user_by_id")
def test_set_user_role_admin_user_not_found(mock_get_user_by_id):
    mock_db = Mock()
    service = UserService(mock_db)

    mock_get_user_by_id.return_value = None

    with pytest.raises(HTTPException) as exc_info:
        service.set_user_role_admin(999)

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "User not found"

@patch("services.user.get_user_by_id")
def test_set_user_role_admin_already_admin(mock_get_user_by_id):
    mock_db = Mock()
    service = UserService(mock_db)

    mock_user = Mock(id=1, username="test_user", role="admin")
    mock_get_user_by_id.return_value = mock_user

    with pytest.raises(HTTPException) as exc_info:
        service.set_user_role_admin(1)

    assert exc_info.value.status_code == 409
    assert exc_info.value.detail == "User is already an admin"

    


    



