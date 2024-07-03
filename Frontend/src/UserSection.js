import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import OrdersPage from './components/OrdersPage';
import ProfilePage from './components/ProfilePage';

function UserSection() {
  const userRole = 'customer';

  if (userRole !== 'customer') {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default UserSection;
