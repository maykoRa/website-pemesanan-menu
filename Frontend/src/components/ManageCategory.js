import React, { useState, useEffect } from 'react';
import './ManageCategory.css';
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';

function ManageCategory() {
    const [categories, setCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

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

    const handleAddCategory = (formData) => {
        console.log('Adding category:', formData);
        setIsAddModalOpen(false);
        fetchCategories(); 
    };

    const handleEditCategory = (formData) => {
        console.log('Editing category:', formData);
        setIsEditModalOpen(false);
        fetchCategories();
    };

    const openEditModal = (category) => {
        setCurrentCategory(category);
        setIsEditModalOpen(true);
    };

    const deleteCategory = async (categoryId) => {
        try {
            const response = await fetch(`http://localhost:5000/kategori/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            console.log('Category deleted successfully');
            fetchCategories(); // Refresh categories after deletion
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <div className="manage-category">
            <div className="header">
                <h2>Manage Category</h2>
                <button className="add-button" onClick={() => setIsAddModalOpen(true)}>ADD</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id_kategori}>
                            <td>{category.id_kategori}</td>
                            <td>{category.nama_kategori}</td>
                            <td>{category.deskripsi}</td>
                            <td>
                                <button className="btn-edit" onClick={() => openEditModal(category)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn-trash" onClick={() => deleteCategory(category.id_kategori)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isAddModalOpen && <AddCategoryModal onClose={() => setIsAddModalOpen(false)} onSave={handleAddCategory} />}
            {isEditModalOpen && <EditCategoryModal category={currentCategory} onClose={() => setIsEditModalOpen(false)} onSave={handleEditCategory} />}
        </div>
    );
}

export default ManageCategory;
