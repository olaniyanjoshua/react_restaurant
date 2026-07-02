import React from 'react';
import { useCart } from '../context/CartContext';
import './MenuItemCard.css';

function MenuItemCard({ item }) {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="menu-item">
      <div className="menu-item__image-wrap">
        <img src={item.image} alt={item.name} className="menu-item__image" />
      </div>

      <div className="menu-item__body">
        <div className="menu-item__header">
          <h3 className="menu-item__name">{item.name}</h3>
          <span className="menu-item__price">${item.price.toFixed(2)}</span>
        </div>
        <p className="menu-item__description">{item.description}</p>

        {quantity === 0 ? (
          <button
            type="button"
            className="menu-item__add"
            onClick={() => addToCart(item)}
          >
            Add to Cart
          </button>
        ) : (
          <div className="menu-item__stepper">
            <button
              type="button"
              aria-label={`Remove one ${item.name}`}
              onClick={() => updateQuantity(item.id, quantity - 1)}
            >
              −
            </button>
            <span className="menu-item__stepper-qty">{quantity}</span>
            <button
              type="button"
              aria-label={`Add one more ${item.name}`}
              onClick={() => updateQuantity(item.id, quantity + 1)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuItemCard;
