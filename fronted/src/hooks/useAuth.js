import { useState } from 'react';

const useAuth = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [direction, setDirection] = useState(1);
    const [form, setForm] = useState({ username: '', email: '', phone_number: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const switchTab = (toLogin) => {
        setDirection(toLogin ? -1 : 1);
        setIsLogin(toLogin);
        setError('');
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const url = `http://localhost:8000${isLogin ? '/auth/login' : '/auth/register'}`;
        const body = isLogin
            ? { email: form.email, password: form.password }
            : { username: form.username, email: form.email, phone_number: form.phone_number, password: form.password };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (!response.ok) { setError(data.detail || 'Something went wrong'); return; }
            localStorage.setItem('token', data.access_token);
            onLoginSuccess(data.access_token);
        } catch {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    return { isLogin, direction, form, error, loading, switchTab, handleChange, handleSubmit };
};

export default useAuth;