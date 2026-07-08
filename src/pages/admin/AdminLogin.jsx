import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import './AdminLogin.css';

function AdminLogin() {
  const { login, isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin/categories" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/admin/categories');
    } catch (err) {
      setError(err.errors?.email?.[0] || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__form" onSubmit={handleSubmit}>
        <h1 className="admin-login__title">Admin Login</h1>
        <p className="admin-login__subtitle">Gourmet Haven staff access</p>

        {error && <p className="admin-login__error">{error}</p>}

        <label className="admin-login__field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@gourmethaven.test"
            required
          />
        </label>

        <label className="admin-login__field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button type="submit" className="admin-login__submit" disabled={submitting}>
          {submitting ? 'Signing In…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
