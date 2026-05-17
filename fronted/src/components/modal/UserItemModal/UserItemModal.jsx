import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './UserItemModal.css';

const UserItemModal = ({ isOpen, onClose, item, onAddToCart, addingToCart }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) setQuantity(1);
  }, [isOpen, item?.id]);

  if (!isOpen || !item) return null;

  const totalPriceCents = (item.price_cents ?? 0) * quantity;

  const handleQtyClick = (delta) => {
    setQuantity((q) => Math.max(1, q + delta));
  };

  const handleAdd = () => {
    onAddToCart(item, quantity);
    setQuantity(1);
  };

  return (
    <motion.div 
        className="user-item-modal-overlay" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
    >
      <motion.div   
        className="user-item-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <img 
            src={`http://localhost:8000${item.image_url}`} 
            alt={item.name} 
            className="item-image" 
        />
        <div className='item-modal-name-price'>
            <h3>{item.name}</h3>
            <p className="item-price">${(item.price_cents / 100).toFixed(2)}</p>
        </div>
        <p>{item.description}</p>
        
        <div className="modal-footer">
            <div className="qty-row">
            <motion.div
                className="qty-stepper"
                initial={{ opacity: 0, x: 18, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 25 }}
            >
                <button
                type="button"
                className="qty-step-btn"
                onClick={() => handleQtyClick(-1)}
                >
                <svg className="qty-step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M15 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                </button>

                <motion.span
                key={quantity}
                className="qty-step-value"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15 }}
                >
                {quantity}
                </motion.span>

                <button
                type="button"
                className="qty-step-btn"
                onClick={() => handleQtyClick(1)}
                >
                <svg className="qty-step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                
                </button>
            </motion.div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={addingToCart}
              className="add-to-cart-btn"
            >
            {addingToCart ? (
                'Adding...'       
            ): (
                <>
                    <span>Add to cart</span>
                    <span className='btn-price'>${(totalPriceCents / 100).toFixed(2)}</span>
                </>
            )}
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserItemModal;