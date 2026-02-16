from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models.menu import CategoryCreate, CategoryOut
from core.dependencies import get_current_user
from crud.menu import create_category
import logging


logger = logging.getLogger(__name__)
router = APIRouter(prefix="/menu", tags=["menu"])

@router.post("/categories", response_model=CategoryOut)
def create_menu_category(category_in: CategoryCreate, 
                         db: Session = Depends(get_db), 
                         current_user = Depends(get_current_user)):
    
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to create category by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can create categories")

    category = create_category(db, category_in)

    logger.info("Category created by user ID: %s", current_user.id)
    return category
