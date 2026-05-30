import { getAuthToken } from '../../utils/auth';
import { useState } from 'react';

const useOrders =() => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchOrders = async () => {
        setLoading(true);
        setError(null);

        const token = getAuthToken();

        if (!token ) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/cart/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (!response.ok) {
                setError(data.detail || 'Failed to fetch orders');
                setOrders([]);
                return;
            }
            setOrders(data);
        } catch (err) {
            setError('Network error');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }
    return { orders, loading, error, fetchOrders };
};

export default useOrders;

