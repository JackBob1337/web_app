import React, {useState} from 'react'
import './CategoryModal.css'

const CategoryModal = ({ isModalOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Category name cannot be empty.");
            return;
        }

        onSubmit({ name: name.trim() });
    }

    if (!isModalOpen) return null;

  return (
    <div>
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Creating a category</h2>
                    <button className="modal-close" onClick={onClose}>X</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-bottom">
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Category name"
                        />
                        <button className='create-button'>Create category</button>
                    </div>
                </form>
            </div>    
        </div>      
    </div>
  )
}

export default CategoryModal
