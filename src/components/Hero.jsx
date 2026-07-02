import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <header className="hero">
      <img
        src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=80"
        className="hero__image"
        alt="Fine Dining"
      />
      <div className="hero__content">
        <span className="hero__eyebrow">Experience Excellence</span>
        <h1 className="hero__title">Culinary Art</h1>
        <p className="hero__subtitle">
          Where traditional flavors meet modern innovation. A dining experience
          crafted for your senses.
        </p>
        <div className="hero__actions">
          <Link to="/menu" className="hero__cta">
            Order Now
          </Link>
          <Link to="/book-table" className="hero__cta hero__cta--outline">
            Book a Table
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Hero;
