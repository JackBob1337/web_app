import React, {useState} from 'react'
import './ItemModal.css'

function ItemModal({ isModalOpen, onClose, onSubmit }) {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: 0,
        is_available: true,
        category_id: '',
    })

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.price_cents || formData.price_cents <= 0) {
            newErrors.price_cents = "Price must be greater than 0";
        }
        if (!formData.category_id) newErrors.category_id = "Category is required";
        if (!formData.stock < 0) newErrors.stock = "Stock cannot be negative";
        
        return newErrors;
    }

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
     }

    if (!isModalOpen) return null;

  return (
    <div>
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-item-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Creating an Item</h2>
                    <button className="modal-close" onClick={onClose}>X</button>
                </div>

                <div className='item-inputs'>
                    <div className="item-input">
                        <input 
                            type="text" 
                            placeholder='Name' 
                            name="name" 
                            id="name" 
                        />
                    </div>
                    <div className="item-input">
                        <input 
                            type="text" 
                            placeholder='Description' 
                            name="description" 
                            id="description" 
                        />
                    </div>
                    <div className="item-input">
                        <input 
                            type="text" 
                            placeholder='Price' 
                            name="price" 
                            id="price" 
                        />
                    </div>
                    <div className="item-input">
                        <input 
                            type="text" 
                            placeholder='Stock' 
                            name="stock" 
                            id="stock" 
                        />
                    </div>
                </div>

                <div className='modal-button'>
                    <button className='create-button'>Create item</button>
                </div>
    
            </div>
        
        </div>
    </div>
  )
}

export default ItemModal
