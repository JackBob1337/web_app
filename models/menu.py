from pydantic import BaseModel, Field, ConfigDict

class MenuItemOut(BaseModel):
    id: int
    name: str
    description: str | None
    price_cents: int
    stock: int
    is_available: bool
    category_id: int

    model_config = ConfigDict(from_attributes=True)


class MenuItemCreate(BaseModel):
    name: str
    description: str | None = None
    price_cents: int = Field(..., gt=0)
    stock: int = Field(0, ge=0)
    is_available: bool = True
    category_id: int

class MenuItemUpdate(BaseModel):
    name: str | None = None
    description: str| None = None
    price_cents: int | None = Field(None, gt=0)
    stock: int |None = Field(None, ge=0)
    is_available: bool | None = None
    category_id: int | None = None

class CategoryOut(BaseModel):
    id: int
    name: str
    items: list[MenuItemOut] = []

    model_config = ConfigDict(from_attributes=True)

class CategoryCreate(BaseModel):
    name: str

class CategoryUpdate(BaseModel):
    name: str | None = None