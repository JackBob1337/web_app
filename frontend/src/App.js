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

const DEMO_USER = { email: 'saramartinez45@example.com', password: 'jyjhKi1O' };
const DEMO_ADMIN = { email: 'admin@example.com', password: 'admin123' };

async function loginAs(credentials, setRole) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem('token', data.access_token);
    setRole(getRoleFromToken(data.access_token));
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
      loginAs(DEMO_USER, setRole);
    }
  });
  
  const handleLoginSuccess = (token) => {
    setRole(getRoleFromToken(token));
  };

  const handleAfterLogout = () => {
    localStorage.removeItem('token');
    setRole(null);
  };

  const switchToUser = () => loginAs(DEMO_USER, setRole);
  const switchToAdmin = () => loginAs(DEMO_ADMIN, setRole);

  const isAdmin = role === 'admin' || role === 'super_admin';

  return (
    <div>
      {isAdmin
        ? <AdminDashboard onLogout={handleAfterLogout}/>
        : <UserDashboard onLogout={handleAfterLogout} onLoginSuccess={handleLoginSuccess} isLoggedIn={!!role}/>
      }

      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        display: 'flex',
        gap: '8px',
        zIndex: 9999
      }}>
        <button
          onClick={switchToUser}
          style={{
            background: isAdmin ? '#444' : '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 14px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          User Demo
        </button>
        <button
          onClick={switchToAdmin}
          style={{
            background: isAdmin ? '#7c3aed' : '#444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 14px',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          Admin Demo
        </button>
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;