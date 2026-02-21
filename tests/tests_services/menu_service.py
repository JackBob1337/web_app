import pytest
from unittest.mock import Mock, patch

from services.domain_errors import NotFoundError, ConflictError, ValidationError
from services.menu import MenuService
from models.menu import CategoryCreate, CategoryUpdate, MenuItemCreate, MenuItemUpdate


def test_create_category():
    mock_db = Mock()
    service = MenuService(mock_db)

    