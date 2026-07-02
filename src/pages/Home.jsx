import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import MenuItemCard from '../components/MenuItemCard';
import { fetchMenuItems } from '../services/api';
import './Home.css';

const FEATURED_NAMES = ['Truffle Ribeye', 'Handmade Pappardelle', 'Midnight Ganache'];

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchMenuItems()
      .then((data) => {
        if (!isMounted) return;
        const picks = data.filter((item) => FEATURED_NAMES.includes(item.name));
        setFeatured(picks.length > 0 ? picks : data.slice(0, 3));
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

  return (
    <div className="home">
      <Hero />

      <section className="home__dishes">
        <div className="home__dishes-heading">
          <h2 className="home__dishes-title">Chef&apos;s Signature Dishes</h2>
          <div className="home__dishes-divider" />
        </div>

        {loading && <p className="home__dishes-status">Loading…</p>}
        {error && (
          <p className="home__dishes-status home__dishes-status--error">
            Couldn&apos;t load dishes: {error}
          </p>
        )}

        {!loading && !error && (
          <div className="home__dishes-grid">
            {featured.map((item) => (
              <MenuItemCard item={item} key={item.id} />
            ))}
          </div>
        )}

        <div className="home__dishes-footer">
          <Link to="/menu" className="home__dishes-link">
            View Full Menu →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
