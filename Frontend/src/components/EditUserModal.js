import React, { useState, useEffect } from 'react';
import './ManageUsers.css';

function EditUserModal({ user, onClose, onSave }) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({ ...user });
        }
    }, [user]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData(prev => ({
            ...prev,
            profile_picture: file  
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('nama_pengguna', formData.nama_pengguna);
            formDataToSend.append('username', formData.username);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('kata_sandi', formData.kata_sandi);
            formDataToSend.append('peran', formData.peran);
            
            if (formData.profile_picture instanceof File) {
                formDataToSend.append('profile_picture', formData.profile_picture);
            }

            const response = await fetch(`http://localhost:5000/pengguna/${formData.id_pengguna}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            const responseData = await response.json();
            console.log('User updated successfully:', responseData.message);
            onSave(responseData); 
            onClose(); 
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (!user) {
        return null; 
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>EDIT USER</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="text" name="nama_pengguna" value={formData.nama_pengguna} onChange={handleChange} required />
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <input type="password" name="kata_sandi" value={formData.kata_sandi} onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <select name="peran" value={formData.peran} onChange={handleChange} required>
                            <option value="user">Select Role</option>
                            <option value="customer">customer</option>
                            <option value="cashier">cashier</option>
                            <option value="kitchen">kitchen</option>
                        </select>
                        <input type="file" name="profile_picture" onChange={handleFileChange} />
                    </div>
                    <div className="form-row">
                        <button type="button" className="btn btn-close" onClick={onClose}>Close</button>
                        <button type="submit" className="btn btn-save">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
