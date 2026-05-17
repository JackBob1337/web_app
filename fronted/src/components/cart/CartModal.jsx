import React, { useState, useRef, useEffect } from 'react'

import CartItemCard from "./CartItemCard";
import CartFooter from "./CartFooter";
import ClearCartButton from './ClearCartButton';

import Empty_Cart from '../assets/empty_cart.png';
import { motion, AnimatePresence} from 'framer-motion';

import './Cart.css';

const CartModal = ({ 
    isOpen, 
    onClose, 
    cartItems, 
    cartTotalCents, 
    onConfirm, 
    placingOrder, 
    onQtyClick, 
    onRemove, 
    onClearCart, 
    clearCartDisabled 
}) => {
    const [openQtyItemId, setOpenQtyItemId] = useState(null);
    const qtyPopoverRef = useRef(null);

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
    <motion.div className='cart-modal-overlay' 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
    >
        <motion.div 
            className="cart"
            id="cart"
            key="cart-modal"
            initial={{ scale: 0.05, opacity: 0, y: 60, transformOrigin: "bottom right" }}
            animate={{ scale: 1, opacity: 1, y: 0, transformOrigin: "bottom right" }}
            exit={{ scale: 0.05, opacity: 0, y: 60, transformOrigin: "bottom right" }}
            transition={{ type: "spring", stiffness: 340, damping: 28, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="cart-container">
                <div className="cart-header">
                    <h2>Your Order</h2>
                    <button type='button' className='btn-close' onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.0303 8.96965C9.73741 8.67676 9.26253 8.67676 8.96964 8.96965C8.67675 9.26255 8.67675 9.73742 8.96964 10.0303L10.9393 12L8.96966 13.9697C8.67677 14.2625 8.67677 14.7374 8.96966 15.0303C9.26255 15.3232 9.73743 15.3232 10.0303 15.0303L12 13.0607L13.9696 15.0303C14.2625 15.3232 14.7374 15.3232 15.0303 15.0303C15.3232 14.7374 15.3232 14.2625 15.0303 13.9696L13.0606 12L15.0303 10.0303C15.3232 9.73744 15.3232 9.26257 15.0303 8.96968C14.7374 8.67678 14.2625 8.67678 13.9696 8.96968L12 10.9393L10.0303 8.96965Z" fill="currentColor"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C17.1086 2.75 21.25 6.89137 21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>

                <div className='cart-items-list'>
                    {cartItems.length === 0 && (
                        <div className='cart-empty-container'>
                            <motion.img 
                                src={Empty_Cart} 
                                alt="Empty cart" 
                                className='empty-cart-img'
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                            <p className='cart-empty'>Your cart is empty</p>
                        </div>
                    )}
                    {cartItems.map((item) => (
                        <CartItemCard
                            key={item.id}
                            item={item}
                            openQtyItemId={openQtyItemId}
                            onOpenStepper={setOpenQtyItemId}
                            onQtyClick={onQtyClick}
                            onRemove={onRemove}
                            qtyPopoverRef={qtyPopoverRef}
                        />
                    ))}
                </div>

                <div className='cart-bottom-actions'>
                    <ClearCartButton 
                        onClearCart={onClearCart} 
                        disabled={clearCartDisabled} 
                    />
                </div>

                <CartFooter
                    cartTotalCents={cartTotalCents}
                    onConfirm={onConfirm}
                    disabled={cartItems.length === 0}
                    loading={placingOrder}
                />
                
            </div>
        </motion.div>
    </motion.div>
  )
}

export default CartModal
