import crud.menu as menu_crud
from fastapi import HTTPException
from models.menu import CategoryCreate

from sqlalchemy.orm import Session

class MenuService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_category(self, name: str):
        category_in = CategoryCreate(name=name)
        category = menu_crud.create_category(self.db, category_in)

        if not category:
            raise HTTPException(status_code=400, detail="Category already exists")
        
        return category
    
    
                           
    

        