import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <h2 className="footer__title">Gourmet Haven</h2>

      <nav className="footer__links">
        <Link to="/menu">Menu</Link>
        <Link to="/book-table">Reservations</Link>
        <Link to="/cart">Cart</Link>
      </nav>

      <p>123 Dining Street, Flavor City</p>
      <p className="footer__phone">+1 (555) 012-3456</p>
      <p className="footer__copyright">© 2026 Gourmet Haven. All Rights Reserved.</p>
    </footer>
  );
}

export default Footer;
