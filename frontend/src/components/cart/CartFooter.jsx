import React from 'react'
import ConfirmOrderButton from './ConfirmOrderButton'

const CartFooter = ( { cartTotalCents, onConfirm, disabled, loading} ) => {
  return (
    <div className="cart-footer">
            <div className="cart-total-row">
                <span className='cart-total-label'>Total: </span>
                <span className='cart-total-value'>${(cartTotalCents / 100).toFixed(2)}</span>
                <ConfirmOrderButton
                    disabled={disabled}
                    loading={loading}
                    onClick={onConfirm}
                />
        </div>
    </div>
  )
};

export default CartFooter
