import React, {useState, useEffect} from 'react'
import './UserDashboard.css';

const UserDashboard = ({ onLogout }) => {

    const [categories, setCategories] = useState([]);
    const [itemsByCategory, setItemsByCategory] = useState({});
    const [selectedItemId, setSelectedItemId] = useState(null);

    const handleItemClick = (itemId) => {
        setSelectedItemId((prev) => (prev === itemId ? null : itemId));
    }
    
    const fetchItemsByCategory = async (categoryID) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`http://localhost:8000/menu/get_items_by_category/${categoryID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                alert(data.detail || "Could not fetch items");
                return;
            }

            setItemsByCategory((prevItems) => ({
                ...prevItems,
                [categoryID]: data,
            }));
        } catch (error) {
            console.error('Error fetching items by category:', error);
            alert("Network error");
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8000/menu/get_all_categories', {
                method: 'GET',
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                alert(data.detail || "Could not fetch categories");
                return;
            }

            setCategories(data);
            data.forEach(category => fetchItemsByCategory(category.id));
            
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert("Network error");
        }
    };

    useEffect(() => {
            fetchCategories();
        }, []);


  return (
    <div className='user-dashboard'>
    <button onClick={onLogout}>Logout</button>    
    <div className='categories-list'>
        {categories.map((category) => (
            <div className='category-container user' key={category.id}>
                <h3 className='category-name'>{category.name}</h3>
                <div className='items-list'>
                    {(itemsByCategory[category.id] || []).map(item => (
                        <div 
                            className={`item-card ${selectedItemId === item.id ? 'item-card-selected' : ''}`} 
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
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
                    ))}
                </div>
            </div>
        ))}


      </div>
    </div>
  )
}

export default UserDashboard
