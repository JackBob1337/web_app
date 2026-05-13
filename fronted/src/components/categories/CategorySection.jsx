import React from 'react'
import ItemCard from '../../components/categories/ItemCard';
import './CategorySection.css';

const CategorySection = ({ category, itemsByCategory, openItemModal }) => {
  return (
    <div className='category-container user' key={category.id}>
        <h3 className='category-name'>{category.name}</h3>
        <div className='items-list'>
            {(itemsByCategory[category.id] || []).map(item => (
                <ItemCard 
                    key={item.id} 
                    item={item} 
                    onItemClick={() => openItemModal(item)} 
                />
            ))}       
        </div>
    </div>  
  )
}

export default CategorySection
