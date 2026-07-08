import React, { createContext, useContext, useEffect, useState } from 'react';
import { adminLogin, adminLogout, fetchAdminMe } from '../services/api';

const AdminContext = createContext(null);

const TOKEN_KEY = 'gourmet_haven_admin_token';

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    fetchAdminMe(token)
      .then((user) => {
        if (isMounted) setAdmin(user);
      })
      .catch(() => {
        if (isMounted) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setAdmin(null);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const login = async (email, password) => {
    const data = await adminLogin({ email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setToken(data.token);
    setAdmin(data.user);
    return data;
  };

  const logout = async () => {
    try {
      if (token) await adminLogout(token);
    } catch {
      // ignore network errors on logout, clear local state regardless
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdmin(null);
  };

  const value = { token, admin, loading, isAuthenticated: Boolean(token), login, logout };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used inside an <AdminProvider>');
  }
  return ctx;
}
