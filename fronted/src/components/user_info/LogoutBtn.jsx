import React from 'react'
import './LogoutBtn.css';

const LogoutBtn = ({ onLogout }) => {
  
  const handleLogOut = () => {
    localStorage.removeItem('token');
    onLogout?.();
  }
  
  return (
    <button className='logout-btn-sidebar' onClick={handleLogOut} type='button'>
      Logout
    </button>
  )
}

export default LogoutBtn