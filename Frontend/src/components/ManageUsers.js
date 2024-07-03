import React, { useState, useEffect } from 'react';
import './ManageUsers.css';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';

function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);


        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/pengguna', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const userData = await response.json();
                const filteredUsers = userData.filter(user => user.peran !== 'admin');
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };


    const handleAddUser = (formData) => {
        console.log('Adding user:', formData);
        setIsAddModalOpen(false);
        fetchUsers();
    };

    const handleEditUser = (formData) => {
        console.log('Editing user:', formData);
        setIsEditModalOpen(false);
        fetchUsers();
    };

    const openEditModal = (user) => {
        setCurrentUser(user);
        setIsEditModalOpen(true);
    };


    const deleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/pengguna/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            setUsers(users.filter(user => user.id_pengguna !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div className="manage-users">
            <div className="header">
                <h2>Manage Users</h2>
                <button className="add-button" onClick={() => setIsAddModalOpen(true)}>ADD</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fullname</th>
                        <th>Username</th>
                        <th>Email Address</th>
                        <th>Password</th>
                        <th>Role</th>
                        <th>Profile</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id_pengguna}>
                            <td>{user.id_pengguna}</td>
                            <td>{user.nama_pengguna}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.kata_sandi}</td>
                            <td>{user.peran}</td>
                            <td><img src={user.profile_picture || '/assets/def.jpg'} alt="Profile" /></td>
                            <td>
                                <button className="btn-edit" onClick={() => openEditModal(user)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn-trash" onClick={() => deleteUser(user.id_pengguna)}>
                                    <i className="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isAddModalOpen && <AddUserModal onClose={() => setIsAddModalOpen(false)} onSave={handleAddUser} />}
            {isEditModalOpen && <EditUserModal user={currentUser} onClose={() => setIsEditModalOpen(false)} onSave={handleEditUser} />}
        </div>
    );
}

export default ManageUsers;
