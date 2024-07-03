import React, { useState, useEffect } from 'react';
import './MenuList.css';
import MenuItem from './MenuItem';

function MenuList({ onAddToOrder }) {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/menu', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        const data = await response.json();
        setMenuItems(data.filter(item => item.status === 'active'));
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="menu-list">
      <h2>MENU LISTS</h2>
      <div className="menu-items">
        {menuItems.map(item => (
          <MenuItem 
            key={item.id_menu} 
            id={item.id_menu}
            name={item.nama_menu}
            description={item.deskripsi}
            price={item.harga}
            image={item.gambar}
            onOrder={menuItem => onAddToOrder(menuItem)} 
          />
        ))}
      </div>
    </div>
  );
}

export default MenuList;
