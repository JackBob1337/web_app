import pytest
from types import SimpleNamespace
from unittest.mock import Mock, patch

from services.domain_errors import NotFoundError, ConflictError, ValidationError
from services.menu import MenuService
from models.menu import CategoryCreate, CategoryUpdate, CategoryOut, MenuItemCreate, MenuItemUpdate, MenuItemOut

@patch("services.menu.menu_crud.create_category")
def test_create_category(mock_create_category):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_category = SimpleNamespace(id=1, name="Test Category")
    mock_create_category.return_value = mock_category

    result = service.create_category("Test Category")

    assert result.name == "Test Category"
    assert isinstance(result, CategoryOut)

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
    assert isinstance(result, CategoryOut)

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
    assert isinstance(result, CategoryOut)
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
    assert isinstance(result[0], CategoryOut)
    assert isinstance(result[1], CategoryOut)

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
    assert isinstance(result, CategoryOut)

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
    assert isinstance(result, CategoryOut)

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

    item1 = MenuItemOut(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=True, category_id=1)
    item2 = MenuItemOut(id=2, name="Item 2", description="", price_cents=200, stock=5, is_available=True, category_id=1)


    mock_category = SimpleNamespace(id=1, name="Test Category", items=[item1, item2])
    mock_get_category_with_items.return_value = mock_category

    result = service.get_category_with_items(1)
    
    assert result.name == "Test Category"
    assert len(result.items) == 2
    assert result.items[0].name == "Item 1"
    assert result.items[1].name == "Item 2"
    assert isinstance(result, CategoryOut)

@patch("services.menu.menu_crud.get_category_with_items")
def test_get_nonexisting_category_with_items(mock_get_category_with_items):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_category_with_items.return_value = None

    with pytest.raises(NotFoundError) as exc_info:
        service.get_category_with_items(999)

    assert str(exc_info.value) == "Category not found"

@patch("services.menu.menu_crud.get_item_by_name")
@patch("services.menu.menu_crud.get_category_by_id")
@patch("services.menu.menu_crud.create_item")
def test_create_item(mock_create_item, mock_get_category_by_id, mock_get_item_by_name):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_item = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=True, category_id=1)
    
    mock_get_category_by_id.return_value = SimpleNamespace(id=1, name="Test Category")
    mock_get_item_by_name.return_value = None
    mock_create_item.return_value = mock_item

    result = service.create_item(name="Test Item", description="", price_cents=100, stock=10, is_available=True, category_id=1)

    assert result.name == "Item 1"
    assert isinstance(result, MenuItemOut)


@patch("services.menu.menu_crud.get_item_by_name")
@patch("services.menu.menu_crud.get_category_by_id")
@patch("services.menu.menu_crud.create_item")
def test_create_item_invalid_category(mock_create_item, mock_get_category_by_id, mock_get_item_by_name):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_create_item.return_value = None
    mock_get_category_by_id.return_value = None
    mock_get_item_by_name.return_value = None

    with pytest.raises(ValidationError) as exc_info:
        service.create_item(name="Test Item", description="", price_cents=100, stock=10, is_available=True, category_id=999)

    assert str(exc_info.value) == "Category not found"

@patch("services.menu.menu_crud.get_item_by_name")
@patch("services.menu.menu_crud.get_category_by_id")
@patch("services.menu.menu_crud.create_item")
def test_create_item_existing_item(mock_create_item, mock_get_category_by_id, mock_get_item_by_name):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_item = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=True, category_id=1)
    
    mock_get_category_by_id.return_value = SimpleNamespace(id=1, name="Test Category")
    mock_get_item_by_name.return_value = mock_item
    mock_create_item.return_value = mock_item

    with pytest.raises(ConflictError) as exc_info:
        service.create_item(name="Test Item", description="", price_cents=100, stock=10, is_available=True, category_id=1)

    assert str(exc_info.value) == "Item with the same name already exists in the category"

@patch("services.menu.menu_crud.get_item_by_id")
def test_get_item_by_id(mock_get_item_by_id):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_item = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=True, category_id=1)
    mock_get_item_by_id.return_value = mock_item

    result = service.get_item_by_id(1)

    assert result.name == "Item 1"
    assert isinstance(result, MenuItemOut)

@patch("services.menu.menu_crud.get_item_by_id")
def test_get_nonexisting_item_by_id(mock_get_item_by_id):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_item_by_id.return_value = None

    with pytest.raises(NotFoundError) as exc_info:
        service.get_item_by_id(999)

    assert str(exc_info.value) == "Item not found"

@patch("services.menu.menu_crud.get_all_items")
def test_get_all_items(mock_get_all_items):
    mock_db = Mock()
    service = MenuService(mock_db)

    item_1 = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=True, category_id=1)
    item_2 = SimpleNamespace(id=2, name="Item 2", description="", price_cents=200, stock=5, is_available=True, category_id=1)

    mock_get_all_items.return_value = [item_1, item_2]

    result = service.get_all_items()

    assert len(result) == 2
    assert result[0].name == "Item 1"
    assert result[1].name == "Item 2"
    assert isinstance(result[0], MenuItemOut)
    assert isinstance(result[1], MenuItemOut)

@patch("services.menu.menu_crud.get_all_items")
def test_get_all_items_empty(mock_get_all_items):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_all_items.return_value = []

    result = service.get_all_items()

    assert result == []

@patch("services.menu.menu_crud.get_items_by_category")
def test_get_items_by_categories(mock_get_items_by_category):
    mock_db = Mock()
    service = MenuService(mock_db)

    item1 = MenuItemOut(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=True, category_id=1)
    item2 = MenuItemOut(id=2, name="Item 2", description="", price_cents=200, stock=5, is_available=True, category_id=1)
    mock_get_items_by_category.return_value = [item1, item2]

    result = service.get_items_by_category(1)
    assert len(result) == 2
    assert result[0].name == "Item 1"
    assert result[1].name == "Item 2"
    assert isinstance(result[0], MenuItemOut)
    assert isinstance(result[1], MenuItemOut)

@patch("services.menu.menu_crud.get_items_by_category")
def test_get_items_by_nonexisting_category(mock_get_items_by_category):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_items_by_category.return_value = None

    with pytest.raises(NotFoundError) as exc_info:
        service.get_items_by_category(999)

    assert str(exc_info.value) == "Category not found"

@patch("services.menu.menu_crud.get_item_by_id")
@patch("services.menu.menu_crud.get_category_by_id")
@patch("services.menu.menu_crud.update_item")
def test_update_item(mock_update_item, mock_get_category_by_id, mock_get_item_by_id):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_item_by_id.return_value = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=True, category_id=1)
    mock_update_item.return_value = SimpleNamespace(id=1, name="Updated Item", description="", price_cents=150, stock=5, is_available=True, category_id=1)

    result = service.update_item(1, name="Updated Item", price_cents=150)


    assert result.name == "Updated Item"
    assert result.price_cents == 150
    assert isinstance(result, MenuItemOut)

@patch("services.menu.menu_crud.get_item_by_id")
@patch("services.menu.menu_crud.get_category_by_id")
@patch("services.menu.menu_crud.update_item")
def test_update_nonexisting_item(mock_update_item, mock_get_category_by_id, mock_get_item_by_id):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_item_by_id.return_value = None
    mock_update_item.return_value = SimpleNamespace(id=1, name="Updated Item", description="", price_cents=150, stock=5, is_available=True, category_id=1)

    with pytest.raises(NotFoundError) as exc_info:
        service.update_item(999, name="Updated Item", price_cents=150)

    assert str(exc_info.value) == "Item not found"

@patch("services.menu.menu_crud.get_item_by_id")
@patch("services.menu.menu_crud.get_category_by_id")
@patch("services.menu.menu_crud.update_item")
def test_update_item_invalid_category(mock_update_item, mock_get_category_by_id, mock_get_item_by_id):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_item_by_id.return_value = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=True, category_id=1)
    mock_get_category_by_id.return_value = None
    mock_update_item.return_value = SimpleNamespace(id=1, name="Updated Item", description="", price_cents=150, stock=5, is_available=True, category_id=1)

    with pytest.raises(ValidationError) as exc_info:
        service.update_item(1, name="Updated Item", price_cents=150, category_id=999)
    
    assert str(exc_info.value) == "Category not found"


@patch("services.menu.menu_crud.get_item_by_id")
@patch("services.menu.menu_crud.get_category_by_id")
@patch("services.menu.menu_crud.update_item")
def test_update_item_not_found_item(mock_update_item, mock_get_category_by_id, mock_get_item_by_id):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_get_item_by_id.return_value = None
    mock_get_category_by_id.return_value = SimpleNamespace(id=1, name="Test Category")
    mock_update_item.return_value = None

    with pytest.raises(NotFoundError) as exc_info:
        service.update_item(999, name="Updated Item", price_cents=150, category_id=1)

    assert str(exc_info.value) == "Item not found"

@patch("services.menu.menu_crud.delete_item")
def test_delete_item(mock_delete_item):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_item = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=True, category_id=1)
    mock_delete_item.return_value = mock_item

    result = service.delete_item(1)

    assert result.name == "Item 1"
    assert isinstance(result, MenuItemOut)

@patch("services.menu.menu_crud.delete_item")
def test_delete_nonexisting_item(mock_delete_item):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_delete_item.return_value = None

    with pytest.raises(NotFoundError) as exc_info:
        service.delete_item(999)

    assert str(exc_info.value) == "Item not found"

@patch("services.menu.menu_crud.set_item_availability")
def test_set_item_availability_true(mock_set_item_availability):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_item = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=True, category_id=1)
    mock_set_item_availability.return_value = mock_item

    result = service.set_item_availability(1, True)

    assert result.is_available == True
    assert isinstance(result, MenuItemOut)

@patch("services.menu.menu_crud.set_item_availability")
def test_set_item_availability_false(mock_set_item_availability):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_item = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=False, category_id=1)
    mock_set_item_availability.return_value = mock_item

    result = service.set_item_availability(1, False)

    assert result.is_available == False
    assert isinstance(result, MenuItemOut)

@patch("services.menu.menu_crud.set_item_availability")
def test_set_item_availability_nonexisting_item(mock_set_item_availability):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_set_item_availability.return_value = None

    with pytest.raises(NotFoundError) as exc_info:
        service.set_item_availability(999, True)

    assert str(exc_info.value) == "Item not found"

@patch("services.menu.menu_crud.update_item_stock")
def test_update_item_stock(mock_update_item_stock):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_item = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=20, is_available=True, category_id=1)
    mock_update_item_stock.return_value = mock_item

    result = service.update_item_stock(1, 20)

    assert result.stock == 20
    assert isinstance(result, MenuItemOut)

@patch("services.menu.menu_crud.update_item_stock")
def test_update_item_stock_nonexisting_item(mock_update_item_stock):
    mock_db = Mock()
    service = MenuService(mock_db)

    mock_update_item_stock.return_value = None

    with pytest.raises(NotFoundError) as exc_info:
        service.update_item_stock(999, 20)

    assert str(exc_info.value) == "Item not found"

@patch("services.menu.menu_crud.get_available_items")
def test_get_available_items(mock_get_available_items):
    mock_db = Mock()
    service = MenuService(mock_db)

    item1 = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=True, category_id=1)
    item2 = SimpleNamespace(id=2, name="Item 2", description="", price_cents=200, stock=5, is_available=True, category_id=1)

    mock_get_available_items.return_value = [item1, item2]

    result = service.get_available_items()

    assert len(result) == 2
    assert result[0].name == "Item 1"
    assert result[1].name == "Item 2"
    assert isinstance(result[0], MenuItemOut)
    assert isinstance(result[1], MenuItemOut)

@patch("services.menu.menu_crud.get_unavailable_items")
def test_get_unavailable_items(mock_get_unavailable_items):
    mock_db = Mock()
    service = MenuService(mock_db)

    item1 = SimpleNamespace(id=1, name="Item 1", description="", price_cents=100, stock=10, is_available=False, category_id=1)
    item2 = SimpleNamespace(id=2, name="Item 2", description="", price_cents=200, stock=5, is_available=False, category_id=1)

    mock_get_unavailable_items.return_value = [item1, item2]

    result = service.get_unavailable_items()

    assert len(result) == 2
    assert result[0].name == "Item 1"
    assert result[1].name == "Item 2"
    assert isinstance(result[0], MenuItemOut)
    assert isinstance(result[1], MenuItemOut)