
import React, { useEffect, useState } from 'react' 
import './AdminDashboard.css'
import CategoryModal from '../../components/modal/CategoryModal/CategoryModal';

const AdminDashboard = ({ onLogout }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);

    const handleCloseModal = () => setIsModalOpen(false);
    const handleOpenModal = () => setIsModalOpen(true);

    const handleAddCategoryClick = async ({name}) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8000/menu/create_category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({name}),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Something went wrong. Please try again");
                return;
            }

            alert(`Category "${name}" created successfully`);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error adding category:', error);
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
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert("Network error");
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

  return (
    <div className='dashboard'>
        <header className='admin-header'>
            <div className='header-left'>
                <div className='logo'>Admin Dashboard</div>
                <div className='underline' />
            </div>

            <div className="header-actions">
                <button className='icon-button'
                onClick={handleOpenModal}
                >Add Category</button>
                <button className='icon-button'>Delete Category</button>
                <button className='icon-button' onClick={onLogout}>Logout</button>
            </div>

            <div className='categories-list'>
                {categories.map((category) => (
                    <div className='category-container' key={category.id}>
                        <h3>{category.name}</h3>
                    </div>
                ))}
            </div>

            


        </header>

        <CategoryModal 
            isModalOpen={isModalOpen} 
            onClose={handleCloseModal} 
            onSubmit={handleAddCategoryClick} 
        />

    </div>
  )
}

export default AdminDashboard
