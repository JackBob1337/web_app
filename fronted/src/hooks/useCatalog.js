import { useEffect, useState } from "react";
import { getAuthToken } from "../utils/auth";

const useCatalog =() => {
    const [categories, setCategories] = useState([]);
    const [itemsByCategory, setItemsByCategory] = useState({});
    
    const fetchItemsByCategory = async (categoryID) => {
            try {
                const token = getAuthToken();
    
                const response = await fetch(`http://localhost:8000/menu/get_items_by_category/${categoryID}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    console.log(data);
                    alert(data.detail || "Could not fetch items");
                    return;
                }
    
                setItemsByCategory((prevItems) => ({
                    ...prevItems,
                    [categoryID]: data,
                }));
            } catch (error) {
                console.error('Error fetching items by category:', error);
                alert("Network error");
            }
        };
    
        const fetchCategories = async () => {
            try {
                const token = getAuthToken();
    
                const response = await fetch('http://localhost:8000/menu/get_all_categories', {
                    method: 'GET',
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                });
    
                const data = await response.json();
    
                if (!response.ok) {
                    console.log(data);
                    alert(data.detail || "Could not fetch categories");
                    return;
                }
    
                setCategories(data);
                data.forEach(category => fetchItemsByCategory(category.id));
                
            } catch (error) {
                console.error('Error fetching categories:', error);
                alert("Network error");
            }
        };

        useEffect(() => {
            fetchCategories();
        }, []);

        return { 
            categories, 
            itemsByCategory,
            reloadCategories: fetchCategories,
        };

};

export default useCatalog;