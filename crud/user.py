from sqlalchemy.orm import Session
from db.user import User as UserModel
from models.user import User_Create
from core.security import hash_password

def get_user_by_email(db: Session, email: str) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.email == email).first()

def get_user_by_username(db: Session, username: str) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.username == username).first()

def get_user_by_id(db: Session, user_id: int) -> UserModel | None:
    return db.query(UserModel).filter(UserModel.id == user_id).first()

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
