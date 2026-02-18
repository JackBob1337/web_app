from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models.user import User_Create, User_Out, User_Login
from core.security import verify_password
from crud.user import get_user_by_email, get_user_by_username, create_user
from core.security import create_access_token
from services.user import UserService
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=User_Out)
def register(user_in: User_Create, db: Session = Depends(get_db)) -> User_Out:
    service = UserService(db)
    try:
        user = service.register_user(user_in)
        return user
    
    except HTTPException as e:
        logger.warning("Registration failed for email: %s - %s", user_in.email, e.detail)
        raise

    except Exception as e:
        logger.exception("Unexpected error during registration for email: %s", user_in.email)
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/login")
def login(user_log: User_Login, db: Session = Depends(get_db)):
    service = UserService(db)
    try:
        user = service.login_user(user_log.email, user_log.password)
        access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
        logger.info("User logged in successfully: %s", user_log.email)
        return {"access_token": access_token, "token_type": "bearer", "user_id": str(user.id)}
    
    except HTTPException as e:
        logger.warning("Login failed for email: %s - %s", user_log.email, e.detail)
        raise

    except Exception as e:
        logger.exception("Unexpected error during login for email: %s", user_log.email)
        raise HTTPException(status_code=500, detail="Internal server error")
    
