import React, {useState} from 'react'

import EditUserProfileModal from '../modal/EditUserProfileModal/EditUserProfileModal';
import UserProfile from './UserProfile';
import LogoutBtn from './LogoutBtn';

import './UserCard.css';

const UserCard = ({ userInfo, refetch, onLogout}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className='user-card'>
        <UserProfile userInfo={userInfo} onEditClick={() => setIsEditOpen(true)} />

        <EditUserProfileModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          userInfo={userInfo}
          onSaved={() => {
            setIsEditOpen(false)
            refetch?.()
          }}
        />
        
        <LogoutBtn onLogout={onLogout}/>
    </div>
  )
}

export default UserCard
