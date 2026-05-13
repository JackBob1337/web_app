import { useMemo, useState } from 'react';
import { getAuthToken, getUserIdFromToken } from '../utils/auth';

const useCart = ({ onAddedToCart }) => {
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
      const response = await fetch(`http://localhost:8000/cart/cart-items?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.detail || 'Could not fetch cart items');
        return;
      }

      setCartItems(Array.isArray(data.items) ? [...data.items].sort((a, b) => a.id - b.id) : []);
    } catch {
      alert('Network error');
    }
  };

  const handleAddToCart = async (item, qty) => {
    if (!item) return;

    const userId = getUserIdFromToken();
    const token = getAuthToken();
    if (!userId || !token) {
      alert('User not authenticated');
      return;
    }
    if (qty < 1) {
      alert('Quantity must be at least 1');
      return;
    }

    try {
      setAddingToCart(true);

      const response = await fetch(`http://localhost:8000/cart/add-item?user_id=${userId}`, {
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
        alert(data.detail || 'Failed to add item to cart');
        return;
      }

      await fetchCartItems();
      if (onAddedToCart) onAddedToCart();
    } catch {
      alert('Network error');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleCartQtyClick = async (item, delta) => {
    const userId = getUserIdFromToken();
    const token = getAuthToken();
    if (!userId || !token) return;

    const nextQty = Math.max(0, item.quantity + delta);

    setCartItems((prev) =>
      prev
        .map((ci) =>
          ci.id === item.id
            ? { ...ci, quantity: nextQty, line_total_cents: nextQty * ci.unit_price_cents }
            : ci
        )
        .filter((ci) => ci.quantity > 0)
    );

    try {
      const response = await fetch(`http://localhost:8000/cart/update-item?user_id=${userId}`, {
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
      alert('Network error');
      await fetchCartItems();
    }
  };

  const handleRemoveFromCart = async (item) => {
    const userId = getUserIdFromToken();
    const token = getAuthToken();
    if (!userId || !token) return;

    setCartItems((prev) => prev.filter((ci) => ci.id !== item.id));
    setOpenQtyItemId(null);

    try {
      const response = await fetch(
        `http://localhost:8000/cart/remove-item?user_id=${userId}&menu_item_id=${item.menu_item_id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Failed to remove item');

      setCartItems(Array.isArray(data.items) ? [...data.items].sort((a, b) => a.id - b.id) : []);
    } catch {
      await fetchCartItems();
    }
  };

  const handleClearCart = async () => {
    const userId = getUserIdFromToken();
    const token = getAuthToken();
    if (!userId || !token) return;

    try {
      const response = await fetch(`http://localhost:8000/cart/clear-cart?user_id=${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.detail || 'Failed to clear cart');
        return;
      }

      setCartItems(Array.isArray(data.items) ? data.items : []);
      setOpenQtyItemId(null);
    } catch {
      alert('Network error');
    }
  };

  const handleConfirmedOrder = async () => {
    const userId = getUserIdFromToken();
    const token = getAuthToken();
    if (!userId || !token) return;

    try {
      setPlacingOrder(true);

      const response = await fetch(`http://localhost:8000/cart/place-order?user_id=${userId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.detail || 'Failed to place order');
        return;
      }

      setCartItems([]);
      setIsCartOpen(false);
      alert('Order placed successfully!');
    } catch {
      alert('Network error');
    } finally {
      setPlacingOrder(false);
    }
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
  };
};

export default useCart;