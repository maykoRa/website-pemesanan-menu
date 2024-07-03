import React, { useState, useEffect } from 'react';
import './ManageCategory.css';

function EditCategoryModal({ category, onClose, onSave }) {
    const [formData, setFormData] = useState({ ...category });

    useEffect(() => {
        setFormData({ ...category });
    }, [category]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/kategori/${formData.id_kategori}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update category');
            }

            const responseData = await response.json();
            console.log('Category updated successfully:', responseData.message);
            onSave(responseData);
            onClose();
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>EDIT CATEGORY</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="text" name="nama_kategori" value={formData.nama_kategori} onChange={handleChange} className="input-full" required />
                    </div>
                    <div className="form-row">
                        <input name="deskripsi" value={formData.deskripsi} onChange={handleChange} className="input-full" required/>
                    </div>
                    <div className="form-row">
                        <button type="button" className="btn btn-close" onClick={onClose}>Close</button>
                        <button type="submit" className="btn btn-save">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditCategoryModal;
