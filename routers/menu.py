from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from db.session import get_db
from models.menu import CategoryCreate, CategoryOut, MenuItemCreate, MenuItemOut, MenuItemUpdate
from core.dependencies import get_current_user
from services.domain_errors import NotFoundError, ConflictError, ValidationError
from services.menu import MenuService

import logging
from pathlib import Path
import uuid

UPLOAD_DIR = Path("static/uploads/menu_items")
ALLOWED_TYPES  = ["image/png", "image/jpeg", "image/jpg"]
MAX_SIZE = 8 * 1024 * 1024

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/menu", tags=["menu"])

@router.post("/create_category", response_model=CategoryOut)
def create_menu_category(category_in: CategoryCreate, 
                         db: Session = Depends(get_db), 
                         current_user = Depends(get_current_user)):
    
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to create category by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can create categories")

    menu_service = MenuService(db)
    category = menu_service.create_category(category_in.name)

    logger.info("Category created by user ID: %s", current_user.id)
    return category

@router.get("/get_category_by_name/{category_name}", response_model=CategoryOut)
def get_category_by_name(category_name: str,
                         db: Session = Depends(get_db),
                         current_user = Depends(get_current_user)):
    
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to get category by name by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can view categories")
    
    menu_service = MenuService(db)
    category = menu_service.get_category_by_name(category_name)
    if not category:
        logger.warning("Category not found with name: %s by user ID: %s", category_name, current_user.id)
        raise HTTPException(status_code=404, detail="Category not found")
    
    logger.info("Category retrieved by name: %s by user ID: %s", category_name, current_user.id)
    return category

@router.delete("/delete_category/{category_id}", response_model=CategoryOut)
def delete_category(category_id: int,
                    db: Session = Depends(get_db),
                    current_user = Depends(get_current_user)):
    
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to delete category by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can delete categories")
    
    menu_service = MenuService(db)
    category = menu_service.delete_category(category_id)
    if not category:
        logger.warning("Category not found with ID: %s by user ID: %s", category_id, current_user.id)
        raise HTTPException(status_code=404, detail="Category not found")
    
    logger.info("Category deleted with ID: %s by user ID: %s", category_id, current_user.id)
    return category

@router.get("/get_all_categories", response_model=list[CategoryOut])
def get_all_categories(db: Session = Depends(get_db)):
    
    menu_service = MenuService(db)
    categories = menu_service.get_all_categories()
    if not categories:
        logger.warning("No categories found")
        raise HTTPException(status_code=404, detail="No categories found")
    
    logger.info("All categories retrieved")
    return categories

@router.post("/create_item", response_model=MenuItemOut)
def create_menu_item(name: str = Form(...),
                    description: str = Form(None),
                    price_cents: int = Form(...),
                    stock: int = Form(0),
                    is_available: bool = Form(True),
                    category_id: int = Form(...),
                    image: UploadFile = File(...), 
                    db: Session = Depends(get_db),
                    current_user = Depends(get_current_user)):
    
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to create menu item by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can create menu items")
    
    if image.content_type not in ALLOWED_TYPES:
        logger.warning("Invalid file type: %s uploaded by user ID: %s", image.content_type, current_user.id)
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    contents = image.file.read()
    if len(contents) > MAX_SIZE:
        logger.warning("File size exceeds limit: %s bytes uploaded by user ID: %s", len(contents), current_user.id)
        raise HTTPException(status_code=400, detail="File size exceeds limit")
    
    if not image.filename:
        logger.warning("No filename provided for uploaded file by user ID: %s", current_user.id)
        raise HTTPException(status_code=400, detail="No filename provided")
    
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    ext = Path(image.filename).suffix.lower()
    filename = f"{uuid.uuid4()}{ext}"
    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as f:
        f.write(contents)

    image_url = f"/static/uploads/menu_items/{filename}"
    
    item_in = MenuItemCreate(
        name=name,
        description=description,
        price_cents=price_cents,
        stock=stock,
        is_available=is_available,
        category_id=category_id,
        image_url=image_url,
    )

    menu_service = MenuService(db)
    try:

        item = menu_service.create_item(**item_in.model_dump())
        logger.info("Menu item created with name: %s by user ID: %s", item_in.name, current_user.id)
        return item
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    except ConflictError as e:
        raise HTTPException(status_code=409, detail=str(e))
    
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/upload_item_img/{item_id}", response_model=MenuItemOut)
def upload_item_image(item_id: int,
                      file: UploadFile = File(...),
                      db: Session = Depends(get_db),
                      current_user = Depends(get_current_user)):
    
    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to upload item image by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can upload item images")
    
    if file.content_type not in ALLOWED_TYPES:
        logger.warning("Invalid file type: %s uploaded by user ID: %s", file.content_type, current_user.id)
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    contents = file.file.read()
    if len(contents) > MAX_SIZE:
        logger.warning("File size exceeds limit: %s bytes uploaded by user ID: %s", len(contents), current_user.id)
        raise HTTPException(status_code=400, detail="File size exceeds limit")
    
    if not file.filename:
        logger.warning("No filename provided for uploaded file by user ID: %s", current_user.id)
        raise HTTPException(status_code=400, detail="No filename provided")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    ext = Path(file.filename).suffix.lower()
    filename = f"{uuid.uuid4()}{ext}"
    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as f:
        f.write(contents)

    image_url = f"/static/uploads/menu_items/{filename}"

    
    menu_service = MenuService(db)
    item = menu_service.update_item(item_id, image_url=image_url)

    if not item:
        logger.warning("Menu item not found with ID: %s for image upload by user ID: %s", item_id, current_user.id)
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    logger.info("Image uploaded for menu item ID: %s by user ID: %s", item_id, current_user.id)
    return item

@router.get("/get_items_by_category/{category_id}", response_model=list[MenuItemOut])
def get_items_by_category(category_id: int,
                          db: Session = Depends(get_db)):  
      
    menu_service = MenuService(db)
    return menu_service.get_items_by_category(category_id)

@router.patch("/update_item/{item_id}", response_model=MenuItemOut)
def update_menu_item(item_id: int,
                    item_in: MenuItemUpdate,
                    db: Session = Depends(get_db),
                    current_user = Depends(get_current_user)):

    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to update menu item by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can update menu items")
    
    menu_service = MenuService(db)
    try:
        item = menu_service.update_item(item_id, **item_in.model_dump())
        logger.info("Menu item updated with ID: %s by user ID: %s", item_id, current_user.id)
        return item
    
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    except ConflictError as e:
        raise HTTPException(status_code=409, detail=str(e))
    
@router.delete("/delete_item/{item_id}", response_model=MenuItemOut)
def delete_item(item_id: int,
                db: Session = Depends(get_db),
                current_user = Depends(get_current_user)):

    if current_user.role not in ["admin", "super_admin"]:
        logger.warning("Unauthorized attempt to delete menu item by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only admins can delete menu items")

    menu_service = MenuService(db)

    try:
        item = menu_service.delete_item(item_id)
        logger.info("Menu item deleted with ID: %s by user ID: %s", item_id, current_user.id)
        return item
    
    except NotFoundError as e:
        logger.warning("Menu item not found with ID: %s for deletion by user ID: %s", item_id, current_user.id)
        raise HTTPException(status_code=404, detail=str(e))

    


    
    
