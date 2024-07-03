import React, { useState } from 'react';
import './OrdersPage.css';
import Header from './Header';
import MenuList from './MenuList'; 
import './MenuItem.css'; 

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const handleAddToOrder = (menuItem) => {
    setOrders(prevOrders => {
      const existingOrder = prevOrders.find(order => order.id === menuItem.id);
      if (existingOrder) {
        return prevOrders.map(order =>
          order.id === menuItem.id
            ? { ...order, quantity: order.quantity + 1 }
            : order
        );
      }
      return [...prevOrders, { ...menuItem, quantity: 1 }];
    });
  };

  const handleQuantityChange = (id, delta) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, quantity: Math.max(1, order.quantity + delta) } : order
    ));
  };

  const handleRemove = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  const total = orders.reduce((sum, order) => sum + order.price * order.quantity, 0);

  return (
    <div className="orders-page">
      <Header />
      <MenuList onAddToOrder={handleAddToOrder} /> {}
      <div className="ordersPage">
        <h2 className='orderLists'>ORDER LISTS</h2>
        <table>
          <thead>
            <tr>
              <th>Items</th>
              <th>Quantity</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className='trper'>
                <td>
                  <div className="order-item">
                    <img src={order.image} alt={order.name} />
                    <div className="order-text">
                      <h3>{order.name}</h3>
                      <p>{order.description}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <button onClick={() => handleQuantityChange(order.id, -1)}>-</button>
                  <span className='quantity'>{order.quantity}</span>
                  <button onClick={() => handleQuantityChange(order.id, 1)}>+</button>
                </td>
                <td>Rp {order.price.toLocaleString()}</td>
                <td>
                  <button className='buttonRemove' onClick={() => handleRemove(order.id)}>X</button>
                </td>
              </tr>
            ))}
            <tr className='trorder'>
              <td></td>
              <td><h3>Total</h3></td>
              <td><p>Rp {total.toLocaleString()}</p></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div>
          <button className="confirm-button">CONFIRM</button>
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;
