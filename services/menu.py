import crud.menu as menu_crud
from models.menu import CategoryCreate, CategoryUpdate, MenuItemCreate, MenuItemUpdate, CategoryOut, MenuItemOut

from sqlalchemy.orm import Session

from domain_errors import NotFoundError, ConflictError, ValidationError
class MenuService:
    def __init__(self, db: Session):
        self.db = db

    def create_category(self, name: str) -> CategoryOut:
        category_in = CategoryCreate(name=name)
        category = menu_crud.create_category(self.db, category_in)

        if not category:
            raise ConflictError("Category already exists")
        
        return CategoryOut.from_orm(category)
    
    def get_category_by_id(self, category_id: int) -> CategoryOut:
        category = menu_crud.get_category_by_id(self.db, category_id)

        if not category:
            raise NotFoundError("Category not found")

        return CategoryOut.from_orm(category)
    
    def get_category_by_name(self, name: str) -> CategoryOut:
        category = menu_crud.get_category_by_name(self.db, name)

        if not category:
            raise NotFoundError("Category not found")
        
        return CategoryOut.from_orm(category)
    
    def get_all_categories(self) -> list[CategoryOut]:
        categories = menu_crud.get_all_categories(self.db)
        return [CategoryOut.from_orm(category) for category in categories]
    
    def delete_category(self, category_id: int) -> CategoryOut:
        category = menu_crud.delete_category(self.db, category_id)

        if not category:
            raise NotFoundError("Category not found")
        
        return CategoryOut.from_orm(category)

    def update_category(self, category_id: int, name: str) -> CategoryOut:
        category_in = CategoryUpdate(name=name)
        category = menu_crud.update_category(self.db, category_id, category_in)

        if not category:
            raise NotFoundError("Category not found")
        
        return CategoryOut.from_orm(category)

    def get_category_with_items(self, category_id: int) -> CategoryOut:
        category = menu_crud.get_category_with_items(self.db, category_id)

        if not category:
            raise NotFoundError("Category not found")
        
        return CategoryOut.from_orm(category)
    
    def create_item(self, 
                    name: str, 
                    description: str, 
                    price_cents: int, 
                    stock: int, 
                    is_available: bool, 
                    category_id: int) -> MenuItemOut:

        category = menu_crud.get_category_by_id(self.db, category_id)
        if not category:
            raise ValidationError("Category not found")
        
        existing_item = menu_crud.get_item_by_name(self.db, name)
        if existing_item:
            raise ConflictError("Item with the same name already exists in the category")
    
        item_in = MenuItemCreate(
            name=name,
            description=description,
            price_cents=price_cents,
            stock=stock,
            is_available=is_available,
            category_id=category_id
        )

        item = menu_crud.create_item(self.db, item_in)

        return MenuItemOut.from_orm(item)
    
    def get_item_by_id(self, item_id: int) -> MenuItemOut:
        item = menu_crud.get_item_by_id(self.db, item_id)

        if not item:
            raise NotFoundError("Item not found")
        
        return MenuItemOut.from_orm(item)
    
    def get_all_items(self) -> list[MenuItemOut]:
        items = menu_crud.get_all_items(self.db)
        return [MenuItemOut.from_orm(item) for item in items]
    
    def get_items_by_category(self, category_id: int) -> list[MenuItemOut]:
        items = menu_crud.get_items_by_category(self.db, category_id)

        if items is None:
            raise NotFoundError("Category not found")
        
        return [MenuItemOut.from_orm(item) for item in items]
    
    def update_item(self, 
                    item_id: int, 
                    name: str | None = None, 
                    description: str | None = None, 
                    price_cents: int | None = None, 
                    stock: int | None = None, 
                    is_available: bool | None = None, 
                    category_id: int | None = None) -> MenuItemOut:
    
        existing_item = menu_crud.get_item_by_id(self.db, item_id)
        if not existing_item:
            raise NotFoundError("Item not found")
        
        if category_id is not None:
            category = menu_crud.get_category_by_id(self.db, category_id)
            if not category:
                raise ValidationError("Category not found")
            
        item_in = MenuItemUpdate(
            name=name,
            description=description,
            price_cents=price_cents,
            stock=stock,
            is_available=is_available,
            category_id=category_id
        )

        item = menu_crud.update_item(self.db, item_id, item_in)
        if not item:
            raise NotFoundError("Item not found")
        return MenuItemOut.from_orm(item)
    
    def delete_item(self, item_id: int) -> MenuItemOut:
        item = menu_crud.delete_item(self.db, item_id)

        if not item:
            raise NotFoundError("Item not found")
        
        return MenuItemOut.from_orm(item)
    
    def set_item_availability(self, item_id: int, is_available: bool) -> MenuItemOut:
        item = menu_crud.set_item_availability(self.db, item_id, is_available)

        if not item:
            raise NotFoundError("Item not found")
        
        return MenuItemOut.from_orm(item)
    
    def update_item_stock(self, item_id: int, stock: int) -> MenuItemOut:
        item = menu_crud.update_item_stock(self.db, item_id, stock)

        if not item:
            raise NotFoundError("Item not found")
        
        return MenuItemOut.from_orm(item)
    
    def get_available_items(self) -> list[MenuItemOut]:
        items = menu_crud.get_available_items(self.db)
        return [MenuItemOut.from_orm(item) for item in items]
    
    def get_unavailable_items(self) -> list[MenuItemOut]:
        items = menu_crud.get_unavailable_items(self.db)
        return [MenuItemOut.from_orm(item) for item in items]

   