import React, { useState, useEffect } from 'react';
import './ManageUsers.css'; 

const EditMenuModal = ({ menu, onClose, onSave }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (menu) {
            setFormData({ ...menu });
        }
    }, [menu]);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/kategori', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }

                const categoryData = await response.json();
                setCategories(categoryData);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData(prev => ({
            ...prev,
            gambar: file
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('nama_menu', formData.nama_menu);
            formDataToSend.append('deskripsi', formData.deskripsi);
            formDataToSend.append('harga', formData.harga);
            formDataToSend.append('kategori_id', formData.kategori_id);
            formDataToSend.append('status', formData.status);
            formDataToSend.append('gambar', formData.gambar);
    
            const response = await fetch(`http://localhost:5000/menu/${formData.id_menu}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    
                },
                body: formDataToSend
            });
    
            if (!response.ok) {
                throw new Error('Failed to update menu');
            }
    
            const responseData = await response.json();
            console.log('Menu updated successfully:', responseData.message);
            onSave(responseData);
            onClose(); 
        } catch (error) {
            console.error('Error updating menu:', error);
        }
    };

    if (!menu) {
        return null; 
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Menu</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="text" name="nama_menu" value={formData.nama_menu || ''} onChange={handleChange} required />
                        <input type="text" name="harga" value={formData.harga || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <input type="text" name="deskripsi" value={formData.deskripsi || ''} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                        <select name="kategori_id" value={formData.kategori_id || ''} onChange={handleChange} required>
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id_kategori} value={category.id_kategori}>{category.nama_kategori}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <select name="status" value={formData.status || ''} onChange={handleChange} required>
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="seasonal">Seasonal</option>
                        </select>
                        <input type="file" name="gambar" onChange={handleFileChange} />
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

export default EditMenuModal;

