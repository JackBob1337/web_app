from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import back.db as db
from back.db.session import get_db
from back.core.dependencies import get_current_user
from back.services.user import UserService
import logging
from back.models.user import User_Out, UserUpdate, ChangePasswordRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=User_Out)
def get_current_user_info(current_user = Depends(get_current_user)):
    return {
        "id": current_user.id, 
        "username": current_user.username, 
        "email": current_user.email,
        "phone_number": current_user.phone_number, 
        "role": current_user.role}

@router.patch("/me", response_model=UserUpdate)
def update_user_profile(user_in: UserUpdate,
                        db: Session = Depends(get_db),
                        current_user = Depends(get_current_user)):
    user_id = current_user.id
    
    if not user_id:
        logger.warning("Unauthorized attempt to update profile by user ID: %s for user ID: %s", 
                       current_user.id, user_id)
        raise HTTPException(status_code=403, detail="You can only update your own profile")
    
    service = UserService(db)

    try:
        updated_user = service.update_user_profile(user_id, user_in)
        logger.info("User ID %s updated their profile", user_id)
        return updated_user
    
    except HTTPException as e:
        if e.status_code == 404:
            logger.warning("Attempt to update profile for non-existent user ID: %s by user ID: %s", 
                           user_id, current_user.id)
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    
@router.patch("/me/change_password")
def change_password(password_in: ChangePasswordRequest,
                    db:Session = Depends(get_db),
                    current_user = Depends(get_current_user)):
    service = UserService(db)
    try:
        service.update_user_password(current_user, password_in.current_password, password_in.new_password)
        logger.info("User ID %s changed their password", current_user.id)
        return {"message": "Password updated successfully"}
    
    except HTTPException as e:
        if e.status_code == 400:
            logger.warning("User ID %s provided incorrect current password", current_user.id)
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    
