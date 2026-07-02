import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import './Checkout.css';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  fulfillment: 'Pickup',
  address: '',
  time: '',
  payment: 'Card on file',
  notes: '',
};

function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/menu');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (form.fulfillment === 'Delivery' && !form.address.trim()) {
      next.address = 'Delivery address is required.';
    }
    if (!form.time) next.time = 'Please choose a preferred time.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const order = await createOrder({
        name: form.name,
        email: form.email,
        phone: form.phone,
        fulfillment: form.fulfillment,
        address: form.fulfillment === 'Delivery' ? form.address : null,
        preferred_time: form.time,
        payment_method: form.payment,
        notes: form.notes || null,
        items: items.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      navigate('/order-confirmation', { state: { order } });
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        Object.entries(err.errors).forEach(([key, messages]) => {
          const field = key === 'preferred_time' ? 'time' : key;
          fieldErrors[field] = messages[0];
        });
        setErrors(fieldErrors);
      } else {
        setSubmitError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>

      <div className="checkout-page__layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          {submitError && (
            <p className="checkout-form__submit-error">{submitError}</p>
          )}

          <div className="checkout-form__section">
            <h2 className="checkout-form__heading">Contact Details</h2>

            <label className="checkout-form__field">
              <span>Full Name</span>
              <input
                type="text"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Jane Doe"
              />
              {errors.name && <span className="checkout-form__error">{errors.name}</span>}
            </label>

            <label className="checkout-form__field">
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="jane@example.com"
              />
              {errors.email && <span className="checkout-form__error">{errors.email}</span>}
            </label>

            <label className="checkout-form__field">
              <span>Phone</span>
              <input
                type="tel"
                value={form.phone}
                onChange={handleChange('phone')}
                placeholder="+1 (555) 012-3456"
              />
              {errors.phone && <span className="checkout-form__error">{errors.phone}</span>}
            </label>
          </div>

          <div className="checkout-form__section">
            <h2 className="checkout-form__heading">Fulfillment</h2>

            <div className="checkout-form__radio-group">
              {['Pickup', 'Delivery'].map((option) => (
                <label className="checkout-form__radio" key={option}>
                  <input
                    type="radio"
                    name="fulfillment"
                    value={option}
                    checked={form.fulfillment === option}
                    onChange={handleChange('fulfillment')}
                  />
                  {option}
                </label>
              ))}
            </div>

            {form.fulfillment === 'Delivery' && (
              <label className="checkout-form__field">
                <span>Delivery Address</span>
                <input
                  type="text"
                  value={form.address}
                  onChange={handleChange('address')}
                  placeholder="123 Dining Street, Flavor City"
                />
                {errors.address && (
                  <span className="checkout-form__error">{errors.address}</span>
                )}
              </label>
            )}

            <label className="checkout-form__field">
              <span>Preferred Time</span>
              <input type="time" value={form.time} onChange={handleChange('time')} />
              {errors.time && <span className="checkout-form__error">{errors.time}</span>}
            </label>
          </div>

          <div className="checkout-form__section">
            <h2 className="checkout-form__heading">Payment</h2>
            <div className="checkout-form__radio-group">
              {['Card on file', 'Cash on pickup', 'Cash on delivery'].map((option) => (
                <label className="checkout-form__radio" key={option}>
                  <input
                    type="radio"
                    name="payment"
                    value={option}
                    checked={form.payment === option}
                    onChange={handleChange('payment')}
                  />
                  {option}
                </label>
              ))}
            </div>
            <p className="checkout-form__hint">
              Payment processing isn&apos;t connected yet — this selection is stored
              with the order for the backend to act on later.
            </p>
          </div>

          <div className="checkout-form__section">
            <h2 className="checkout-form__heading">Order Notes</h2>
            <label className="checkout-form__field">
              <span>Special requests (optional)</span>
              <textarea
                rows={3}
                value={form.notes}
                onChange={handleChange('notes')}
                placeholder="Allergies, seating preferences, etc."
              />
            </label>
          </div>

          <button type="submit" className="checkout-form__submit" disabled={submitting}>
            {submitting ? 'Placing Order…' : 'Place Order'}
          </button>
        </form>

        <div className="checkout-page__summary">
          <OrderSummary items={items} subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}

export default Checkout;
