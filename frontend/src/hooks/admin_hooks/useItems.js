import { useState } from 'react';
import { toast } from 'react-toastify';

const useItems = () => {
    const [itemsByCategory, setItemsByCategory] = useState({});

    const fetchItemsByCategory = async (categoryID) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.REACT_APP_API_URL}/menu/get_items_by_category/${categoryID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (!response.ok) return;

            const data = await response.json();

            setItemsByCategory((prev) => ({
                ...prev,
                [categoryID]: data,
            }));
        } catch (error) {
            console.error('Error fetching items by category:', error);
            toast.error("Network error");
        }
    };

    const handleDeleteItem = async (itemId, categoryId) => {
        const confirmed = window.confirm("Are you sure you want to delete this item?");

        if (confirmed) {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(`${process.env.REACT_APP_API_URL}/menu/delete_item/${itemId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                const data = await response.json();

                if(!response.ok) {
                    toast.error(data.message || "Something went wrong. Please try again");
                    return;
                }

                await fetchItemsByCategory(categoryId);
            } catch (error) {
                console.error('Error deleting item:', error);
                toast.error(error.message || "Network error");
            }
        }
    };

    return { itemsByCategory, fetchItemsByCategory, handleDeleteItem };

}

export default useItems;