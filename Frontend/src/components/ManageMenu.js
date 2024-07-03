import React, { useState, useEffect } from 'react';
import './ManageMenu.css';
import AddMenuModal from './AddMenuModal';
import EditMenuModal from './EditMenuModal';

function ManageMenu() {
    const [menus, setMenus] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentMenu, setCurrentMenu] = useState(null);

    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await fetch('http://localhost:5000/menu', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message || 'Failed to fetch menus');
            }

            const menuData = await response.json();
            console.log('Fetched menus:', menuData); 
            setMenus(menuData);
        } catch (error) {
            console.error('Error fetching menus:', error);
        }
    };

    const handleAddMenu = (formData) => {
        console.log('Adding menu:', formData);
        setIsAddModalOpen(false);
        fetchMenus(); 
    };

    const handleEditMenu = (formData) => {
        console.log('Editing menu:', formData);
        setIsEditModalOpen(false);
        fetchMenus();
    };

    const openEditModal = (menu) => {
      setCurrentMenu(menu);
      setIsEditModalOpen(true);
  };

    const deleteMenu = async (menuId) => {
        try {
            const response = await fetch(`http://localhost:5000/menu/${menuId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete menu');
            }

            console.log('Menu deleted successfully');
            fetchMenus(); 
        } catch (error) {
            console.error('Error deleting menu:', error);
        }
    };

    return (
        <div className="manage-menu">
            <div className="header">
                <h2>Manage Menu</h2>
                <button className="add-button" onClick={() => setIsAddModalOpen(true)}>ADD</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Menu Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Image</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {menus.map(menu => (
                        <tr key={menu.id_menu}>
                            <td>{menu.id_menu}</td>
                            <td>{menu.nama_menu}</td>
                            <td>{menu.deskripsi}</td>
                            <td>Rp. {menu.harga}</td>
                            <td>{menu.kategori_id}</td>
                            <td>{console.log(menu.gambar)} 
                              <img src={menu.gambar} alt={menu.nama_menu} />
                            </td>
                            <td>
                                <div className='status'>{menu.status}</div>
                            </td>
                            <td>
                                <button className="btn-edit" onClick={() => openEditModal(menu)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn-trash" onClick={() => deleteMenu(menu.id_menu)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isAddModalOpen && <AddMenuModal onClose={() => setIsAddModalOpen(false)} onSave={handleAddMenu} />}
            {isEditModalOpen && <EditMenuModal menu={currentMenu} onClose={() => setIsEditModalOpen(false)} onSave={handleEditMenu} />}
        </div>
    );
}

export default ManageMenu;
