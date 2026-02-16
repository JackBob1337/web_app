from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models.user import User_Create, User_Out, User_Login
from core.security import verify_password
from crud.user import get_user_by_email, get_user_by_username, create_user
from core.security import create_access_token
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=User_Out)
def register(user_in: User_Create, db: Session = Depends(get_db)) -> User_Out:
    if get_user_by_email(db, user_in.email):
        logger.warning("Email already registered: %s", user_in.email)
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if get_user_by_username(db, user_in.username):
        logger.warning("Username already exists: %s", user_in.username)
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user = create_user(db, user_in)
    logger.info("User registered successfully: %s", user_in.email)
    return user

@router.post("/login")
def login(user_log: User_Login, db: Session = Depends(get_db)):
    user = get_user_by_email(db, user_log.email)

    if not user or not verify_password(user_log.password, user.hashed_password):
        logger.warning("Invalid login attempt for email: %s", user_log.email)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    logger.info("User logged in successfully: %s", user_log.email)
    return {"access_token": access_token, "token_type": "bearer", "user_id": str(user.id)}
