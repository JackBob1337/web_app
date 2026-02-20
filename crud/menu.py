from sqlalchemy.orm import Session, selectinload
from db.menu import Category as CategoryModel
from db.menu import MenuItem as MenuItemModel
from models.menu import CategoryCreate, CategoryUpdate, MenuItemCreate, MenuItemUpdate

def get_category_by_id(db: Session, category_id: int) -> CategoryModel | None:
    return db.query(CategoryModel).filter(CategoryModel.id == category_id).first()

def get_category_by_name(db: Session, name: str) -> CategoryModel | None:
    if not name:
        return None
    
    return db.query(CategoryModel).filter(CategoryModel.name == name).first()

def get_all_categories(db: Session) -> list[CategoryModel]:
    return db.query(CategoryModel).all()

def create_category(db: Session, category_in: CategoryCreate) -> CategoryModel | None:
    existing_category = db.query(CategoryModel).filter(CategoryModel.name ==category_in.name).first()

    if existing_category:
        return None
    
    category = CategoryModel(name=category_in.name)
    db.add(category)
    db.commit()
    db.refresh(category)

    return category

def delete_category(db: Session, category_id: int) -> CategoryModel | None:
    category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()

    if not category:
        return None
    
    db.delete(category)
    db.commit()

    return category

def update_category(db: Session, category_id: int, category_in: CategoryUpdate) -> CategoryModel | None:
    category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()

    if not category:
        return None
    
    if category_in.name is not None:
        category.name = category_in.name

    db.commit()
    db.refresh(category)

    return category

def get_category_with_items(db: Session, category_id: int) -> CategoryModel | None:
    return db.query(CategoryModel).options(selectinload(CategoryModel.items)).filter(CategoryModel.id == category_id).first()

def create_item(db: Session, item_in: MenuItemCreate) -> MenuItemModel | None:
    category = db.query(CategoryModel).filter(CategoryModel.id == item_in.category_id).first()

    if not category:
        return None
    
    existing_item = db.query(MenuItemModel).filter(
        MenuItemModel.category_id == item_in.category_id, 
        MenuItemModel.name == item_in.name).first()
    
    if existing_item:
        return None

    item = MenuItemModel(
        name = item_in.name,
        description = item_in.description,
        price_cents = item_in.price_cents,
        stock = item_in.stock,
        is_available = item_in.is_available,
        category_id = item_in.category_id
    )

    db.add(item)
    db.commit()
    db.refresh(item)

    return item

def get_item_by_id(db: Session, item_id: int) -> MenuItemModel | None:
    return db.query(MenuItemModel).filter(MenuItemModel.id == item_id).first()

def get_all_items(db: Session) -> list[MenuItemModel]:
    return db.query(MenuItemModel).all()

def get_items_by_category(db: Session, category_id: int) -> list[MenuItemModel] | None:
    category = db.query(CategoryModel).filter(CategoryModel.id == category_id).first()

    if not category:
        return None

    return db.query(MenuItemModel).filter(MenuItemModel.category_id == category.id).all()

def update_item(db: Session, item_id: int, item_in: MenuItemUpdate) -> MenuItemModel | None:
    item = db.query(MenuItemModel).filter(MenuItemModel.id == item_id).first()

    if not item:
        return None
    
    update_data = item_in.model_dump(exclude_none=True)

    if "category_id" in update_data:
        category = db.query(CategoryModel).filter(CategoryModel.id == update_data["category_id"]).first()

        if not category:
            return None
    
    for field, value in update_data.items():
        setattr(item, field, value)        

    db.commit()
    db.refresh(item)

    return item

def delete_item(db: Session, item_id: int) -> MenuItemModel | None:
    item = db.query(MenuItemModel).filter(MenuItemModel.id == item_id).first()

    if not item:
        return None
    
    db.delete(item)
    db.commit()

    return item

def set_item_availability(db: Session, item_id: int, is_available: bool) -> MenuItemModel | None:
    item = db.query(MenuItemModel).filter(MenuItemModel.id == item_id).first()

    if not item:
        return None
    
    item.is_available = is_available
    db.commit()
    db.refresh(item)

    return item

def update_item_stock(db: Session, item_id: int, new_stock: int) -> MenuItemModel | None:
    item = db.query(MenuItemModel).filter(MenuItemModel.id == item_id).first()

    if not item:
        return None

    item.stock = new_stock
    db.commit()
    db.refresh(item)

    return item

def get_available_items(db: Session) -> list[MenuItemModel]:
    return db.query(MenuItemModel).filter(MenuItemModel.is_available == True).all()

def get_unavailable_items(db: Session) -> list[MenuItemModel]:
    return db.query(MenuItemModel).filter(MenuItemModel.is_available == False).all()


    
