import React from 'react';
import ItemList from './ItemList';
import './CategoryCard.css';

const CategoryCard = ({ category, items, onAddItem, onDeleteCategory, onEditItem, onDeleteItem }) => {
    return (
        <div className="category-container">
            <div className="head-of-block">
                <h3 className="category-name">{category.name}</h3>
                <div className="buttons">
                    <button className="delete-button" onClick={() => onDeleteCategory(category.id)}>
                        <svg className="delete-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M4 7H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 10L7.70141 19.3578C7.87432 20.3088 8.70258 21 9.66915 21H14.3308C15.2974 21 16.1257 20.3087 16.2986 19.3578L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
            <ItemList
                items={items}
                onEdit={onEditItem}
                onDeleteItem={(itemId) => onDeleteItem(itemId, category.id)}
                categoryId={category.id}
                onAddItem={() => onAddItem(category.id)}
            />
        </div>
    );
};

export default CategoryCard;