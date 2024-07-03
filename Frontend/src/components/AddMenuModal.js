import React, { useState, useEffect } from 'react';
import './ManageUsers.css'; // Assuming shared styling

function AddMenuModal({ onClose, onSave }) {
    const [formData, setFormData] = useState({
        menuName: '',
        price: '',
        description: '',
        category: '',
        status: '',
        image: null
    });

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
            image: file
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('nama_menu', formData.menuName);
            formDataToSend.append('deskripsi', formData.description);
            formDataToSend.append('harga', formData.price);
            formDataToSend.append('kategori_id', formData.category);
            formDataToSend.append('status', formData.status);
            formDataToSend.append('gambar', formData.image);

            const response = await fetch('http://localhost:5000/menu', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: formDataToSend
            });

            if (!response.ok) {
                throw new Error('Failed to add menu');
            }

            onSave(formData); 
            onClose(); 
        } catch (error) {
            console.error('Error adding menu:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Add Menu Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="text" name="menuName" placeholder="Menu Name" value={formData.menuName} onChange={handleInputChange} required />
                        <input type="text" name="price" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
                    </div>
                    <div className="form-row">
                        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
                    </div>
                    <div className="form-row">
                        <select name="category" value={formData.category} onChange={handleInputChange} required>
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id_kategori} value={category.id_kategori}>{category.nama_kategori}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row">
                        <select name="status" value={formData.status} onChange={handleInputChange} required>
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="seasonal">Seasonal</option>
                        </select>
                        <input type="file" name="image" onChange={handleFileChange} required />
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

export default AddMenuModal;
