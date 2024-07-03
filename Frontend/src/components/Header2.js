import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header2() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/cashier', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('User profile not found');
        }
        const profileData = await response.json();
        console.log('Fetched user profile:', profileData); 
        setUserProfile(profileData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <header className="home-header">
      <div className="logo">
        <Link to="/cashier" className="nav-link">
          <img src="/assets/logoCashier.png" alt="Cafe Logo" />
          <span className="cafe-name">Cashier Dashboard</span>
        </Link>
      </div>
      <nav className="home-nav">
        <Link to="/cashier/orders" className="nav-link">Orders</Link>
        {userProfile ? (
          <Link to="/user/profile" className='nav-profile'>
            <img src={userProfile.profile_picture || '/assets/def.jpg'} alt="User Profile" />
            {userProfile.username}
          </Link>
        ) : (
          <Link to="/user/profile" className='nav-profile'>
            <img src="/assets/def.jpg" alt="User Profile" />
            User
          </Link>
        )}
        <div onClick={toggleDropdown}>
          <i className="fas fa-chevron-down"></i>
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <Link to="/cashier" className="dropdown-item">Home</Link>
            <Link to="/user/profile" className="dropdown-item">Profile</Link>
            <div className="dropdown-item" onClick={handleLogout}>Logout</div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header2;
