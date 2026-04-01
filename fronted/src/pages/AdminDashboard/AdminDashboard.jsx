
import React, { useState } from 'react' 
import './AdminDashboard.css'
import CategoryModal from '../../components/modal/CategoryModal/CategoryModal';

const AdminDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleCloseModal = () => setIsModalOpen(false);
    const handleOpenModal = () => setIsModalOpen(true);

    const handleAddCategoryClick = async (data) => {
        console.log(data);

        setIsModalOpen(false);
    }

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
