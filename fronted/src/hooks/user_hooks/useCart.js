import { useEffect, useMemo, useState } from 'react';
import { updateCartItemQuantity, removeItemFromCart } from '../../utils/cart.js';
import { toast } from 'react-toastify';
import { getAuthToken, getUserIdFromToken } from '../../utils/auth.js';

const GUEST_CART_KEY = 'guest_cart';

const useCart = ({ onAddedToCart, onOrderPlaced} = {}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [openQtyItemId, setOpenQtyItemId] = useState(null);

  const cartItemsCount = cartItems.length;
  const cartTotalCents = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.line_total_cents, 0),
    [cartItems]
  );

  const fetchCartItems = async () => {
    const userId = getUserIdFromToken();
    const token = getAuthToken();
    if (!userId || !token) return;

    try {
      const response = await fetch(`http://localhost:8000/cart/cart-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail || 'Could not fetch cart items');
        return;
      }

      setCartItems(Array.isArray(data.items) ? [...data.items].sort((a, b) => a.id - b.id) : []);
    } catch {
      toast.error('Network error');
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      const guestCart = localStorage.getItem(GUEST_CART_KEY);
      setCartItems(guestCart ? JSON.parse(guestCart) : []);
    } else {
      fetchCartItems();
    }
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    if(!token) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);


  const handleAddToCart = async (item, qty) => {
    if (!item) return;

    const userId = getUserIdFromToken();
    const token = getAuthToken();

    if (!userId || !token) {
      setCartItems((prev) => {
        const exists = prev.find((ci) => ci.id === item.id);
        let newCart;
        if(exists) {
          newCart = prev.map(ci => 
            ci.id === item.id
              ? {...ci, quantity: ci.quantity + qty, line_total_cents: (ci.quantity + qty) * ci.unit_price_cents }
              : ci
          );
        } else {
          newCart = [
            ...prev,
            {
              ...item,
              quantity: qty,
              line_total_cents: qty * item.unit_price_cents,
            },
          ];
        }
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
        return newCart;
      });
      if (onAddedToCart) onAddedToCart();
      return;
    }

    try {
      setAddingToCart(true);

      const response = await fetch(`http://localhost:8000/cart/add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          menu_item_id: item.id,
          quantity: qty,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail || 'Failed to add item to cart');
        return;
      }

      await fetchCartItems();
      if (onAddedToCart) onAddedToCart();
    } catch {
      toast.error('Network error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleCartQtyClick = async (item, delta) => {
    const nextQty = Math.max(0, item.quantity + delta);
    const token = getAuthToken();

    if (!token) {
      setCartItems((prev) =>
        updateCartItemQuantity(prev, item.id, nextQty)
      );
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/cart/update-item`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          menu_item_id: item.menu_item_id,
          quantity: nextQty,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to update quantity');
      
      setCartItems(Array.isArray(data.items) ? [...data.items].sort((a, b) => a.id - b.id) : []);
    } catch {
      toast.error('Network error');
      await fetchCartItems();
    }
  };

  const handleRemoveFromCart = async (item) => {
    const token = getAuthToken();
    if (!token) {
      setCartItems((prev) => removeItemFromCart(prev, item.id));
      setOpenQtyItemId(null);
      return;
    };
    setCartItems((prev) => removeItemFromCart(prev, item.id));
    setOpenQtyItemId(null);

    try {
      const response = await fetch(
        `http://localhost:8000/cart/remove-item?menu_item_id=${item.menu_item_id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to remove item');

      setCartItems(Array.isArray(data.items) ? [...data.items].sort((a, b) => a.id - b.id) : []);
    } catch {
      toast.error('Network error');
      await fetchCartItems();
    }
  };

  const handleClearCart = async () => {
    const token = getAuthToken();
    if (!token) {
      localStorage.removeItem(GUEST_CART_KEY);
      setCartItems([]);
      setOpenQtyItemId(null);
      return;
    };

    try {
      const response = await fetch(`http://localhost:8000/cart/clear-cart`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail || 'Failed to clear cart');
        return;
      }

      setCartItems(Array.isArray(data.items) ? data.items : []);
      setOpenQtyItemId(null);
    } catch {
      toast.error('Network error');
    }
  };

  const handleConfirmedOrder = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error('You must be logged in to place an order');
      return};

    try {
      setPlacingOrder(true);

      const response = await fetch(`http://localhost:8000/cart/place-order`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail || 'Failed to place order');
        return;
      }

      setCartItems([]);
      setIsCartOpen(false);
      toast.success('Order placed successfully!');

      if (onOrderPlaced) onOrderPlaced();
    } catch {
      toast.error('Network error');
    } finally {
      setPlacingOrder(false);
    }
  };

  const migrateGuestCartToUser = async (newToken) => {
  const guestCart = localStorage.getItem(GUEST_CART_KEY);

  if (!guestCart || !newToken) return;

  const items = JSON.parse(guestCart);

  try {
    for (const item of items) {
      console.log(item);
      const response = await fetch(`http://localhost:8000/cart/add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${newToken}`,
        },
        body: JSON.stringify({
          menu_item_id: item.id,
          quantity: item.quantity,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to migrate cart');
      }
    }

    localStorage.removeItem(GUEST_CART_KEY);

  } catch (error) {
    console.error('Cart migration failed:', error);
    throw error;
  }
};
  const resetCart = () => {
      setCartItems([]);
      setIsCartOpen(false);
  };

  return {
    isCartOpen,
    setIsCartOpen,
    addingToCart,
    placingOrder,
    cartItems,
    cartItemsCount,
    cartTotalCents,
    openQtyItemId,
    setOpenQtyItemId,
    fetchCartItems,
    handleAddToCart,
    handleCartQtyClick,
    handleRemoveFromCart,
    handleClearCart,
    handleConfirmedOrder,
    resetCart,
    migrateGuestCartToUser,
  };
};

export default useCart;