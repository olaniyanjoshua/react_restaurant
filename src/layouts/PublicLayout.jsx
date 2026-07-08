import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PublicLayout() {
  return (
    <div className="app">
      <Navbar />
      <main className="app__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
