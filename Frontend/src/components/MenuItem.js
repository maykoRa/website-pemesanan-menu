import React from 'react';
import './MenuItem.css';

function MenuItem({ id, name, description, price, image, onOrder }) {
  return (
    <div className="menu-item">
      <img src={image} alt={name} />
      <h3>{name}</h3>
      <p className='desc'>{description}</p>
      <p>{price}</p>
      <button onClick={() => onOrder({ id, name, description, price, image })}>ORDER</button>
    </div>
  );
}

export default MenuItem;
