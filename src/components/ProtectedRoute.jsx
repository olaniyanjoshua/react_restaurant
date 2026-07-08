import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdmin();

  if (loading) {
    return <div className="admin-route-loading">Loading…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
