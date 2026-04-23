import React, {useEffect, useState} from 'react'
import './ItemModal.css'

function ItemModal({ isModalOpen, onClose, onSubmit, categoryID, item, mode = "create" }) {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price_cents: '',
        stock: '',
        is_available: true,
        category_id: "",
        image: null
    })

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === "edit" && item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
                price_cents: (item.price_cents / 100).toFixed(2), 
                stock: String(item.stock ?? ''),
                is_available: item.is_available ?? true,
                category_id: item.category_id ?? "",
                image: null,
            });

        } else {
            setFormData({
                name: '',
                description: '',
                price_cents: '',
                stock: '',
                is_available: true,
                category_id: categoryID || "",
                image: null
            });
        }
    }, [isModalOpen, mode, item, categoryID]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.price_cents || formData.price_cents <= 0) {
            newErrors.price_cents = "Price must be greater than 0";
        }
        if (!formData.category_id) newErrors.category_id = "Category is required";
        if (formData.stock === '' || Number(formData.stock) < 0) {
            newErrors.stock = "Stock cannot be negative";
        }
        if (mode === 'create' && !formData.image) newErrors.image = "Image is required";
        
        return newErrors;
    };

    const handleChange = (e) => {
        const {name, value, type, checked, files} = e.target;

        if (type === 'file') {
            setFormData(prev => ({
                ...prev,
                [name]: files && files.length > 0 ? files[0] : null,
            }));
            return;
        } 
        
        setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value  
        }));
    };

    

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('submit click', formData);
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            setErrors({});

            const data = new FormData();
            const priceCents = Math.round(Number(formData.price_cents) * 100);
            data.append('name', formData.name.trim());
            data.append('description', formData.description.trim());
            data.append('price_cents', String(priceCents));
            data.append('stock', String(Number(formData.stock)));
            data.append('is_available', String(formData.is_available));
            data.append('category_id', String(formData.category_id));
            data.append('image', formData.image);

            let response;
                        
            const token = localStorage.getItem('token');

            if (mode === 'edit') {
                if (formData.image) data.append('image', formData.image);
                response = await fetch(`http://localhost:8000/menu/update_item/${item.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,  
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    price_cents: priceCents,
                    stock: Number(formData.stock),
                    is_available: formData.is_available,
                }),
            });
            } else {
                data.append('image', formData.image);

                response = await fetch('http://localhost:8000/menu/create_item', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,  
                    },
                    body: data,
                });
            }
            const result = await response.json();

            if(!response.ok) {
                alert(result.message || "Failed to create item. Please try again.");
                return;
            }

            if (onSubmit) onSubmit(result);
            setFormData({
                name: '',
                description: '',
                price_cents: '',
                stock: '',
                is_available: true,
                category_id: categoryID ?? "",
                image: null,
            });
            setErrors({});
            onClose();
                
        } catch (error) {
            setErrors((prev) => ({
                ...prev,
                submit: error.message || "Unexpected error",
            }));
        } finally {
            setLoading(false);
        }
    }

    
    
    if (!isModalOpen) return null;

    return (
        <div>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-item-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">{mode === "edit" ? "Edit Item" : "Create Item"}</h2>
                        <button className="modal-close" onClick={onClose}>X</button>
                    </div>

                    <div className='item-inputs'>
                        <div className="item-input">
                            <input 
                                type="text" 
                                placeholder='Name' 
                                name="name" 
                                id="name" 
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        
                        <div className="item-input">
                            <input 
                                type="text" 
                                placeholder='Description' 
                                name="description" 
                                id="description" 
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="item-input">
                            <input 
                                type="text" 
                                placeholder='Price' 
                                name="price_cents" 
                                id="price_cents"
                                value={formData.price_cents} 
                                onChange={handleChange}
                            />
                        </div>
                        <div className="item-input">
                            <input 
                                type="text" 
                                placeholder='Stock' 
                                name="stock" 
                                id="stock" 
                                value={formData.stock}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="file-upload">
                            <label htmlFor="image" className="create-button file-label">
                                Upload File
                            </label>
                            <input 
                                type="file"
                                placeholder="Image" 
                                name="image"   
                                id="image"
                                className="file-input"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className='modal-button'>
                        <button className='create-button' onClick={handleSubmit}>
                            {mode === "edit" ? "Update Item" : "Create Item"}
                        </button>
                    </div>
        
                </div>
            
            </div>
        </div>
    )
}

export default ItemModal
