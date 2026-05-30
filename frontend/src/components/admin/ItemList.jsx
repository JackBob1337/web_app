import React from "react";
import ItemCard from "./ItemCard";


const ItemList = ({ items, onEdit, onDeleteItem, categoryId, onAddItem }) => {
  return (
        <div className="items-list">
            {(items || []).map((item) => (
            <ItemCard
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDeleteItem={() => onDeleteItem(item.id, categoryId)}
            />
            ))}
            <div className="item-card add-item-card" onClick={onAddItem}>
                <div className="add-item-icon">

                    <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="22" fill="#f0f0f0" />
                    <line x1="24" y1="14" x2="24" y2="34" stroke="#888" strokeWidth="4" strokeLinecap="round"/>
                    <line x1="14" y1="24" x2="34" y2="24" stroke="#888" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default ItemList;