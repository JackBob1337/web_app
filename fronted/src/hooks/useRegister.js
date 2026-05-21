import { useState } from "react";
import useCart from './useCart';

const useRegister = ({ onRegisterSuccess} = {}) => {
    const [isLogin, setIsLogin] = useState(false);
    const [form, setForm] = useState({
        username: '',
        email: '',
        phone_number: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { migrateGuestCartToUser } = useCart();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.detail || 'Registration failed');
                return;
            }
            localStorage.setItem('token', data.access_token);
            onRegisterSuccess(data.access_token);
            await migrateGuestCartToUser(data.access_token);
            
        } catch (error) {
            console.error(error);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        };
    };

    return { form, error, isLoading, handleChange, handleSubmit };
}

export default useRegister;