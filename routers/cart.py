from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.session import get_db
from db.user import User as UserModel
from core.dependencies import get_current_user
from services.domain_errors import NotFoundError, ValidationError, ConflictError
from services.cart import CartService
import logging
from models.orders import AddToCartRequest, UpdateCartItemRequest, CartResponse, PlaceOrderResponse, OrderHistoryResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/cart", tags=["cart"])

@router.post("/add-item", response_model=CartResponse)
def add_item_to_cart(item_in: AddToCartRequest,
                     db: Session = Depends(get_db),
                     current_user: UserModel = Depends(get_current_user)) -> CartResponse:
    service = CartService(db)

    try:
        cart_response = service.add_item_to_cart(current_user.id, item_in)
        logger.info("Added item ID %s to cart for user ID: %s", item_in.menu_item_id, current_user.id)
        return cart_response
    
    except ValidationError as e:
        logger.warning("Failed to add item ID %s to cart for user ID: %s - %s", item_in.menu_item_id, current_user.id, str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/cart-items", response_model=CartResponse)
def get_cart_items(db: Session = Depends(get_db),
                   current_user: UserModel = Depends(get_current_user)) -> CartResponse:
    service = CartService(db)

    try:
        items_response = service.get_cart(current_user.id)
        logger.info("Retrieved cart items for user ID: %s", current_user.id)
        return items_response
    
    except NotFoundError as e:
        logger.warning("Cart not found for user ID: %s - %s", current_user.id, str(e))
        raise HTTPException(status_code=404, detail=str(e))
    
@router.patch("/update-item", response_model=CartResponse)
def updater_cart_item(item_in: UpdateCartItemRequest,
                      db: Session = Depends(get_db),
                      current_user: UserModel = Depends(get_current_user)) -> CartResponse:
    service = CartService(db)

    try:
        item_response = service.update_cart_item_quantity(current_user.id, item_in)
        logger.info("Updated cart item ID %s for user ID: %s", item_in.menu_item_id, current_user.id)
        return item_response
    
    except ValidationError as e:
        logger.warning("Failed to update cart item ID %s for user ID: %s - %s", item_in.menu_item_id, current_user.id, str(e))
        raise HTTPException(status_code=400, detail=str(e))
    except ConflictError as e:
        logger.warning("Conflict error while updating cart item ID %s for user ID: %s - %s", item_in.menu_item_id, current_user.id, str(e))
        raise HTTPException(status_code=409, detail=str(e))
    
@router.delete("/remove-item", response_model=CartResponse)
def delete_cart_item(menu_item_id: int,
                     db: Session = Depends(get_db),
                     current_user: UserModel = Depends(get_current_user)) -> CartResponse:
    service = CartService(db)

    try:
        response = service.remove_cart_item(current_user.id, menu_item_id)
        logger.info("Removed cart item ID %s for user ID: %s", menu_item_id, current_user.id)
        return response
    
    except NotFoundError as e:
        logger.warning("Failed to remove cart item ID %s for user ID: %s - %s", menu_item_id, current_user.id, str(e))
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/place-order", response_model=PlaceOrderResponse)
def place_order(db: Session = Depends(get_db),
                current_user: UserModel = Depends(get_current_user)) -> PlaceOrderResponse:
    service = CartService(db)

    try:
        order_response = service.place_order(current_user.id)
        logger.info("Placed order for user ID: %s, order ID: %s", current_user.id, order_response.order_id)
        return order_response
    
    except ConflictError as e:
        logger.warning("Failed to place order for user ID: %s - %s", current_user.id, str(e))
        raise HTTPException(status_code=409, detail=str(e))
    
    except ValidationError as e:
        logger.warning("Validation error while placing order for user ID: %s - %s", current_user.id, str(e))
        raise HTTPException(status_code=400, detail=str(e))
    

@router.delete("/clear-cart", response_model=CartResponse)
def clear_cart(db: Session = Depends(get_db),
               current_user: UserModel = Depends(get_current_user)) -> CartResponse:
    service = CartService(db)

    try:
        response = service.clear_cart(current_user.id)
        logger.info("Cleared cart for user ID: %s", current_user.id)
        return response
    
    except NotFoundError as e:
        logger.warning("Failed to clear cart for user ID: %s - %s", current_user.id, str(e))
        raise HTTPException(status_code=404, detail=str(e))
    
@router.get("/orders", response_model=list[OrderHistoryResponse])
def get_order_history(db: Session = Depends(get_db),
                      current_user: UserModel = Depends(get_current_user)) -> list[OrderHistoryResponse]:
    service = CartService(db)

    order_history = service.get_order_history(current_user.id)
    logger.info("Retrieved order history for user ID: %s, total orders: %s", current_user.id, len(order_history))
    
    return order_history
