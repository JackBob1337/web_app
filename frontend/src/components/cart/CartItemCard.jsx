import React from 'react'
import { motion, AnimatePresence} from 'framer-motion';

const CartItemCard = ( {item, openQtyItemId, onOpenStepper, onQtyClick, onRemove, qtyPopoverRef} ) => {
  return (
    <div key={item.id} className='cart-item-card'>
        <img
            src={`${process.env.REACT_APP_API_URL}${item.image_url}`}
            alt={item.name}
            className='cart-item-img'
        />
        <div className='cart-item-info'>
            <p className='cart-item-name'>{item.name}</p>
            <div className='cart-item-stepper'>
            <AnimatePresence mode="wait" initial={false}>
                {openQtyItemId === item.id ? (
                    <motion.div
                        key="stepper"
                        className="cart-stepper"
                        ref={qtyPopoverRef}
                        initial={{ opacity: 0, x: 18, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 320, damping: 25 }} }
                        exit={{ opacity: 0, x: 18, scale: 0.96, transition: { duration: 0.07 }}}
                        transition={{ type: "spring", stiffness: 1000, damping: 40, mass: 0.2 }}
                    >
                    <button
                        type="button"
                        className="cart-step-btn"
                        onClick={() => onQtyClick(item, -1)}
                    >
                        <svg className="cart-step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M15 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>

                    <motion.span
                        key={item.quantity}
                        className="cart-step-value"
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        {item.quantity}
                    </motion.span>

                    <button
                        type="button"
                        className="cart-step-btn"
                        onClick={() => onQtyClick(item, 1)}
                    >
                        <svg className="cart-step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M12 9v6M9 12h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                    
                    <button
                        type="button"
                        className="cart-step-btn cart-step-remove"
                        onClick={() => onRemove(item)}
                        aria-label={`Remove ${item.name} from cart`}
                    >
                        <svg className="cart-step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 7h12M9 7V5h6v2M10 11v6M14 11v6M5 7l1 12h12L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>

                    </motion.div>
                ) : (
                    <motion.button
                        key="trigger"
                        type="button"
                        className="cart-item-qty-trigger"
                        onClick={() => onOpenStepper(item.id)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 , transition: {duration: 0.08}}}
                        exit={{ opacity: 0, scale: 0.9, transition: {duration: 0.05} }}
                        >
                        {item.quantity}
                    </motion.button>
                )}
            </AnimatePresence>
            
        </div>
            <p className='cart-item-price'>${(item.line_total_cents / 100).toFixed(2)}</p>
        </div>
    </div>
  )
}

export default CartItemCard
