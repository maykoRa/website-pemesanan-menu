import React, { useState } from 'react';
import './ManageUsers.css';  // Assuming shared styling

function AddUserModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        nama_pengguna: '',
        username: '',
        email: '',
        kata_sandi: '',
        peran: '',
        profile_picture: null
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData(prevState => ({
            ...prevState,
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
            formDataToSend.append('profile_picture', formData.profile_picture);

            const response = await fetch('http://localhost:5000/pengguna', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error('Failed to add user');
            }

            onSave(formData); 
            onClose(); 
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="text" name="nama_pengguna" placeholder="Nama Pengguna" value={formData.nama_pengguna} onChange={handleInputChange} required />
                        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleInputChange} required />
                    </div>
                    <div className="form-row">
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                        <input type="password" name="kata_sandi" placeholder="Password" value={formData.kata_sandi} onChange={handleInputChange} required />
                    </div>
                    <div className="form-row">
                    <select name="peran" value={formData.peran} onChange={handleInputChange} required>
                            <option value="">Select Role</option>
                            <option value="customer">Customer</option>
                            <option value="cashier">Cashier</option>
                            <option value="kitchen">Kitchen</option>
                        </select>
                        <input type="file" name="profile_picture" onChange={handleFileChange} />
                    </div>
                    <div className="form-row">
                        <button type="button" className="btn-close" onClick={onClose}>Close</button>
                        <button type="submit" className="btn-add">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddUserModal;
