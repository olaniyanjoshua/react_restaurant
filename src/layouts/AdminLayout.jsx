import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import './AdminLayout.css';

function AdminLayout() {
  const { admin, logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `admin-layout__link${isActive ? ' admin-layout__link--active' : ''}`;

  return (
    <div className="admin-layout">
      <header className="admin-layout__header">
        <div className="admin-layout__brand">Gourmet Haven — Admin</div>

        <nav className="admin-layout__nav">
          <NavLink to="/admin/categories" className={linkClass}>
            Categories
          </NavLink>
          <NavLink to="/admin/menu-items" className={linkClass}>
            Menu Items
          </NavLink>
        </nav>

        <div className="admin-layout__account">
          {admin && <span className="admin-layout__name">{admin.name}</span>}
          <button type="button" className="admin-layout__logout" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <main className="admin-layout__main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
