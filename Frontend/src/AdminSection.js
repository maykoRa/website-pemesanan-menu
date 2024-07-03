import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import ManageUsers from './components/ManageUsers';
import ManageMenu from './components/ManageMenu';
import ManageCategory from './components/ManageCategory';
import Reports from './components/Reports';
import './AdminSection.css';
import ReportDetails from './components/ReportDetails';

function AdminSection() {
  let location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <div className="header">
        <Link to={`/`}>
          <button class="logout-button" onClick={handleLogout}>
            <i class="fa fa-sign-out-alt"></i> Logout
          </button>
        </Link>
      </div>
      <div className="sidebar">
        <h1>Admin Dashboard</h1>
        <ul>
          <li>
            <Link to="/admin/users" className={location.pathname === "/admin/users" ? "active" : ""}>
              <i className="fas fa-users"></i> Manage Users
            </Link>
          </li>
          <li>
            <Link to="/admin/menu" className={location.pathname === "/admin/menu" ? "active" : ""}>
              <i className="fas fa-utensils"></i> Manage Menu
            </Link>
          </li>
          <li>
            <Link to="/admin/category" className={location.pathname === "/admin/category" ? "active" : ""}>
              <i className="fas fa-tags"></i> Manage Category
            </Link>
          </li>
          <li>
            <Link to="/admin/reports" className={location.pathname === "/admin/reports" ? "active" : ""}>
              <i className="fas fa-chart-line"></i> Reports
            </Link>
          </li>
        </ul>
        <div className="admin-profile">
          <img src="/assets/pfp.png" alt="MasterAdmin" />
          <p>MasterAdmin</p>
        </div>
      </div>
      <div className="content">
        <Routes>
          <Route path="/users" element={<ManageUsers />} />
          <Route path="/menu" element={<ManageMenu />} />
          <Route path="/category" element={<ManageCategory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/report-details" element={<ReportDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminSection;
