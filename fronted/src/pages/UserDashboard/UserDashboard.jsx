import React, {useState, useEffect} from 'react'
import { AnimatePresence} from 'framer-motion';

import useCatalog from '../../hooks/useCatalog';
import useCart from '../../hooks/useCart';
import useProfile from '../../hooks/useProfile';
import useOrders from '../../hooks/useOrders';

import CategorySection from '../../components/categories/CategorySection';
import UserCard  from '../../components/user_info/UserCard';
import AuthSidebar from '../../components/user_info/AuthSidebar';
import CartModal from '../../components/cart/CartModal';
import CartButton from '../../components/cart/CartButton';
import UserItemModal from '../../components/modal/UserItemModal/UserItemModal';

import './UserDashboard.css';

const UserDashboard = ({ onLogout, onLoginSuccess, isLoggedIn }) => {
    const closeItemModal = () => {
        setIsItemModalOpen(false);
        setActiveItem(null);
    }

    const openItemModal = (item) => {
        setActiveItem(item);
        setIsItemModalOpen(true);
    };

    const { orders, loading, error: ordersError, fetchOrders } = useOrders();
    const { categories, itemsByCategory } = useCatalog();
    const {
        isCartOpen,
        setIsCartOpen,
        addingToCart,
        placingOrder,
        cartItems,
        cartItemsCount,
        cartTotalCents,
        fetchCartItems,
        handleAddToCart,
        handleCartQtyClick,
        handleRemoveFromCart,
        handleClearCart,
        handleConfirmedOrder,
        resetCart, 
    } = useCart({
        onAddedToCart: closeItemModal,
        onOrderPlaced: fetchOrders,
    });

    const { userInfo, refetch: refetchProfile } = useProfile();
    
    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    const handleLoginSuccessInDashboard = (token) => {
        onLoginSuccess(token);
        setTimeout(() => {
            refetchProfile();
            fetchCartItems();
            fetchOrders();
        }, 100);
    };
    const handleLogout = () => {
        resetCart();
        onLogout();
    };

    useEffect(() => {
        fetchCartItems();
        fetchOrders();
    }, []);

  return (
    <div className='user-dashboard'>
            
        <div className="dashboard-layout">

            <div className="user-sidebar">
                {isLoggedIn ? (
                    <UserCard
                        userInfo={userInfo}
                        refetch={refetchProfile}
                        onLogout={handleLogout}
                        orders={orders}
                        ordersLoading={loading}
                        ordersError={ordersError}
                    />
                ) : (
                    <AuthSidebar onLoginSuccess={handleLoginSuccessInDashboard} />
                )}
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

                <AnimatePresence>
                    {isItemModalOpen && activeItem && (
                        <UserItemModal
                            isOpen={isItemModalOpen}
                            onClose={() => setIsItemModalOpen(false)}
                            item={activeItem}
                            onAddToCart={handleAddToCart}
                            addingToCart={addingToCart}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Cart */} 
            <AnimatePresence>
                {isLoggedIn && !isCartOpen && (
                    <CartButton
                        cartItemsCount={cartItemsCount}
                        onOpen={() => setIsCartOpen(true)}
                    />
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {isLoggedIn && isCartOpen && (
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
