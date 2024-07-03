import React from 'react';
import Header from './Header';
import MenuCategory from './MenuCategory';
import MenuList from './MenuList';
import './HomePage.css';
import logoKopiBanner from '../assets/logoKopiBanner.png';

function HomePage() {
  return (
    <div className="home-page">
      <Header />
      <div className="banner">
        <div className="banner-content">
          <div className="banner-text">
            <h1>Start Your Day With</h1>
            <h1 className="highlight">COFFEE</h1>
          </div>
          <img src={logoKopiBanner} alt="Coffee Banner" className="banner-logo" />
        </div>
      </div>
      <MenuCategory />
      <MenuList />
    </div>
  );
}

export default HomePage;
