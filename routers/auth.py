from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from models.user import User_Create, User_Out
from crud.user import get_user_by_email, get_user_by_username, create_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=User_Out)
def register(user_in: User_Create, db: Session = Depends(get_db)) -> User_Out:
    if get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if get_user_by_username(db, user_in.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user = create_user(db, user_in)
    return user