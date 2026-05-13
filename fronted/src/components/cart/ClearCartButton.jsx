import React from 'react'

const ClearCartButton = ({onClearCart, disabled}) => {

  return (
    <button
        type='button'
        className='clear-cart-btn'
        onClick={onClearCart}
        disabled={disabled}
    >
        Clear Cart
    </button>
  )
}

export default ClearCartButton
