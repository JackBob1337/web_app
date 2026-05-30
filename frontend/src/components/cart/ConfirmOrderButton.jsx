import React from 'react'

function ConfirmOrderButton({ disabled, onClick, loading}) {
  return (
    <button
        type="button"
        className="cart-confirm-btn"
        disabled={disabled || loading}
        onClick={onClick}
    >
        {loading ? 'Processing...' : 'Confirm'}
       

    </button>
  )
}

export default ConfirmOrderButton
