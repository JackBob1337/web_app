import React from 'react';
import { motion } from 'framer-motion';
import useLogin from '../../hooks/useLogin';

const LoginForm = ({ onLoginSuccess, direction, slideVariants }) => {
    
    const { form, error, isLoading, handleChange, handleSubmit, loading } = useLogin({ onLoginSuccess });

    return (
        <motion.form
        custom={direction}
        variants={slideVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.18, ease: 'easeInOut' }}
        onSubmit={handleSubmit}
        className="auth-form"
    >
        <input 
            className="auth-input" 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={form.email} 
            onChange={handleChange} required 
        />
        <input 
            className="auth-input" 
            name="password" 
            type="password" 
            placeholder="Password" 
            value={form.password} 
            onChange={handleChange} required 
        />
        {error && (
            <div className="auth-error">
                {typeof error === 'string'
                ? error
                : error?.msg || JSON.stringify(error)}
            </div>
        )}
        <button type="submit" className="auth-submit" disabled={loading}>{loading ? '...' : 'Login'}</button>
    </motion.form>
  );
};

export default LoginForm;