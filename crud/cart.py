from sqlalchemy.orm import Session
from db.order import Order as OrderModel
from db.order_items import OrderItem as OrderItemModel
from models.orders import AddToCartRequest, CartItemResponse, UpdateCartItemRequest, CartResponse, PlaceOrderResponse
from menu import MenuItemModel as MenuItemModel

def get_or_create_cart(db: Session, user_id: int) -> OrderModel:
    cart = db.query(OrderModel).filter(OrderModel.user_id == user_id, OrderModel.status == "cart").first()

    if not cart:
        cart = OrderModel(user_id=user_id, status="cart", total_price_cents=0)
        db.add(cart)
        db.commit()
        db.refresh(cart)

    return cart

def add_item_to_cart(db: Session, user_id: int, item_in: AddToCartRequest) -> CartResponse | None:
    if item_in.quantity <= 0:
        return None
    
    cart = get_or_create_cart(db, user_id)
    menu_item = db.query(MenuItemModel).filter(MenuItemModel.id == item_in.menu_item_id).first()

    if not menu_item:
        return None
    
    existing_cart_item = db.query(OrderItemModel).filter(OrderItemModel.order_id == cart.id, OrderItemModel.menu_item_id == item_in.menu_item_id).first()
    
    if existing_cart_item:
        existing_cart_item.quantity += item_in.quantity    
    else:
        cart_item = OrderItemModel(
            order_id=cart.id,
            menu_item_id=item_in.menu_item_id,
            quantity=item_in.quantity,
            price_cents_snapshot=menu_item.price_cents
        )
        db.add(cart_item)

    db.commit()
    
    cart_items = db.query(OrderItemModel).filter(OrderItemModel.order_id == cart.id).all()

    cart.total_price_cents = sum(item.quantity * item.price_cents_snapshot for item in cart_items)
    
    db.add(cart)
    db.commit()
    db.refresh(cart)

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
            ) for item in cart_items
        ],
        total_price_cents=cart.total_price_cents
    )

def list_cart_items(db: Session, user_id: int) -> list[CartItemResponse] | None: 
    cart = db.query(OrderModel).filter(OrderModel.user_id == user_id, OrderModel.status == "cart").first()

    if not cart:
        return None
    
    cart_items = db.query(OrderItemModel).filter(OrderItemModel.order_id == cart.id).all()
    return [
        CartItemResponse(
            id=item.id,
            menu_item_id=item.menu_item_id,
            name=item.menu_item.name,
            quantity=item.quantity,
            unit_price_cents=item.price_cents_snapshot,
            line_total_cents=item.quantity * item.price_cents_snapshot
        ) for item in cart_items
    ]

def get_cart(db: Session, user_id: int) -> CartResponse | None:
    items = list_cart_items(db, user_id)
    
    if items is None:
        return None
    
    return CartResponse(
        status="cart",
        items=items,
        total_price_cents=sum(item.line_total_cents for item in items)
    )

    
