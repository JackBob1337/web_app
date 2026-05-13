import logo from './logo.svg';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import LoginSignup from './pages/LoginSignup/LoginSignup';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import { useState } from 'react';

function getRoleFromToken(token) {
    if (!token) return null;
    
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, '=');
      const decode = JSON.parse(atob(padded));
      return decode.role || null;
    }
    catch {
      return null;
    }
  }


function App() {
  const [role, setRole] = useState(() => {
    const token = localStorage.getItem('token');
    return getRoleFromToken(token);
  });
  

  const handleLoginSuccess = (token) => {
    const userRole = getRoleFromToken(token);
    setRole(userRole);
  }

  const handleAfterLogout = () => {
    setRole(null);
  }

 
  if (role === 'admin' || role === 'super_admin') {
    return (
      <div>
        <AdminDashboard onLogout={handleAfterLogout}/>
        <ToastContainer />
      </div>
    );
  }

  if (role === 'user') { 
    return (
      <div>
        <UserDashboard onLogout={handleAfterLogout}/>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div>
      <LoginSignup onLoginSuccess={handleLoginSuccess}/>
      <ToastContainer />
    </div>
  );
}

export default App;
