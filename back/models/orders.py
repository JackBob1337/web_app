from pydantic import BaseModel, ConfigDict

class AddToCartRequest(BaseModel):
    menu_item_id: int
    quantity: int = 1

    model_config = ConfigDict(from_attributes=True)

class UpdateCartItemRequest(BaseModel):
    menu_item_id: int
    quantity: int
    
    model_config = ConfigDict(from_attributes=True)

class CartItemResponse(BaseModel):
    id: int
    menu_item_id: int
    name: str
    quantity: int
    unit_price_cents: int
    line_total_cents: int
    image_url: str | None = None

    model_config = ConfigDict(from_attributes=True)

class CartResponse(BaseModel):
    status: str
    items: list[CartItemResponse]
    total_price_cents: int

    model_config = ConfigDict(from_attributes=True)

class PlaceOrderResponse(BaseModel):
    message: str
    order_id: int

    model_config = ConfigDict(from_attributes=True)

class OrderHistoryItem(BaseModel):
    order_id: int
    product_name: str
    quantity: int
    price_cents: int

    model_config = ConfigDict(from_attributes=True)

class OrderHistoryResponse(BaseModel):
    order_id: int
    items: list[OrderHistoryItem]
    total_price_cents: int
    created_at: str
    status: str

    model_config = ConfigDict(from_attributes=True)
