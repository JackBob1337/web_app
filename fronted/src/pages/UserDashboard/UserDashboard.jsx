import React, {useState, useEffect, useRef} from 'react'
import { motion, AnimatePresence} from 'framer-motion';
import { getUserIdFromToken, getAuthToken } from '../../utils/auth';

import useCatalog from '../../hooks/useCatalog';
import useCart from '../../hooks/useCart';
import useProfile from '../../hooks/useProfile';

import CategorySection from '../../components/categories/CategorySection';

import UserCard  from '../../components/user_info/UserCard';

import ItemCard from '../../components/categories/ItemCard';
import CartModal from '../../components/cart/CartModal';
import CartButton from '../../components/cart/CartButton';
import UserItemModal from '../../components/modal/UserItemModal/UserItemModal';

import './UserDashboard.css';

const UserDashboard = ({ onLogout }) => {
    const closeItemModal = () => {
        setIsItemModalOpen(false);
        setActiveItem(null);
    }

    const openItemModal = (item) => {
        setActiveItem(item);
        setIsItemModalOpen(true);
    };

    const { categories, itemsByCategory } = useCatalog();
    const {
        isCartOpen,
        setIsCartOpen,
        addingToCart,
        placingOrder,
        cartItems,
        cartItemsCount,
        cartTotalCents,
        openQtyItemId,
        setOpenQtyItemId,
        fetchCartItems,
        handleAddToCart,
        handleCartQtyClick,
        handleRemoveFromCart,
        handleClearCart,
        handleConfirmedOrder,
    } = useCart({
        onAddedToCart: closeItemModal,
    });

    const { userInfo, refetch } = useProfile();

    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    useEffect(() => {
            fetchCartItems();
        }, []);

  return (
    <div className='user-dashboard'>
            
        <div className="dashboard-layout">

            <div className='user-sidebar'>
                <UserCard
                    userInfo={userInfo}
                    refetch={refetch}
                    onLogout={onLogout}
                />
            </div>
            
            <div className='categories-list'>

                {categories.map((category) => (
                    <CategorySection 
                        key={category.id}
                        category={category}
                        itemsByCategory={itemsByCategory}
                        openItemModal={openItemModal}
                    />
                ))}

                {isItemModalOpen && activeItem && (
                    <UserItemModal
                        isOpen={isItemModalOpen}
                        onClose={() => setIsItemModalOpen(false)}
                        item={activeItem}
                        onAddToCart={handleAddToCart}
                        addingToCart={addingToCart}
                    />
                )}
            </div>

            {/* Cart */} 
            <AnimatePresence>
                {!isCartOpen && (
                    <CartButton
                        cartItemsCount={cartItemsCount}
                        onOpen={() => setIsCartOpen(true)}
                    />
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {isCartOpen && (
                    <CartModal
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                        cartItems={cartItems}
                        cartTotalCents={cartTotalCents}
                        onConfirm={handleConfirmedOrder}
                        placingOrder={placingOrder}
                        onQtyClick={handleCartQtyClick}
                        onRemove={handleRemoveFromCart}
                        onClearCart={handleClearCart}
                        clearCartDisabled={cartItems.length === 0}
                    />
                )}
            </AnimatePresence>
        </div>
    </div>
  )
}

export default UserDashboard
