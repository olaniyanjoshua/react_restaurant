import React from 'react';
import './SignatureDishes.css';

const DISHES = [
  {
    name: 'Truffle Ribeye',
    description: 'Aged beef with truffle butter reduction.',
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Handmade Pappardelle',
    description: 'Slow-cooked wild boar ragu.',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Midnight Ganache',
    description: '70% dark chocolate with sea salt.',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f296?auto=format&fit=crop&w=600&q=80',
  },
];

function SignatureDishes() {
  return (
    <section id="menu" className="dishes">
      <div className="dishes__heading">
        <h2 className="dishes__title">Chef&apos;s Signature Dishes</h2>
        <div className="dishes__divider" />
      </div>

      <div className="dishes__grid">
        {DISHES.map((dish) => (
          <div className="dish-card" key={dish.name}>
            <div className="dish-card__image-wrap">
              <img src={dish.image} alt={dish.name} className="dish-card__image" />
            </div>
            <h3 className="dish-card__name">{dish.name}</h3>
            <p className="dish-card__description">{dish.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SignatureDishes;
