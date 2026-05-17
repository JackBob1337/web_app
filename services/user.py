from sqlalchemy.orm import Session
from models.user import User_Create, UserUpdate
from fastapi import HTTPException
from core.security import verify_password, hash_password
from crud.user import create_user, get_user_by_email, get_user_by_phone_number, get_user_by_username, get_user_by_id, set_admin_role, update_user_profile, update_user_password


class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def register_user(self, user_in: User_Create):
        if get_user_by_email(self.db, user_in.email):
            raise HTTPException(status_code=400, detail="Email already exists")
        
        if get_user_by_username(self.db, user_in.username):
            raise HTTPException(status_code=400, detail="Username already exists")

        user = create_user(self.db, user_in)

        return user

    def login_user(self, email: str, password: str):
        user = get_user_by_email(self.db, email)

        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        return user
    
    def set_user_role_admin(self, user_id: int):
        user = get_user_by_id(self.db, user_id)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if user.role == "admin":
            raise HTTPException(status_code=409, detail="User is already an admin")
        
        if user.role == "super_admin":
            raise HTTPException(status_code=409, detail="User is already a super-admin and cannot be set to admin")        
        
        update_user = set_admin_role(self.db, user_id)

        if not update_user:
            raise HTTPException(status_code=500, detail="Failed to update user role")
                
        return update_user
    
    def update_user_profile(self, user_id: int, user_in: UserUpdate):
        user = get_user_by_id(self.db, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user_in.email and user_in.email != user.email:
           existing_email = get_user_by_email(self.db, user_in.email)
           if existing_email:
               raise HTTPException(status_code=400, detail="Email already exists")

        if user_in.username and user_in.username != user.username:
            existing_username = get_user_by_username(self.db, user_in.username)
            if existing_username:
                raise HTTPException(status_code=400, detail="Username already exists")

        if user_in.phone_number and user_in.phone_number != user.phone_number:
            existing_phone = get_user_by_phone_number(self.db, user_in.phone_number)
            if existing_phone:
                raise HTTPException(status_code=400, detail="Phone number already exists")

        return update_user_profile(self.db, user, user_in)
    
    def update_user_password(self, user, old_password: str, new_password: str):
        if not verify_password(old_password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        new_hashed_pwd = hash_password(new_password)

        return update_user_password(self.db, user, new_hashed_pwd)



        
        

    


        