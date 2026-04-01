import React from 'react'
import './CategoryModel.css'

const CategoryModal = ({ isModalOpen, onClose, onSubmit }) => {
    if (!isModalOpen) return null;

  return (
    <div>
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Creating a category</h2>
                    <button className="modal-close" onClick={onClose}>X</button>
                </div>
            </div>    
        </div>      
    </div>
  )
}

export default CategoryModal
