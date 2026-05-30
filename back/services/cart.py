from sqlalchemy.orm import Session
from back.models.orders import AddToCartRequest, CartItemResponse, UpdateCartItemRequest, CartResponse, PlaceOrderResponse, OrderHistoryResponse
import back.crud.cart as cart_crud
from back.services.domain_errors import NotFoundError, ValidationError, ConflictError

class CartService: 
    def __init__(self, db: Session):
        self.db = db

    def _build_cart_response(self, cart) -> CartResponse:
        return CartResponse(
            status=cart.status,
            items=[
                CartItemResponse(
                    id=item.id,
                    menu_item_id=item.menu_item_id,
                    name=item.menu_item.name,
                    quantity=item.quantity,
                    unit_price_cents=item.price_cents_snapshot,
                    line_total_cents=item.quantity * item.price_cents_snapshot
                ) for item in cart.items
            ],
            total_price_cents=cart.total_price_cents
        )

    def create_cart(self, user_id: int) -> CartResponse:
        cart = cart_crud.create_cart(self.db, user_id)
        return self._build_cart_response(cart)
    
    def add_item_to_cart(self, user_id: int, item_in: AddToCartRequest) -> CartResponse:
        cart_response = cart_crud.add_item_to_cart(self.db, user_id, item_in)

        if not cart_response:
            raise ValidationError("Invalid menu item or quantity")
        
        return cart_response
    
    def list_cart_items(self, user_id: int) -> CartResponse:
        cart = cart_crud.get_cart_by_user(self.db, user_id)
        return cart
    
    def get_cart(self, user_id: int) -> CartResponse:
        return cart_crud.get_cart_by_user(self.db, user_id)

    def update_cart_item_quantity(self, user_id: int, item_in: UpdateCartItemRequest) -> CartResponse:
        cart_response = cart_crud.update_cart_item_quantity(self.db, user_id, item_in)

        if not cart_response:
            raise ValidationError("Invalid menu item or quantity")
        
        return cart_response
    
    def remove_cart_item(self, user_id: int, menu_item_id: int) -> CartResponse:
        cart_response = cart_crud.remove_item_from_cart(self.db, user_id, menu_item_id)
        
        if not cart_response:
            raise NotFoundError("Failed to remove item from cart")
        
        return cart_response
    
    def place_order(self, user_id: int) -> PlaceOrderResponse:
        order_response = cart_crud.place_order(self.db, user_id)

        if not order_response:
            raise ConflictError("Failed to place order. Please check your cart and try again")
        
        return order_response
    
    def clear_cart(self, user_id: int) -> CartResponse:
        cart_response = cart_crud.clear_cart(self.db, user_id)

        if not cart_response:
            raise NotFoundError("Cart not found")
        
        return cart_response
    
    def get_order_history(self, user_id: int) -> list[OrderHistoryResponse]:
        return cart_crud.get_orders_by_user(self.db, user_id)
    