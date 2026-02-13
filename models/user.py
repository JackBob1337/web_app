from pydantic import BaseModel, EmailStr, field_validator, Field

class User_Create(BaseModel):
    username: str
    email: EmailStr
    password: str =  Field(min_length=8, max_length=72)
    phone_number: str | None = None

    @field_validator("password")
    @classmethod
    def strong_password(cls, value: str) -> str:
        if not any(char.isdigit() for char in value):
            raise ValueError("Password must contain at least one digit")
        
        if not any(char.isupper() for char in value):
            raise ValueError("Password must contain at least one uppercase letter")
        
        if not any(char.islower() for char in value):
            raise ValueError("Password must contain at least one lowercase letter")

        return value

class User_Out(BaseModel):
    id: int
    username: str
    email: EmailStr
    phone_number: str | None = None

    class Config:
        from_attributes = True

class User_Login(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


