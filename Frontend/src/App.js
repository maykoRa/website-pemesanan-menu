import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import UserSection from './UserSection';
import CashierDashboard from './components/CashierDashboard';
import KitchenDashboard from './components/KitchenDashboard';
import AdminSection from './AdminSection';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="user/*" element={<UserSection />} />
          <Route path="/cashier" element={<CashierDashboard />} />
          <Route path="/kitchen" element={<KitchenDashboard />} />
          <Route path="/admin/*" element={<AdminSection />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
