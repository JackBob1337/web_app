import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import './EditUserProfileModal.css';

const EditUserProfileModal = ({isOpen, onClose, userInfo, onSaved}) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [direction, setDirection] = useState('1');
    const switchTab = (tab) => {
      setDirection(tab === 'password'? 1: -1);
      setActiveTab(tab);
      setErrors({});
    }

    const [form, setForm] = useState({
      username: userInfo?.username || '',
      phone_number: userInfo?.phone_number || '',
      email: userInfo?.email || '',
    })

    useEffect(() => {
      if (isOpen && userInfo) {
        setForm({
            username: userInfo.username || '',
            phone_number: userInfo.phone_number || '',
            email: userInfo.email || '',
        });
      }
    }, [isOpen, userInfo]);

    const [formPwd, setFormPwd] = useState({
      current_password: '',
      new_password: '',
    })

    const [errors, setErrors] = useState({});

    const validateErrorsPwd = () => {
      const newErrors = {};

      if (!formPwd.current_password.trim()) newErrors.current_password = "Current password is required";
      if (!formPwd.new_password.trim()) newErrors.new_password = "New password is required";

      if (formPwd.new_password && formPwd.new_password.length < 6) {
        newErrors.new_password = "New password must be at least 6 characters";
      }
      if (formPwd.current_password && formPwd.current_password.length < 6) {
        newErrors.current_password = "Current password must be at least 6 characters";
      }
      return newErrors;
    }

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

    const handleChangePwd = (e) => {
      setFormPwd({
        ...formPwd,
        [e.target.name]: e.target.value,
      });
    };

    const handleChangeProfile = (e) => {
      
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });      
    };

    async function handleSubmitProfile(e) {
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
        onSaved?.(data);
        toast.success('Profile updated successfully');
        setForm({
          username: data.username || '',
          phone_number: data.phone_number || '',
          email: data.email || '',
        });
        onClose();
      } catch (error) {
        toast.error('Failed to update profile');
      }
    }

    const handleSubmitPwd = async (e) => {
      e.preventDefault();

      const newErrors = validateErrorsPwd();
      if (Object.keys(newErrors).length > 0) {
        console.log("Validation errors:", newErrors);
        setErrors(newErrors);
        return;
      }
      const token = localStorage.getItem('token');

      const body = {
        current_password: formPwd.current_password,
        new_password: formPwd.new_password,
      };

      try {
        setErrors({});
        const response = await fetch ("http://localhost:8000/users/me/change_password", {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });

        if(!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to change password');
          toast.error(errorData.detail || 'Failed to change password');
        }

        const data = await response.json();
        onSaved?.(data);
        toast.success('Password changed successfully');
        setFormPwd({
          current_password: '',
          new_password: '',
        });
        onClose();
      } catch (error) {
        toast.error(error.message);
      }
    }

    return (
    <motion.div 
      className='edit-profile-modal-overlay' 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className='edit-profile-modal' 
        onClick={(event) => event.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="modal-name">
            <h3 className='edit-profile-title'>Edit profile</h3>
        </div>
        <div className="modal-tabs">
            <button
              className={`modal-tab ${activeTab === 'profile' ? 'modal-tab-active' : ''}`}
              onClick={() => switchTab('profile')}
            >
                Profile
            </button>
            <button
              className={`modal-tab ${activeTab === 'password' ? 'modal-tab-active' : ''}`}
              onClick={() => switchTab('password')}
            >
                Change password
            </button>
        </div>

        <AnimatePresence mode='wait' custom={direction}>

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              custom={direction}
              variants={{
                  initial: (dir) => ({ x: dir * -60, opacity: 0 }),
                  animate: { x: 0, opacity: 1 },
                  exit: (dir) => ({ x: dir * 60, opacity: 0 }),
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}
            >
              <div className="inputs">
                <div className="form-row">
                    <label className="form-label" htmlFor="username">Username</label>
                    <input
                      id="username"
                      name="username"
                      className="form-input"
                      type="text"
                      value={form.username}
                      onChange={handleChangeProfile}
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
                        onChange={handleChangeProfile}
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
                        onChange={handleChangeProfile}
                    />
                </div> 
            </div>
            <div className='edit-profile-actions'>
              <button type='button' className='edit-profile-btn-secondary' onClick={onClose}>Cancel</button>
              <button
                type='button'
                className='edit-profile-btn-primary'
                onClick={handleSubmitProfile}
              >
                Save
              </button>
            </div>
            </motion.div>
        )}

        {activeTab === 'password' && (
          <motion.div
            key="password"
            custom={direction}
            variants={{
                initial: (dir) => ({ x: dir * -60, opacity: 0 }),
                animate: { x: 0, opacity: 1 },
                exit: (dir) => ({ x: dir * 60, opacity: 0 }),
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 16 }}
          >
            <div className="inputs">
              <div className="form-row">
                  <label className="form-label" htmlFor="password-current">Current password</label>
                  <input
                    id="password-current"
                    className="form-input"
                    type="password"
                    name="current_password"
                    value={formPwd.current_password}
                    onChange={handleChangePwd}
                  />
              </div>

              <div className="form-row">
                  <label className="form-label" htmlFor="password-new">New password</label>
                  <input
                    id="password-new"
                    className="form-input"
                    type="password"
                    name="new_password"
                    value={formPwd.new_password}
                    onChange={handleChangePwd}
                  />
              </div>
            </div>

            <div className="edit-profile-actions">
              <button className='edit-profile-btn-secondary' onClick={onClose}>Cancel</button>
              <button className='edit-profile-btn-primary' onClick={handleSubmitPwd}>Change</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      </motion.div>
    </motion.div>
  )
}

export default EditUserProfileModal
