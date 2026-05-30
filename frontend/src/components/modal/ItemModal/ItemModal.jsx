
import React from 'react';
import './ItemModal.css';
import useItemModalForm from './useItemModalForm';

function ItemModal({ isModalOpen, onClose, onSubmit, categoryID, item, mode = "create" }) {
    const {
        formData,
        errors,
        loading,
        handleChange,
        handleSubmit,
    } = useItemModalForm({ mode, item, categoryID, isModalOpen, onSubmit, onClose });

    if (!isModalOpen) return null;

    return (
        <div>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-item-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 className="modal-title">{mode === "edit" ? "Edit Item" : "Create Item"}</h2>
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
                            <label htmlFor="image" className="file-label">
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

                    <button className='modal-action-btn' onClick={handleSubmit} disabled={loading}>
                        {loading ? (mode === "edit" ? "Updating..." : "Creating...") : (mode === "edit" ? "Update Item" : "Create Item")}
                    </button>
        
                </div>
            </div>
        </div>
    );
}

export default ItemModal;
