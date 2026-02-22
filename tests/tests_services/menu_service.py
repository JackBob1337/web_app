import pytest
from types import SimpleNamespace
from unittest.mock import Mock, patch

from services.domain_errors import NotFoundError, ConflictError, ValidationError
from services.menu import MenuService
from models.menu import CategoryCreate, CategoryUpdate, MenuItemCreate, MenuItemUpdate

@patch("services.menu.menu_crud.create_category")
def test_create_category(mock_create_category):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_category = SimpleNamespace(id=1, name="Test Category")
    mock_create_category.return_value = mock_category

    result = service.create_category("Test Category")

    assert result.name == "Test Category"

@patch("services.menu.menu_crud.create_category")
def test_create_existing_category(mock_create_category):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_create_category.return_value = None

    with pytest.raises(ConflictError) as exc_info:
        service.create_category("Existing Category")

    assert str(exc_info.value) == "Category already exists"

@patch("services.menu.menu_crud.get_category_by_id")
def test_get_category_by_id(mock_get_category_by_id):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_category = SimpleNamespace(id=1, name="Test Category")
    mock_get_category_by_id.return_value = mock_category

    result = service.get_category_by_id(1)

    assert result.name == "Test Category"

@patch("services.menu.menu_crud.get_category_by_id")
def test_get_nonexisting_category_by_id(mock_get_category_by_id):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_category_by_id.return_value = None

    with pytest.raises(NotFoundError) as exc_info:
        service.get_category_by_id(999)

    assert str(exc_info.value) == "Category not found"

@patch("services.menu.menu_crud.get_category_by_name")
def test_get_category_by_name(mock_get_category_by_name):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_category = SimpleNamespace(id=1, name="Test Category")
    mock_get_category_by_name.return_value = mock_category

    result = service.get_category_by_name("Test Category")

    assert result.name == "Test Category"

@patch("services.menu.menu_crud.get_category_by_name")
def get_nonexisting_category_by_name(mock_get_category_by_name):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_category_by_name.return_value = None

    with pytest.raises(NotFoundError) as exc_info:
        service.get_category_by_name("Nonexisting Category")
    
    assert str(exc_info.value) == "Category not found"

@patch("services.menu.menu_crud.get_all_categories")
def test_get_all_categories(mock_get_all_categories):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_categories = [SimpleNamespace(id=1, name="Category 1"), SimpleNamespace(id=2, name="Category 2")]
    mock_get_all_categories.return_value = mock_categories

    result = service.get_all_categories()

    assert len(result) == 2
    assert result[0].name == "Category 1"
    assert result[1].name == "Category 2"

@patch("services.menu.menu_crud.get_all_categories")
def test_get_all_categories_empty(mock_get_all_categories):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_all_categories.return_value = []

    result = service.get_all_categories()

    assert result == []

@patch("services.menu.menu_crud.delete_category")
def test_delete_category(mock_delete_category):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_category = SimpleNamespace(id=1, name="Test Category")

    mock_delete_category.return_value = mock_category

    result = service.delete_category(1)

    assert result.name == "Test Category"

@patch("services.menu.menu_crud.delete_category")
def test_delete_nonexisting_category(mock_delete_category):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_delete_category.return_value = None

    with pytest.raises(NotFoundError) as exc_info:
        service.delete_category(999)

    assert str(exc_info.value) == "Category not found"

@patch("services.menu.menu_crud.get_category_by_name")
@patch("services.menu.menu_crud.update_category")
def test_update_category(mock_update_category, mock_get_category_by_name):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_category_by_name.return_value = None
    mock_category = SimpleNamespace(id=1, name="Update Category")
    mock_update_category.return_value = mock_category

    result = service.update_category(1, "Test Category")

    assert result.name == "Update Category"

@patch("services.menu.menu_crud.get_category_by_name")
@patch("services.menu.menu_crud.update_category")
def test_update_category_conflict(mock_update_category, mock_get_category_by_name):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_category_by_name.return_value = SimpleNamespace(id=2, name="Existing Category")

    with pytest.raises(ConflictError) as exc_info:
        service.update_category(1, "Existing Category")

    assert str(exc_info.value) == "Category with the same name already exists"

@patch("services.menu.menu_crud.get_category_by_name")
@patch("services.menu.menu_crud.update_category")
def test_update_nonexisting_category(mock_update_category, mock_get_category_by_name):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_category_by_name.return_value = None
    mock_update_category.return_value = None

    with pytest.raises(NotFoundError) as exc_info:
        service.update_category(999, "Test Category")

    assert str(exc_info.value) == "Category not found"

@patch("services.menu.menu_crud.get_category_with_items")
def test_get_category_with_items(mock_get_category_with_items):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_category = SimpleNamespace(id=1, name="Test Category", items=[SimpleNamespace(id=1, name="Item 1"), SimpleNamespace(id=2, name="Item 2")])
    mock_get_category_with_items.return_value = mock_category

    result = service.get_category_with_items(1)
    
    assert result.name == "Test Category"
    assert len(result.items) == 2
    assert result.items[0].name == "Item 1"
    assert result.items[1].name == "Item 2"