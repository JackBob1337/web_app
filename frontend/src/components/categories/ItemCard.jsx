import React from 'react'
import './ItemCard.css';

const ItemCard = ({ item, selectedItemId, onItemClick }) => {
  return (
    <div 
      className={`item-card ${selectedItemId === item.id ? 'item-card-selected' : ''}`}
      onClick={() => onItemClick(item)}
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
  )
}

export default ItemCard
