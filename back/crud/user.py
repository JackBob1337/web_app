from sqlalchemy.orm import Session
from typing import List
from back.db.user import User as UserModel
from back.models.user import User_Create, UserUpdate

from back.core.security import hash_password

def get_user_by_email(db: Session, email: str) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.email == email).first()

def get_user_by_username(db: Session, username: str) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.username == username).first()

def get_user_by_id(db: Session, user_id: int) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.id == user_id).first()

def get_user_by_phone_number(db: Session, phone_number: str) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.phone_number == phone_number).first()

def create_user(db: Session, user_in: User_Create) -> UserModel:
    user = UserModel(
        username = user_in.username,
        email = user_in.email,
        hashed_password = hash_password(user_in.password),
        phone_number = user_in.phone_number,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return user

def set_admin_role(db: Session, user_id: int) -> UserModel | None:
    user = db.query(UserModel).filter(UserModel.id == user_id).first()

    if not user:
        return None
        
    user.role = "admin"
    db.commit()
    db.refresh(user)
    return user

def update_user_profile(db: Session, user: UserModel, user_in: UserUpdate) -> UserModel | None:
    update_data = user_in.model_dump(exclude_unset=True, exclude_none=True)

    for key in update_data:
        setattr(user, key, update_data[key])
    
    db.commit()
    db.refresh(user)
    return user

def update_user_password(db: Session, user: UserModel, new_hashed_password: str) -> UserModel | None:
    user.hashed_password = new_hashed_password
    db.commit()
    db.refresh(user)
    return user
