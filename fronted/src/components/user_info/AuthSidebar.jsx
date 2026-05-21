import React, { useState } from 'react';
import logo from '../assets/ProjectLogo.png';
import { AnimatePresence } from 'framer-motion';


import useLogin from '../../hooks/useLogin';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

import './AuthSidebar.css';

const slideVariants = {
    initial: (dir) => ({ x: dir * 60, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir * -60, opacity: 0 }),
};

const AuthSidebar = ({ onLoginSuccess, onRegisterSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [direction, setDirection] = useState(1);

    const switchTab = (toLogin) => {
        setDirection(toLogin ? -1 : 1);
        setIsLogin(toLogin);
    };

    const handleRegisterSuccess = (token) => {
        onRegisterSuccess?.(token);
        setTimeout(() => switchTab(true), 300);
    }
  
    return (
        <div className="auth-sidebar">
            <div className="auth-logo">
                <img src={logo} alt="logo" className="auth-logo-img" />
            </div>
            <div className="auth-form-group">
                <div className="auth-sidebar-tabs">
                    <button type="button" className={`auth-tab ${isLogin ? 'auth-tab-active' : ''}`} onClick={() => switchTab(true)}>Login</button>
                    <button type="button" className={`auth-tab ${!isLogin ? 'auth-tab-active' : ''}`} onClick={() => switchTab(false)}>Sign Up</button>
                </div>
                <div className="auth-form-wrapper">
                    <AnimatePresence mode="wait" custom={direction}>
                        {isLogin ? (
                            <LoginForm
                                onLoginSuccess={onLoginSuccess}
                                direction={direction}
                                slideVariants={slideVariants}
                            />
                        ) : (
                            <SignUpForm
                                onRegisterSuccess={handleRegisterSuccess}
                                direction={direction}
                                slideVariants={slideVariants}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AuthSidebar;