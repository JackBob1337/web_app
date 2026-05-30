import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function useItemModalForm({ mode = 'create', item, categoryID, isModalOpen, onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price_cents: '',
        stock: '',
        is_available: true,
        category_id: '',
        image: null,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === 'edit' && item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                price_cents: (item.price_cents / 100).toFixed(2),
                stock: String(item.stock ?? ''),
                is_available: item.is_available ?? true,
                category_id: item.category_id ?? '',
                image: null,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price_cents: '',
                stock: '',
                is_available: true,
                category_id: categoryID || '',
                image: null,
            });
        }
    }, [isModalOpen, mode, item, categoryID]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.price_cents || formData.price_cents <= 0) {
            newErrors.price_cents = 'Price must be greater than 0';
        }
        if (!formData.category_id) newErrors.category_id = 'Category is required';
        if (formData.stock === '' || Number(formData.stock) < 0) {
            newErrors.stock = 'Stock cannot be negative';
        }
        if (mode === 'create' && !formData.image) newErrors.image = 'Image is required';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === 'file') {
            setFormData((prev) => ({
                ...prev,
                [name]: files && files.length > 0 ? files[0] : null,
            }));
            return;
        }
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        try {
            setLoading(true);
            setErrors({});
            const token = localStorage.getItem('token');
            let result;

            if (mode === 'edit') {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/menu/update_item/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        description: formData.description.trim(),
                        price_cents: Math.round(Number(formData.price_cents) * 100),
                        stock: Number(formData.stock),
                        is_available: formData.is_available,
                    }),
                });
                result = await response.json();
                if (!response.ok) {
                    toast.error(result.message || 'Failed to update item.');
                    return;
                }

                if (formData.image) {
                    const imgData = new FormData();
                    imgData.append('file', formData.image);
                    const imgRes = await fetch(`${process.env.REACT_APP_API_URL}/menu/upload_item_img/${item.id}`, {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: imgData,
                    });
                    const imgResult = await imgRes.json();
                    if (!imgRes.ok) {
                        toast.error(imgResult.message || 'Image upload failed.');
                        return;
                    }
                    result = imgResult; 
                }
                toast.success('Item updated successfully');
            } else {
                const data = new FormData();
                data.append('name', formData.name.trim());
                data.append('description', formData.description.trim());
                data.append('price_cents', String(Math.round(Number(formData.price_cents) * 100)));
                data.append('stock', String(Number(formData.stock)));
                data.append('is_available', String(formData.is_available));
                data.append('category_id', String(formData.category_id));
                data.append('image', formData.image);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/menu/create_item`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: data,
                });
                result = await response.json();
                if (!response.ok) {
                    toast.error(result.message || 'Failed to create item.');
                    return;
                }
            }

            if (onSubmit) onSubmit(result);
            setFormData({
                name: '',
                description: '',
                price_cents: '',
                stock: '',
                is_available: true,
                category_id: categoryID ?? '',
                image: null,
            });
            setErrors({});
            onClose();
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                submit: error.message || 'Unexpected error',
            }));
            toast.error(error.message || 'Unexpected error');
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        setFormData,
        errors,
        setErrors,
        loading,
        handleChange,
        handleSubmit,
    };
}
