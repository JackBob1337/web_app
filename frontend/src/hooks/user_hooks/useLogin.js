import { useState } from "react";

const useLogin = ({ onLoginSuccess}) => {
    const [isLogin, setIsLogin] = useState(false);
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form)
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.detail || 'Login failed');
                return;
            }
            localStorage.setItem('token', data.access_token);
            onLoginSuccess(data.access_token);
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }
    return { form, error, isLoading, handleChange, handleSubmit };
}

export default useLogin;