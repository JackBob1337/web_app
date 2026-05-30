import React, {useState} from 'react'
import { AnimatePresence } from 'framer-motion';

import EditUserProfileModal from '../modal/EditUserProfileModal/EditUserProfileModal';
import UserProfile from './UserProfile';
import LogoutBtn from './LogoutBtn';
import OrdersHistory from './OrdersHistory';

import './UserCard.css';

const UserCard = ({ userInfo, refetch, onLogout, orders, ordersLoading, ordersError }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <div className='user-card'>
        <UserProfile userInfo={userInfo} onEditClick={() => setIsEditOpen(true)} />
        <AnimatePresence>
          {isEditOpen && (
            <EditUserProfileModal
              isOpen={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              userInfo={userInfo}
              onSaved={() => { setIsEditOpen(false); refetch?.(); }}
            />
          )}
        </AnimatePresence>
        <LogoutBtn onLogout={onLogout} />
      </div>

      <div className='orders-card'>
        <OrdersHistory orders={orders} loading={ordersLoading} error={ordersError} />
      </div>
    </>
  );
}

export default UserCard
