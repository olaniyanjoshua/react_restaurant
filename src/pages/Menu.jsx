import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuItemCard from '../components/MenuItemCard';
import { useCart } from '../context/CartContext';
import { fetchMenuItems } from '../services/api';
import './Menu.css';

function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartCount, subtotal } = useCart();

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    fetchMenuItems()
      .then((data) => {
        if (isMounted) setMenuItems(data);
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => [...new Set(menuItems.map((item) => item.category))],
    [menuItems]
  );

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return menuItems;
    return menuItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, menuItems]);

  return (
    <div className="menu-page">
      <div className="menu-page__header">
        <div>
          <span className="menu-page__eyebrow">Our Menu</span>
          <h1 className="menu-page__title">Food & Drinks</h1>
        </div>

        {cartCount > 0 && (
          <Link to="/cart" className="menu-page__cart-link">
            View Cart ({cartCount}) · ${subtotal.toFixed(2)}
          </Link>
        )}
      </div>

      {loading && <p className="menu-page__status">Loading menu…</p>}

      {error && (
        <p className="menu-page__status menu-page__status--error">
          Couldn&apos;t load the menu: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="menu-page__tabs">
            <button
              type="button"
              className={`menu-page__tab${activeCategory === 'All' ? ' menu-page__tab--active' : ''}`}
              onClick={() => setActiveCategory('All')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={`menu-page__tab${activeCategory === category ? ' menu-page__tab--active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-page__grid">
            {filteredItems.map((item) => (
              <MenuItemCard item={item} key={item.id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Menu;
