import { useState, useEffect } from 'react';
import useItems from './useItems';
import { toast } from 'react-toastify';

const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const { itemsByCategory, fetchItemsByCategory } = useItems();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.REACT_APP_API_URL}/menu/get_all_categories`, {
                method: 'GET',
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                toast.error(data.detail || "Could not fetch categories");
                return;
            }

            setCategories(data);
            data.forEach(category => fetchItemsByCategory(category.id));
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error("Network error");
        }
    };

    const handleAddCategoryClick = async ({name, setIsModalOpen}) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.REACT_APP_API_URL}/menu/create_category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({name}),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Something went wrong. Please try again");
                return;
            }

            toast.success(`Category "${name}" created successfully`);
            setIsModalOpen(false);

            await fetchCategories();
            
        } catch (error) {
            console.error('Error adding category:', error);
            toast.error("Network error");
        }
    };

    const handleDeleteCategoryClick = async (categoryId) => {

        const confirmed = window.confirm("Are you sure you want to delete this category?");
        
        if (confirmed) {

            try {
                const token = localStorage.getItem('token');
    
                const response = await fetch(`${process.env.REACT_APP_API_URL}/menu/delete_category/${categoryId}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    },                
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    toast.error(data.message || "Something went wrong. Please try again");
                    return;
                }
    
                toast.success(`Category deleted successfully`);
                await fetchCategories();
            }
    
            catch (error) {
                console.error('Error deleting category:', error);
                toast.error("Network error");
            }
        }

    };

    return { categories,
            itemsByCategory,
            fetchItemsByCategory,
            fetchCategories, 
            handleAddCategoryClick,
            handleDeleteCategoryClick,
        };


}

export default useCategories;