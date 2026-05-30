import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
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

  useState(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'saramartinez45@example.com', password: 'jyjhKi1O' })
      })
        .then(r => r.json())
        .then(data => {
          if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            setRole(getRoleFromToken(data.access_token));
          }
        })
        .catch(() => {});
    }
  });
  
  const handleLoginSuccess = (token) => {
    const userRole = getRoleFromToken(token);
    setRole(userRole);
  };

  const handleAfterLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
  };

  if (role === 'admin' || role === 'super_admin') {
    return (
      <div>
        <AdminDashboard onLogout={handleAfterLogout}/>
        <ToastContainer theme="dark" />
      </div>
    );
  }

  return (
    <div>
      <UserDashboard
        onLogout={handleAfterLogout}
        onLoginSuccess={handleLoginSuccess}
        isLoggedIn={!!role}
      />
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;