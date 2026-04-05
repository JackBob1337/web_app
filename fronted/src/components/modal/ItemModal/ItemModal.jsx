import React, {useState} from 'react'
import 'ItemModal.css'

function ItemModal({ isModalOpen, onClose, onSubmit }) {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: 0,
        is_available: true,
        category_id: '',

    });
  return (
    <div>
      
    </div>
  )
}

export default ItemModal
