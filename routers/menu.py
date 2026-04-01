from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models.menu import CategoryCreate, CategoryOut, MenuItemCreate, MenuItemOut
from core.dependencies import get_current_user
import crud.menu as menu_crud
import logging


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/menu", tags=["menu"])

@router.post("/create_category", response_model=CategoryOut)
def create_menu_category(category_in: CategoryCreate, 
                         db: Session = Depends(get_db), 
                         current_user = Depends(get_current_user)):
    
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to create category by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can create categories")

    category = menu_crud.create_category(db, category_in)

    logger.info("Category created by user ID: %s", current_user.id)
    return category

@router.get("/get_category_by_name/{category_name}", response_model=CategoryOut)
def get_category_by_name(category_name: str,
                         db: Session = Depends(get_db),
                         current_user = Depends(get_current_user)):
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to get category by name by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can view categories")
    
    category = menu_crud.get_category_by_name(db, category_name)
    if not category:
        logger.warning("Category not found with name: %s by user ID: %s", category_name, current_user.id)
        raise HTTPException(status_code=404, detail="Category not found")
    
    logger.info("Category retrieved by name: %s by user ID: %s", category_name, current_user.id)
    return category

@router.get("/get_all_categories", response_model=list[CategoryOut])
def get_all_Categories(db: Session = Depends(get_db),
                       current_user = Depends(get_current_user)):
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to get all categories by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can view categories")
    
    categories = menu_crud.get_all_categories(db)
    if not categories:
        logger.warning("No categories found by user ID: %s", current_user.id)
        raise HTTPException(status_code=404, detail="No categories found")
    
    logger.info("All categories retrieved by user ID: %s", current_user.id)
    return categories

@router.delete("/delete_category/{category_id}", response_model=CategoryOut)
def delete_category(category_id: int,
                    db: Session = Depends(get_db),
                    current_user = Depends(get_current_user)):
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to delete category by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can delete categories")
    
    category = menu_crud.delete_category(db, category_id)
    if not category:
        logger.warning("Category not found with ID: %s by user ID: %s", category_id, current_user.id)
        raise HTTPException(status_code=404, detail="Category not found")
    
    logger.info("Category deleted with ID: %s by user ID: %s", category_id, current_user.id)
    return category

@router.get("/get_all_categories", response_model=list[CategoryOut])
def get_all_categories(db: Session = Depends(get_db),
                       current_user = Depends(get_current_user)):
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to get all categories by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can view categories")
    
    categories = menu_crud.get_all_categories(db)
    if not categories:
        logger.warning("No categories found by user ID: %s", current_user.id)
        raise HTTPException(status_code=404, detail="No categories found")
    
    logger.info("All categories retrieved by user ID: %s", current_user.id)
    return categories

@router.post("/create_item", response_model=MenuItemOut)
def create_menu_item(item_in: MenuItemCreate,
                     db: Session = Depends(get_db),
                     current_user = Depends(get_current_user)):
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to create menu item by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can create menu items")
    
    item = menu_crud.create_item(db, item_in)
    
    logger.info("Menu item created with name: %s by user ID: %s", item_in.name, current_user.id)
    return item
