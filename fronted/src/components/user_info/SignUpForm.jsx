import React from 'react';
import { motion } from 'framer-motion';

const SignUpForm = ({ form, handleChange, handleSubmit, error, loading, direction, slideVariants }) => (
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
        <input className="auth-input" name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input className="auth-input" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className="auth-input" name="phone_number" type="tel" placeholder="Phone number" value={form.phone_number} onChange={handleChange} />
        <input className="auth-input" name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="auth-submit" disabled={loading}>{loading ? '...' : 'Sign Up'}</button>
    </motion.form>
);

export default SignUpForm;