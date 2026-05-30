import pytest
from back.db.menu import Category, MenuItem
from back.tests.conftest import client

def test_add_item_to_cart(client, user_token_header, menu_item):
    response = client.post(
        "/cart/add-item",
        headers=user_token_header,
        json={
            "menu_item_id": menu_item.id,
            "quantity": 2
        }
    )

    assert response.status_code == 200


def test_add_item_to_cart_invalid_item(client, user_token_header):
    response = client.post(
        "/cart/add-item",
        headers=user_token_header,
        json={
            "menu_item_id": 999999,
            "quantity": 1
        }
    )

    assert response.status_code == 400


def test_add_item_to_cart_unauthorized(client, menu_item):
    response = client.post(
        "/cart/add-item",
        json={
            "menu_item_id": menu_item.id,
            "quantity": 1
        }
    )

    assert response.status_code == 401


def test_get_cart_items(client, user_token_header, menu_item):
    client.post(
        "/cart/add-item",
        headers=user_token_header,
        json={
            "menu_item_id": menu_item.id,
            "quantity": 2
        }
    )

    response = client.get(
        "/cart/cart-items",
        headers=user_token_header
    )

    assert response.status_code == 200


def test_get_cart_items_unauthorized(client):
    response = client.get("/cart/cart-items")

    assert response.status_code == 401


def test_update_cart_item_quantity(client, user_token_header, menu_item):
    client.post(
        "/cart/add-item",
        headers=user_token_header,
        json={
            "menu_item_id": menu_item.id,
            "quantity": 1
        }
    )

    response = client.patch(
        "/cart/update-item",
        headers=user_token_header,
        json={
            "menu_item_id": menu_item.id,
            "quantity": 5
        }
    )

    assert response.status_code == 200


def test_update_cart_item_not_exists(client, user_token_header):
    response = client.patch(
        "/cart/update-item",
        headers=user_token_header,
        json={
            "menu_item_id": 999999,
            "quantity": 5
        }
    )

    assert response.status_code in (400, 409)


def test_remove_cart_item(client, user_token_header,menu_item):
    client.post(
        "/cart/add-item",
        headers=user_token_header,
        json={
            "menu_item_id": menu_item.id,
            "quantity": 1
        }
    )

    response = client.delete(
        f"/cart/remove-item?menu_item_id={menu_item.id}",
        headers=user_token_header
    )

    assert response.status_code == 200


def test_remove_cart_item_not_found(client, user_token_header):
    response = client.delete(
        "/cart/remove-item?menu_item_id=999999",
        headers=user_token_header
    )

    assert response.status_code == 404


def test_clear_cart(client,user_token_header, menu_item):
    client.post(
        "/cart/add-item",
        headers=user_token_header,
        json={
            "menu_item_id": menu_item.id,
            "quantity": 2
        }
    )

    response = client.delete(
        "/cart/clear-cart",
        headers=user_token_header
    )

    assert response.status_code == 200


def test_clear_cart_unauthorized(client):
    response = client.delete("/cart/clear-cart")

    assert response.status_code == 401


def test_place_order(client, user_token_header, menu_item):
    client.post(
        "/cart/add-item",
        headers=user_token_header,
        json={
            "menu_item_id": menu_item.id,
            "quantity": 1
        }
    )

    response = client.post(
        "/cart/place-order",
        headers=user_token_header
    )

    assert response.status_code == 200

    data = response.json()

    assert "order_id" in data


def test_place_order_empty_cart(client, user_token_header):
    response = client.post(
        "/cart/place-order",
        headers=user_token_header
    )

    assert response.status_code in (400, 409)


def test_get_order_history(client, user_token_header, menu_item):
    client.post(
        "/cart/add-item",
        headers=user_token_header,
        json={
            "menu_item_id": menu_item.id,
            "quantity": 1
        }
    )

    client.post(
        "/cart/place-order",
        headers=user_token_header
    )

    response = client.get(
        "/cart/orders",
        headers=user_token_header
    )

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_order_history_unauthorized(client):
    response = client.get("/cart/orders")

    assert response.status_code == 401