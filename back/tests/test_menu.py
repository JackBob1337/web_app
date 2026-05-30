import pytest
from io import BytesIO

def test_create_category(client, admin_token_header):
    response = client.post(
        "/menu/create_category",
        headers=admin_token_header,
        json={"name": "Pizza"}
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Pizza"

def test_create_category_forbidden(client):
    response = client.post(
        "/menu/create_category",
        json={"name": "Pizza"}
    )

    assert response.status_code == 401

def test_create_category_not_admin(client, user_token_header):
    response = client.post(
        "/menu/create_category",
        headers=user_token_header,
        json={"name": "Pizza"}
    )

    assert response.status_code == 403

def test_get_category_by_name(client, admin_token_header, category):
    response = client.get(
        f"/menu/get_category_by_name/{category.name}",
        headers=admin_token_header
    )

    assert response.status_code == 200
    assert response.json()["name"] == category.name


def test_create_menu_item(client, admin_token_header, category):
    file = BytesIO(b"fake image data")

    response = client.post(
        "/menu/create_item",
        headers=admin_token_header,
        files={"image": ("test.jpg", file, "image/jpeg")},
        data={
            "name": "Pepperoni",
            "description": "Test",
            "price_cents": 1000,
            "stock": 10,
            "is_available": True,
            "category_id": category.id
        }
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Pepperoni"

def test_create_item_invalid_file(client, admin_token_header, category):
    file = BytesIO(b"fake")

    response = client.post(
        "/menu/create_item",
        headers=admin_token_header,
        files={"image": ("test.txt", file, "text/plain")},
        data={
            "name": "Pizza",
            "price_cents": 1000,
            "stock": 10,
            "category_id": category.id
        }
    )

    assert response.status_code == 400

def test_create_item_large_file(client, admin_token_header, category):
    file = BytesIO(b"x" * (9 * 1024 * 1024))  # 9MB

    response = client.post(
        "/menu/create_item",
        headers=admin_token_header,
        files={"image": ("big.jpg", file, "image/jpeg")},
        data={
            "name": "Pizza",
            "price_cents": 1000,
            "stock": 10,
            "category_id": category.id
        }
    )

    assert response.status_code == 400

def test_create_item_unauthorized(client, category):
    file = BytesIO(b"img")

    response = client.post(
        "/menu/create_item",
        files={"image": ("test.jpg", file, "image/jpeg")},
        data={
            "name": "Pizza",
            "price_cents": 1000,
            "stock": 10,
            "category_id": category.id
        }
    )

    assert response.status_code == 401

def test_get_items_by_category(client, admin_token_header, category):
    response = client.get(
        f"/menu/get_items_by_category/{category.id}"
    )

    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_update_menu_item(client, admin_token_header, menu_item):
    response = client.patch(
        f"/menu/update_item/{menu_item.id}",
        headers=admin_token_header,
        json={
            "name": "Updated Pizza"
        }
    )

    assert response.status_code == 200
    assert response.json()["name"] == "Updated Pizza"

def test_update_item_unauthorized(client, menu_item):
    response = client.patch(
        f"/menu/update_item/{menu_item.id}",
        json={"name": "X"}
    )

    assert response.status_code == 401

def test_update_item_not_found(client, admin_token_header):
    response = client.patch(
        "/menu/update_item/999999",
        headers=admin_token_header,
        json={"name": "X"}
    )

    assert response.status_code == 404

def test_delete_menu_item(client, admin_token_header, menu_item):
    response = client.delete(
        f"/menu/delete_item/{menu_item.id}",
        headers=admin_token_header
    )

    assert response.status_code == 200

def test_delete_item_forbidden(client, user_token_header, menu_item):
    response = client.delete(
        f"/menu/delete_item/{menu_item.id}",
        headers=user_token_header
    )

    assert response.status_code == 403