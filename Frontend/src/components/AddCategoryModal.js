import React from 'react';
import './ManageCategory.css';

function AddCategoryModal({ onClose, onSave }) {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newCategory = {
            nama_kategori: formData.get('categoryName'),
            deskripsi: formData.get('description')
        };

        try {
            const response = await fetch('http://localhost:5000/kategori', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCategory)
            });

            if (!response.ok) {
                throw new Error('Failed to add category');
            }

            const responseData = await response.json();
            console.log('Category added successfully:', responseData.message);
            onSave(responseData); 
            onClose();
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>ADD CATEGORY</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="text" name="categoryName" placeholder="Category Name" className="input-full" required />
                    </div>
                    <div className="form-row">
                        <input name="description" placeholder="Description" className="input-full" required/>
                    </div>
                    <div className="form-row">
                        <button type="button" className="btn btn-close" onClick={onClose}>Close</button>
                        <button type="submit" className="btn btn-add">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddCategoryModal;
