import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createReservation } from '../services/api';
import './BookTable.css';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: '2',
  notes: '',
};

function BookTable() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.email.trim()) next.email = 'Email is required.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (!form.date) next.date = 'Please choose a date.';
    if (!form.time) next.time = 'Please choose a time.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const reservation = await createReservation({
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: form.date,
        time: form.time,
        guests: Number(form.guests),
        notes: form.notes || null,
      });

      setConfirmation(reservation);
    } catch (err) {
      if (err.errors) {
        const fieldErrors = {};
        Object.entries(err.errors).forEach(([key, messages]) => {
          fieldErrors[key] = messages[0];
        });
        setErrors(fieldErrors);
      } else {
        setSubmitError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setConfirmation(null);
    setSubmitError(null);
  };

  if (confirmation) {
    return (
      <div className="book-table-page">
        <div className="book-table-confirmation">
          <div className="book-table-confirmation__badge">✓</div>
          <h1>Reservation Confirmed</h1>
          <p>
            Confirmation number <strong>{confirmation.reservationNumber}</strong>
          </p>

          <div className="book-table-confirmation__details">
            <div>
              <span>Name</span>
              <span>{confirmation.name}</span>
            </div>
            <div>
              <span>Date</span>
              <span>{confirmation.date}</span>
            </div>
            <div>
              <span>Time</span>
              <span>{confirmation.time}</span>
            </div>
            <div>
              <span>Party Size</span>
              <span>{confirmation.guests}</span>
            </div>
            {confirmation.notes && (
              <div>
                <span>Notes</span>
                <span>{confirmation.notes}</span>
              </div>
            )}
          </div>

          <div className="book-table-confirmation__actions">
            <button type="button" onClick={handleReset}>
              Make Another Reservation
            </button>
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="book-table-page">
      <div className="book-table-page__header">
        <span className="book-table-page__eyebrow">Reservations</span>
        <h1 className="book-table-page__title">Book a Table</h1>
        <p className="book-table-page__subtitle">
          Reserve your table at Gourmet Haven — we&apos;ll confirm by email or phone.
        </p>
      </div>

      <form className="book-table-form" onSubmit={handleSubmit} noValidate>
        {submitError && (
          <p className="book-table-form__submit-error">{submitError}</p>
        )}

        <label className="book-table-form__field">
          <span>Full Name</span>
          <input type="text" value={form.name} onChange={handleChange('name')} placeholder="Jane Doe" />
          {errors.name && <span className="book-table-form__error">{errors.name}</span>}
        </label>

        <label className="book-table-form__field">
          <span>Email</span>
          <input type="email" value={form.email} onChange={handleChange('email')} placeholder="jane@example.com" />
          {errors.email && <span className="book-table-form__error">{errors.email}</span>}
        </label>

        <label className="book-table-form__field">
          <span>Phone</span>
          <input type="tel" value={form.phone} onChange={handleChange('phone')} placeholder="+1 (555) 012-3456" />
          {errors.phone && <span className="book-table-form__error">{errors.phone}</span>}
        </label>

        <div className="book-table-form__row">
          <label className="book-table-form__field">
            <span>Date</span>
            <input type="date" value={form.date} onChange={handleChange('date')} />
            {errors.date && <span className="book-table-form__error">{errors.date}</span>}
          </label>

          <label className="book-table-form__field">
            <span>Time</span>
            <input type="time" value={form.time} onChange={handleChange('time')} />
            {errors.time && <span className="book-table-form__error">{errors.time}</span>}
          </label>
        </div>

        <label className="book-table-form__field">
          <span>Party Size</span>
          <select value={form.guests} onChange={handleChange('guests')}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option value={n} key={n}>
                {n} {n === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </label>

        <label className="book-table-form__field">
          <span>Special Requests (optional)</span>
          <textarea
            rows={3}
            value={form.notes}
            onChange={handleChange('notes')}
            placeholder="Allergies, celebrations, seating preferences, etc."
          />
        </label>

        <button type="submit" className="book-table-form__submit" disabled={submitting}>
          {submitting ? 'Confirming…' : 'Confirm Reservation'}
        </button>
      </form>
    </div>
  );
}

export default BookTable;
