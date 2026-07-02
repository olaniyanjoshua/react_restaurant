import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../context/CartContext';
import './Cart.css';

function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-page cart-page--empty">
        <h1 className="cart-page__title">Your Cart</h1>
        <p className="cart-page__empty-text">
          Your cart is empty. Take a look at the menu to add something delicious.
        </p>
        <Link to="/menu" className="cart-page__browse-link">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">Your Cart</h1>

      <div className="cart-page__layout">
        <ul className="cart-page__list">
          {items.map((item) => (
            <li className="cart-line" key={item.id}>
              <img src={item.image} alt={item.name} className="cart-line__image" />

              <div className="cart-line__info">
                <h3 className="cart-line__name">{item.name}</h3>
                <span className="cart-line__price">${item.price.toFixed(2)} each</span>
              </div>

              <div className="cart-line__stepper">
                <button
                  type="button"
                  aria-label={`Remove one ${item.name}`}
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  aria-label={`Add one more ${item.name}`}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <span className="cart-line__total">
                ${(item.price * item.quantity).toFixed(2)}
              </span>

              <button
                type="button"
                className="cart-line__remove"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Remove ${item.name} from cart`}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <div className="cart-page__summary">
          <OrderSummary items={items} subtotal={subtotal}>
            <button
              type="button"
              className="cart-page__checkout"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </OrderSummary>
          <Link to="/menu" className="cart-page__continue-link">
            ← Continue Browsing
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
