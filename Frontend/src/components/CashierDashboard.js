import React, { useState, useEffect } from 'react';
import Header from './Header2';
import './CashierDashboard.css';

function CashierDashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/pesanan', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className='cashier-page'>
      <Header />
      <h2>Manage Cashier</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order_ID</th>
            <th>Table</th>
            <th>Total</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id_pesanan}</td>
              <td>{order.id_pengguna}</td>
              <td>{order.id_meja}</td>
              <td>{`Rp ${order.total_harga.toLocaleString()}`}</td>
              <td>
                <div className={`status ${order.status_pesanan === 'Dibayar' ? 'dibayar' : 'pending'}`}>
                  {order.status_pesanan}
                </div>
              </td>
              <td>{order.tanggal_pesanan}</td>
              <td>
                <button className="btn-eye"><i className="fas fa-eye"></i></button>
                <button className={`btn-edit ${order.status_pesanan === '' ? 'disabled' : ''}`} disabled={order.status_pesanan === 'Belum Dibayar'}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className={`btn-trash ${order.status_pesanan === '' ? 'disabled' : ''}`} disabled={order.status_pesanan === 'Belum Dibayar'}>
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CashierDashboard;
