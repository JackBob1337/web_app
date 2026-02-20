from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from core.dependencies import get_current_user
from services.user import UserService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/users", tags=["users"])

@router.post("/{user_id}/make-admin")
def make_admin(user_id: int, 
               db: Session = Depends(get_db), 
               current_user = Depends(get_current_user)) -> dict:
    if current_user.role != "super_admin":
        logger.warning("Unauthorized attempt to set admin role by user ID: %s", current_user.id)
        raise HTTPException(status_code=403, detail="Only super-admins can set admin role")

    service = UserService(db)
    
    try:
        user = service.set_user_role_admin(user_id)
        logger.info("User ID %s set to admin by super-admin ID: %s", user_id, current_user.id)
        return {"message": f"User {user.username} is now an admin"}
    
    except HTTPException as e:
        if e.status_code == 404:
            logger.warning("Attempt to set admin role for non-existent user ID: %s by super-admin ID: %s", 
                           user_id, current_user.id)
        raise 
