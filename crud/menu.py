from sqlalchemy.orm import Session
from db.menu import Category as CategoryModel
from models.menu import CategoryCreate, CategoryOut

def create_category(db: Session, category_in: CategoryCreate) -> CategoryModel | None:
    existing_category = db.query(CategoryModel).filter(CategoryModel.name ==category_in.name).first()
    if existing_category:
        return None
    
    category = CategoryModel(name=category_in.name)
    db.add(category)
    db.commit()
    db.refresh(category)

    return category