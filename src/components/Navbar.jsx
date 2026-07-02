import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `navbar__link${isActive ? ' navbar__link--active' : ''}`;

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar__logo">
        Gourmet
      </NavLink>

      <div className="navbar__links">
        <NavLink to="/menu" className={linkClass}>
          Menu
        </NavLink>
        <NavLink to="/book-table" className={linkClass}>
          Reservations
        </NavLink>
        <NavLink to="/cart" className="navbar__cart" aria-label="View cart">
          <CartIcon />
          {cartCount > 0 && (
            <span className="navbar__cart-badge">{cartCount}</span>
          )}
        </NavLink>
      </div>

      <button className="navbar__cta" onClick={() => navigate('/book-table')}>
        Book Table
      </button>
    </nav>
  );
}

export default Navbar;
