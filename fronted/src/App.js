import logo from './logo.svg';

import './App.css';
import LoginSignup from './pages/LoginSignup/LoginSignup';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
  }
 
  if (role === 'admin' || role === 'super_admin') {
    return (
      <div>
        <AdminDashboard onLogout={handleLogout}/>
      </div>
    );
  }

  return (
    <div>
      <LoginSignup onLoginSuccess={handleLoginSuccess}/>
    </div>
  );
}

export default App;
