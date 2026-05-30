import React, { useState } from 'react';
import './AdminDashboard.css';
import CategoryModal from '../../components/modal/CategoryModal/CategoryModal';
import ItemModal from '../../components/modal/ItemModal/ItemModal';
import CategoryCard from '../../components/admin/CategoryCard';
import useItems from '../../hooks/admin_hooks/useItems';
import useCategories from '../../hooks/admin_hooks/useCategories';


const AdminDashboard = ({ onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectCategoryId, setSelectCategoryId] = useState(null);
  const [editItemData, setEditItemData] = useState(null);
  const [showUserList, setShowUserList] = useState(false);

  const {
    categories,
    itemsByCategory,
    handleAddCategoryClick,
    handleDeleteCategoryClick,
    handleAddItem,
    handleEditItem,
    fetchItemsByCategory,
    fetchCategories,
  } = useCategories();

  const { handleDeleteItem } = useItems();
  const switchTab = (toUsers) => setShowUserList(toUsers);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const openEditItem = (item) => {
    setEditItemData(item);
    setSelectCategoryId(item.category_id);
    setIsItemModalOpen(true);
  };

  const handleCreateCategory = async (categoryData) => {
    await handleAddCategoryClick(categoryData);
    setIsModalOpen(false);
  };


  return (
    <div className='dashboard'>
      <header className='admin-header'>
        <div className='header-left'>
          <div className='logo'>Admin Dashboard</div>
          <div className='underline' />
        </div>
        <div className="header-actions">
          <button className='icon-button' onClick={handleOpenModal}>Add Category</button>
          <button className='icon-button' onClick={onLogout}>Logout</button>
        </div>
      </header>
        <div className='categories-list'>
          {(categories || []).map((category) => (
            <CategoryCard
                key={category.id}
                category={category}
                items={Array.isArray(itemsByCategory[category.id]) ? itemsByCategory[category.id] : []}
                
                onAddItem={() => {
                  setEditItemData(null);
                  setIsItemModalOpen(true);
                  setSelectCategoryId(category.id);
                }}

                onDeleteCategory={() => handleDeleteCategoryClick(category.id)}
                onEditItem={openEditItem}
                onDeleteItem={handleDeleteItem}
            />
            ))}
        </div>


      <CategoryModal
        isModalOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateCategory}
      />

      <ItemModal
        isModalOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        categoryID={selectCategoryId}
        item={editItemData}
        mode={editItemData ? 'edit' : 'create'}
        onSubmit={() => fetchItemsByCategory(selectCategoryId)}
      />
    </div>
  );
};

export default AdminDashboard;