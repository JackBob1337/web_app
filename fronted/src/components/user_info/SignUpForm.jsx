import React from 'react';
import { motion } from 'framer-motion';
import useRegister from '../../hooks/user_hooks/useRegister';

const SignUpForm = ({ onRegisterSuccess, direction, slideVariants }) => {
    const { form, error, isLoading, handleChange, handleSubmit } = useRegister({ onRegisterSuccess });

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
                name="username" 
                placeholder="Username" 
                value={form.username} 
                onChange={handleChange} required 
            />
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
                name="phone_number" 
                type="tel" 
                placeholder="Phone number" 
                value={form.phone_number} 
                onChange={handleChange} 
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
                    {Array.isArray(error)
                    ? error.map((e, i) => (
                        <div key={i}>
                            {(e.msg || JSON.stringify(e)).replace(/^Value error,\s*/, '')}
                        </div>
                        ))
                    : typeof error === 'string'
                    ? error.replace(/^Value error,\s*/, '')
                    : (error?.msg || JSON.stringify(error)).replace(/^Value error,\s*/, '')}
                </div>
            )}
            <button type="submit" className="auth-submit" disabled={isLoading}>{isLoading ? '...' : 'Sign Up'}</button>
        </motion.form>
    );
};
export default SignUpForm;