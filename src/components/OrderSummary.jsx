import React from 'react';
import './OrderSummary.css';

const TAX_RATE = 0.08;

function OrderSummary({ items, subtotal, children }) {
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Order Summary</h3>

      <ul className="order-summary__list">
        {items.map((item) => (
          <li className="order-summary__row" key={item.id}>
            <span>
              {item.name} <span className="order-summary__qty">x{item.quantity}</span>
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="order-summary__totals">
        <div className="order-summary__row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="order-summary__row">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="order-summary__row order-summary__row--total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {children}
    </div>
  );
}

export default OrderSummary;
