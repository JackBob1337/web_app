import React, { useState } from 'react'
import { toast } from 'react-toastify';
import './EditUserProfileModal.css';

const EditUserProfileModal = ({isOpen, onClose, userInfo, onSaved}) => {

    const [form, setForm] = useState({
      username: userInfo?.username || '',
      phone_number: userInfo?.phone_number || '',
      email: userInfo?.email || '',
    })

    const [errors, setErrors] = useState({});

    const validateError = () => {
      const newErrors = {};

      if (!form.username.trim()) newErrors.username = "Username is required";
      if (form.email.trim() && !/\S+@\S+\.\S+/.test(form.email)) {
        newErrors.email = "Email is invalid";
      }
      if (form.phone_number && !/^\+?[1-9]\d{1,14}$/.test(form.phone_number)) {
        newErrors.phone_number = "Phone number is invalid";
      }

      return newErrors;
    }

    const handleChange = (e) => {
      
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });      
    };

    async function handleSubmit(e) {
      e.preventDefault();

      const newErrors = validateError();
      if (Object.keys(newErrors).length > 0) {
        console.log("Validation errors:", newErrors);
        setErrors(newErrors);
        return;
      }
      const token = localStorage.getItem('token');

      const body = {};

      if (form.username.trim()) body.username = form.username.trim();
      if (form.phone_number.trim()) body.phone_number = form.phone_number.trim();
      if (form.email.trim()) body.email = form.email.trim();

      try {
        setErrors({});
        const response = await fetch ("http://localhost:8000/users/me", {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const data = await response.json();
        console.log("Profile updated:", data);
        onSaved?.(data);
        toast.success('Profile updated successfully');
      } catch (error) {
        toast.error('Failed to update profile');
        console.error(error);
      }
    }

    if (!isOpen) return null;
    return (
    <div className='edit-profile-modal-overlay' onClick={onClose}>
      <div className='edit-profile-modal' onClick={(event) => event.stopPropagation()}>
        <div className="modal-name">
            <h3 className='edit-profile-title'>Edit profile</h3>
        </div>
        <div className="inputs">
            <div className="form-row">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  className="form-input"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                />
            </div>

            <div className="form-row">
                <label className="form-label" htmlFor="phone">Phone number</label>
                <input
                    id="phone"
                    className="form-input"
                    type="tel"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                />
            </div>

            <div className="form-row">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                    id="email"
                    className="form-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />
            </div>

            <div className="form-row">
                <label className="form-label" htmlFor="password-current">Current password</label>
                <input id="password-current" className="form-input" type="password" />
            </div>

            <div className="form-row">
                <label className="form-label" htmlFor="password-new">New password</label>
                <input id="password-new" className="form-input" type="password" />
            </div>

            <div className="form-row">
                <label className="form-label" htmlFor="password-confirm">Confirm password</label>
                <input id="password-confirm" className="form-input" type="password" />
            </div>
        </div>
        <div className='edit-profile-actions'>
          <button type='button' className='edit-profile-btn-secondary' onClick={onClose}>Cancel</button>
          <button
            type='button'
            className='edit-profile-btn-primary'
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditUserProfileModal
