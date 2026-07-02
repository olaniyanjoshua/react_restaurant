import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './OrderConfirmation.css';

function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="confirmation-page confirmation-page--empty">
        <h1>No order found</h1>
        <p>Looks like you navigated here directly. Head back to the menu to place an order.</p>
        <Link to="/menu" className="confirmation-page__link">
          Browse Menu
        </Link>
      </div>
    );
  }

  const tax = order.subtotal * 0.08;
  const total = order.subtotal + tax;

  return (
    <div className="confirmation-page">
      <div className="confirmation-page__badge">✓</div>
      <h1 className="confirmation-page__title">Thank you, {order.customer.name.split(' ')[0]}!</h1>
      <p className="confirmation-page__subtitle">
        Your order <strong>{order.orderNumber}</strong> has been received.
      </p>

      <div className="confirmation-card">
        <div className="confirmation-card__section">
          <h2>Order Details</h2>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} x{item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="confirmation-card__totals">
            <div>
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="confirmation-card__total-row">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="confirmation-card__section">
          <h2>Fulfillment</h2>
          <p>{order.customer.fulfillment}{order.customer.fulfillment === 'Delivery' ? ` — ${order.customer.address}` : ''}</p>
          <p>Preferred time: {order.customer.time || 'Not specified'}</p>
          <p>Payment: {order.customer.payment}</p>
          {order.customer.notes && <p>Notes: {order.customer.notes}</p>}
        </div>
      </div>

      <Link to="/menu" className="confirmation-page__link">
        ← Back to Menu
      </Link>
    </div>
  );
}

export default OrderConfirmation;
