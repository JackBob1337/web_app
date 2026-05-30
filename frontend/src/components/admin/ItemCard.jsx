import React from "react";
import './ItemCard.css';

const ItemCard = ({ item, onEdit, onDeleteItem }) => {
    return (
        <div className='item-card'>
            <div className='item-actions'>
                <button 
                    className='edit-item-btn'
                    onClick={() => onEdit(item)}
                    aria-label='Edit item'
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <g>
                            <path d="M4 20.0001H20M4 20.0001V16.0001L12 8.00012M4 20.0001L8 20.0001L16 12.0001M12 8.00012L14.8686 5.13146L14.8704 5.12976C15.2652 4.73488 15.463 4.53709 15.691 4.46301C15.8919 4.39775 16.1082 4.39775 16.3091 4.46301C16.5369 4.53704 16.7345 4.7346 17.1288 5.12892L18.8686 6.86872C19.2646 7.26474 19.4627 7.46284 19.5369 7.69117C19.6022 7.89201 19.6021 8.10835 19.5369 8.3092C19.4628 8.53736 19.265 8.73516 18.8695 9.13061L18.8686 9.13146L16 12.0001M12 8.00012L16 12.0001"
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                    </svg>
                </button>

                <button 
                    className='delete-item-btn'
                    onClick={onDeleteItem}
                >
                    <svg className="delete-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 10L7.70141 19.3578C7.87432 20.3088 8.70258 21 9.66915 21H14.3308C15.2974 21 16.1257 20.3087 16.2986 19.3578L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            <img 
                src={`http://localhost:8000${item.image_url}`} 
                alt={item.name} 
                className="item-image" 
            />
            
            <div className='item-info'>
                <div className='item-top-row'>
                    <span className='item-name'>{item.name}</span>
                    <span className='item-price'>${(item.price_cents / 100).toFixed(2)}</span>
                </div>
                <span className='item-description'>
                    {item.description || 'No description'} 
                </span>
                <div className='item-bottom-row'>
                    <span className='item-stock'>Amount: {item.stock}</span>
                </div>

            </div>

        </div>

    );
}
export default ItemCard;