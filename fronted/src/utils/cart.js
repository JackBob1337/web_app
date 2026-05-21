const GUEST_CART_KEY = 'guest_cart';

export const getGuestCart = () => {
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

export const setGuestCart = (cartItems) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
}

export const clearGuestCart = () => {
    localStorage.removeItem(GUEST_CART_KEY);
}

export const updateCartItemQuantity = (items, itemId, nextQty) => {
  return items
    .map((ci) =>
      ci.id === itemId
        ? {
            ...ci,
            quantity: nextQty,
            line_total_cents: nextQty * ci.unit_price_cents,
          }
        : ci
    )
    .filter((ci) => ci.quantity > 0);
};

export const removeItemFromCart = (items, itemId) => {
  const newCart = items.filter((ci) => ci.id !== itemId);
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(newCart));
  return newCart;
}


