import React from 'react';
import './MenuCategory.css';

function MenuCategory() {
  return (
    <div className="menu-category">
      <h2>MENU CATEGORY</h2>
      <div className="categories">
        <a href="#">Appetizers and Starters</a>
        <a href="#">Cold Beverages</a>
        <a href="#">Main Courses</a>
        <a href="#">Desserts</a>
        <a href="#">Coffee</a>
        <a href="#">Healthy Options</a>
      </div>
    </div>
  );
}

export default MenuCategory;
