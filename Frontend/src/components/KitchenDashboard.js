import React from 'react';
import Header from './Header3';
import './KitchenDashboard.css';

function KitchenDashboard() {
  const orders = [
    { id: 1, orderID: '24052210139', orderDate: '2024-05-22 10:21:39', menuName: 'Coffee', quantity: 4, status: 'Masuk ke Dapur' },
    { id: 2, orderID: '24052210139', orderDate: '2024-05-22 10:21:39', menuName: 'Coffee', quantity: 4, status: '' },
  ];

  return (
    <div className='kitchen-page'>
      <Header title="Kitchen Dashboard" />
      <h2>Manage Kitchen</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order_ID</th>
            <th>Order Date</th>
            <th>Menu Name</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.orderID}</td>
              <td>{order.orderDate}</td>
              <td>{order.menuName}</td>
              <td>{order.quantity}</td>
              <td>
                <div className={`status ${order.status ? 'masuk-ke-dapur' : 'pending'}`}>
              {order.status || !order.status }
              </div>
            </td>
              <td>
                <button className="btn-accept" disabled={order.status === 'Masuk ke Dapur'} style={{ backgroundColor: order.status ? '#ACACAC' : '#418DFF' }}>ACCEPT</button>
                <button className="btn-serve" disabled={!order.status } style={{ backgroundColor: order.status ? '#4AEB30' : '#ACACAC' }}>SERVE</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KitchenDashboard;