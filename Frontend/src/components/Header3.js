import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header3() {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <header className="home-header">
            <div className="logo">
                <Link to="/kitchen" className="nav-link">
                    <img src="/assets/logoKitchen.png" alt="Cafe Logo" />
                    <span className="cafe-name">Kitchen Dashboard</span>
                </Link>
            </div>
            <nav className="home-nav">
                <Link to="/user/profile" className='nav-profile'>
                    <img src="/assets/pfpKitchen.png" alt="User Profile" />
                    User
                </Link>
                <div onClick={toggleDropdown}>
                     <i className="fas fa-chevron-down"></i>
                </div>
                {dropdownOpen && (
                    <div className="dropdown-menu">
                        <Link to="/kitchen" className="dropdown-item">Home</Link>
                        <Link to="/user/profile" className="dropdown-item">Profile</Link>
                        <Link to="/" className="dropdown-item">Logout</Link>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header3;
