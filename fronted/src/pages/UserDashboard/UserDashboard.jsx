import React, {useState, useEffect, useRef} from 'react'
import { motion, AnimatePresence} from 'framer-motion';

import CartModal from '../../components/cart/CartModal';
import CartButton from '../../components/cart/CartButton';

import './UserDashboard.css';

const UserDashboard = ({ onLogout }) => {

    const [categories, setCategories] = useState([]);
    const [itemsByCategory, setItemsByCategory] = useState({});
    const [selectedItemId, setSelectedItemId] = useState(null);

    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    const [openQtyItemId, setOpenQtyItemId] = useState(null);

    const [qtyPulseItemId, setQtyPulseItemId] = useState(null);
    const [updatingQtyItemId, setUpdatingQtyItemId] = useState(null);

    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);

    const cartItemsCount = cartItems.length;
    const qtyPopoverRef = useRef(null);
    const unitPriceCents = activeItem?.price_cents ?? 0;
    const totalPriceCents = unitPriceCents * quantity;
    const cartTotalCents = cartItems.reduce(
        (sum, item) => sum + item.line_total_cents, 
        0
    );

    const handleQuantityChange = (value) => {
        const n = Number(value);
        if (!Number.isFinite(n) || n < 1) {
            setQuantity(1);
            return;
        } 
        setQuantity(n);
    };

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const payload = token.split('.')[1];
            const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
            const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');
            const decoded = JSON.parse(atob(padded));
            return decoded.sub ? Number(decoded.sub) : null;
        } catch (error) {
            return null;
        }
    }
    
    const fetchItemsByCategory = async (categoryID) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:8000/menu/get_items_by_category/${categoryID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                alert(data.detail || "Could not fetch items");
                return;
            }

            setItemsByCategory((prevItems) => ({
                ...prevItems,
                [categoryID]: data,
            }));
        } catch (error) {
            console.error('Error fetching items by category:', error);
            alert("Network error");
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8000/menu/get_all_categories', {
                method: 'GET',
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                alert(data.detail || "Could not fetch categories");
                return;
            }

            setCategories(data);
            data.forEach(category => fetchItemsByCategory(category.id));
            
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert("Network error");
        }
    };

    const openItemModal = (item) => {
        setActiveItem(item);
        setQuantity(1);
        setIsItemModalOpen(true);
    }

    const closeItemModal = () => {
        setIsItemModalOpen(false);
        setActiveItem(null);
        setQuantity(1);
    }

    const handleAddToCart = async () => {
        if (!activeItem) return;

        const userId = getUserIdFromToken();
        const token = localStorage.getItem('token');

        if (!userId || !token) {
            alert("User not authenticated");
            return;
        }

        if (quantity < 1) {
            alert("Quantity must be at least 1");
            return;
        }

        try {
            setAddingToCart(true);

            const response = await fetch(`http://localhost:8000/cart/add-item?user_id=${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    menu_item_id: activeItem.id,
                    quantity,
                }),

            });

            const data = await response.json();

            if(!response.ok) {
                alert(data.detail || "Failed to add item to cart");
                return;
            }

            await fetchCartItems();
            closeItemModal();

        } catch (e) {
            alert("Network error");
        } finally {
            setAddingToCart(false);
        }
    }

    const fetchCartItems = async () => {
        const userId = getUserIdFromToken();
        const token = localStorage.getItem('token');

        if (!userId || !token) return;

        try {
            const response = await fetch(`http://localhost:8000/cart/cart-items?user_id=${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
        });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                alert(data.detail || "Could not fetch cart items");
                return;
            }

            setCartItems(
                Array.isArray(data.items)
                ? [...data.items].sort((a, b) => a.id - b.id)
                : []
            );
        } catch (error) {
            console.error('Error fetching cart items:', error);
            alert("Network error");
        }
    }

    const handleCartQtyClick = async (item, delta) => {
        const userId = getUserIdFromToken();
        const token = localStorage.getItem('token');

        if(!userId || !token) return;

        const nextQty = Math.max(0, item.quantity + delta);

        setCartItems((prev) =>
        prev
            .map((ci) =>
                ci.id === item.id
                    ? {
                        ...ci,
                        quantity: nextQty,
                        line_total_cents: nextQty * ci.unit_price_cents,
                    }
                    : ci
            )
            .filter((ci) => ci.quantity > 0)
        );

        setQtyPulseItemId(item.id);
        window.setTimeout(() => setQtyPulseItemId(null), 180);
        

        try {
            setUpdatingQtyItemId(item.id);
            const response = await fetch('http://localhost:8000/cart/update-item?user_id=' + userId, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify({
                    menu_item_id: item.menu_item_id,
                    quantity: nextQty,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Failed to update quantity');

            setCartItems(
                Array.isArray(data.items)
                ? [...data.items].sort((a, b) => a.id - b.id)
                : []
            );

        } catch (e) {
            alert("Network error");
        } finally {
            setUpdatingQtyItemId(null);
        }
    }

    const handleRemoveFromCart = async (item) => {
        const userId = getUserIdFromToken();
        const token = localStorage.getItem('token');
        if (!userId || !token) return;

        setCartItems((prev) => prev.filter((ci) => ci.id !== item.id));
        setOpenQtyItemId(null);

        try {
            const response = await fetch(
                `http://localhost:8000/cart/remove-item?user_id=${userId}&menu_item_id=${item.menu_item_id}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: 'Bearer ' + token },
                }
            );

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Failed to remove item');

            setCartItems(
                Array.isArray(data.items)
                    ? [...data.items].sort((a, b) => a.id - b.id)
                    : []
            );
        } catch (e) {
            await fetchCartItems();
        }
    };

    const handleConfirmedOrder = async () => {
        const userId = getUserIdFromToken();
        const token = localStorage.getItem('token');

        if (!userId || !token) return;
        
        try {
            setPlacingOrder(true);
            
            const response = await fetch(`http://localhost:8000/cart/place-order?user_id=${userId}`,{
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if(!response.ok) {
                alert(data.detail || "Failed to place order");
                return;
            }

            setCartItems([]);
            setIsCartOpen(false);
            setOrderConfirmed(true);
            alert("Order placed successfully!");
        } catch (e) {
            alert("Network error");
        } finally {
            setPlacingOrder(false);
        }
    }

    useEffect(() => {
            fetchCategories();
            fetchCartItems();
        }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (qtyPopoverRef.current && !qtyPopoverRef.current.contains(event.target)) {
                setOpenQtyItemId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };     
    }, []);


  return (
    <div className='user-dashboard'>
        <button className='logout-btn' onClick={onLogout}>Logout</button>    
        <div className="dashboard-layout">
            <div className='categories-list'>
            
            {categories.map((category) => (
                <div className='category-container user' key={category.id}>
                    <h3 className='category-name'>{category.name}</h3>
                    <div className='items-list'>
                        {(itemsByCategory[category.id] || []).map(item => (
                            <div 
                                className={`item-card ${selectedItemId === item.id ? 'item-card-selected' : ''}`} 
                                key={item.id}
                                onClick={() => openItemModal(item)}
                            >
                                <img 
                                    src={`http://localhost:8000${item.image_url}`} 
                                    alt={item.name} 
                                    className="item-image" 
                                />
                                <h4 className='item-name'>{item.name}</h4>
                                <p className='item-description'>{item.description}</p>
                        
                                <p className='item-price'>${(item.price_cents / 100).toFixed(2)}</p>
                            </div>
                        ))}       
                    </div>
                </div>  
            ))}

        {isItemModalOpen && activeItem && (
            <div className="user-item-modal-overlay" onClick={closeItemModal}>
                <div className="user-item-modal" onClick={(e) => e.stopPropagation()}>
                <h3>{activeItem.name}</h3>
                <p>{activeItem.description}</p>
                <p className="item-price">${(totalPriceCents / 100).toFixed(2)}</p>

                <div className="qty-row">
                    <button className="qty-btn" type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                    <span className="qty-value" key={quantity}>{quantity}</span>
                    <button className="qty-btn" type="button" onClick={() => setQuantity((q) => q + 1)}>+</button>
                </div>

                <button type="button" onClick={handleAddToCart} disabled={addingToCart}>
                    {addingToCart ? "Добавляю..." : "Добавить в корзину"}
                </button>
                </div>
            </div>
        )}

            </div>
            {/* Cart */}
            <AnimatePresence>
                {!isCartOpen && (
                    <CartButton
                        cartItemsCount={cartItemsCount}
                        onOpen={() => setIsCartOpen(true)}
                    />
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {isCartOpen && (
                    <CartModal
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                        cartItems={cartItems}
                        cartTotalCents={cartTotalCents}
                        onConfirm={handleConfirmedOrder}
                        placingOrder={placingOrder}
                        onQtyClick={handleCartQtyClick}
                        onRemove={handleRemoveFromCart}
                    />
                )}

            </AnimatePresence>


        </div>
    </div>
  )
}

export default UserDashboard
