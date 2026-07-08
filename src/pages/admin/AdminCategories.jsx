import React, { useEffect, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  createCategory,
  deleteCategory,
  fetchAdminCategories,
  updateCategory,
} from '../../services/api';
import './AdminShared.css';

const emptyForm = { name: '', sort_order: '0' };

function AdminCategories() {
  const { token } = useAdmin();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    setError(null);
    fetchAdminCategories(token)
      .then(setCategories)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadCategories, [token]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setForm({ name: category.name, sort_order: String(category.sort_order ?? 0) });
    setFieldErrors({});
    setSubmitError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFieldErrors({});
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors({});

    if (!form.name.trim()) {
      setFieldErrors({ name: 'Name is required.' });
      return;
    }

    setSubmitting(true);
    const payload = { name: form.name, sort_order: Number(form.sort_order) || 0 };

    try {
      if (editingId) {
        await updateCategory(token, editingId, payload);
      } else {
        await createCategory(token, payload);
      }
      cancelEdit();
      loadCategories();
    } catch (err) {
      if (err.errors) {
        const next = {};
        Object.entries(err.errors).forEach(([key, messages]) => {
          next[key] = messages[0];
        });
        setFieldErrors(next);
      } else {
        setSubmitError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}"? Menu items in this category will also be deleted.`
    );
    if (!confirmed) return;

    try {
      await deleteCategory(token, category.id);
      loadCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">Categories</h1>
      </div>

      {loading && <p className="admin-page__status">Loading…</p>}
      {error && <p className="admin-page__status admin-page__status--error">{error}</p>}

      {!loading && !error && (
        <div className="admin-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Sort Order</th>
                <th>Menu Items</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.sort_order}</td>
                  <td>{category.menu_items_count ?? '—'}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        type="button"
                        className="admin-table__action"
                        onClick={() => startEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-table__action admin-table__action--danger"
                        onClick={() => handleDelete(category)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-page__status">
                    No categories yet — add one below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2 className="admin-form__title">
          {editingId ? 'Edit Category' : 'Add Category'}
        </h2>

        {submitError && <p className="admin-form__submit-error">{submitError}</p>}

        <div className="admin-form__row admin-form__row--two">
          <label className="admin-form__field">
            <span>Name</span>
            <input
              type="text"
              value={form.name}
              onChange={handleChange('name')}
              placeholder="e.g. Starters"
            />
            {fieldErrors.name && <span className="admin-form__error">{fieldErrors.name}</span>}
          </label>

          <label className="admin-form__field">
            <span>Sort Order</span>
            <input
              type="number"
              value={form.sort_order}
              onChange={handleChange('sort_order')}
            />
          </label>
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="admin-form__submit" disabled={submitting}>
            {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Category'}
          </button>
          {editingId && (
            <button type="button" className="admin-form__cancel" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdminCategories;
