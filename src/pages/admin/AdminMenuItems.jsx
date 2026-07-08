import React, { useEffect, useRef, useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  createMenuItem,
  deleteMenuItem,
  fetchAdminCategories,
  fetchAdminMenuItems,
  updateMenuItem,
} from '../../services/api';
import './AdminShared.css';

const emptyForm = {
  category_id: '',
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  imageFile: null,
  is_available: true,
};

function AdminMenuItems() {
  const { token } = useAdmin();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    Promise.all([fetchAdminMenuItems(token), fetchAdminCategories(token)])
      .then(([items, cats]) => {
        setMenuItems(items);
        setCategories(cats);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadData, [token]);

  // Clean up any object URL we created for a local file preview.
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (field) => (e) => {
    const value = field === 'is_available' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, imageFile: file }));
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearImageSelection = () => {
    setForm((prev) => ({ ...prev, imageFile: null, imageUrl: '' }));
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      category_id: String(item.category_id),
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      imageUrl: '',
      imageFile: null,
      is_available: Boolean(item.is_available),
    });
    setPreviewUrl(item.image || null);
    setFieldErrors({});
    setSubmitError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreviewUrl(null);
    setFieldErrors({});
    setSubmitError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const next = {};
    if (!form.name.trim()) next.name = 'Name is required.';
    if (!form.category_id) next.category_id = 'Choose a category.';
    if (!form.price || Number(form.price) < 0) next.price = 'Enter a valid price.';
    if (Object.keys(next).length > 0) {
      setFieldErrors(next);
      return;
    }
    setFieldErrors({});

    const payload = {
      category_id: Number(form.category_id),
      name: form.name,
      description: form.description || null,
      price: Number(form.price),
      is_available: form.is_available,
      imageFile: form.imageFile,
      imageUrl: form.imageFile ? null : form.imageUrl || null,
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await updateMenuItem(token, editingId, payload);
      } else {
        await createMenuItem(token, payload);
      }
      cancelEdit();
      loadData();
    } catch (err) {
      if (err.errors) {
        const errs = {};
        Object.entries(err.errors).forEach(([key, messages]) => {
          const field = key === 'image_file' || key === 'image_url' ? 'image' : key;
          errs[field] = messages[0];
        });
        setFieldErrors(errs);
      } else {
        setSubmitError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(`Delete "${item.name}"?`);
    if (!confirmed) return;

    try {
      await deleteMenuItem(token, item.id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="admin-page__header">
        <h1 className="admin-page__title">Menu Items</h1>
      </div>

      {loading && <p className="admin-page__status">Loading…</p>}
      {error && <p className="admin-page__status admin-page__status--error">{error}</p>}

      {!loading && !error && (
        <div className="admin-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.image && (
                      <img src={item.image} alt={item.name} className="admin-table__thumb" />
                    )}
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category?.name}</td>
                  <td>${Number(item.price).toFixed(2)}</td>
                  <td>
                    <span
                      className={`admin-badge ${item.is_available ? 'admin-badge--on' : 'admin-badge--off'}`}
                    >
                      {item.is_available ? 'Available' : 'Hidden'}
                    </span>
                  </td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        type="button"
                        className="admin-table__action"
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-table__action admin-table__action--danger"
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {menuItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-page__status">
                    No menu items yet — add one below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h2 className="admin-form__title">
          {editingId ? 'Edit Menu Item' : 'Add Menu Item'}
        </h2>

        {submitError && <p className="admin-form__submit-error">{submitError}</p>}

        <div className="admin-form__row admin-form__row--two">
          <label className="admin-form__field">
            <span>Name</span>
            <input type="text" value={form.name} onChange={handleChange('name')} />
            {fieldErrors.name && <span className="admin-form__error">{fieldErrors.name}</span>}
          </label>

          <label className="admin-form__field">
            <span>Category</span>
            <select value={form.category_id} onChange={handleChange('category_id')}>
              <option value="">Select a category…</option>
              {categories.map((cat) => (
                <option value={cat.id} key={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {fieldErrors.category_id && (
              <span className="admin-form__error">{fieldErrors.category_id}</span>
            )}
          </label>
        </div>

        <label className="admin-form__field">
          <span>Description</span>
          <textarea
            rows={2}
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Short description shown on the menu"
          />
        </label>

        <label className="admin-form__field">
          <span>Price ($)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange('price')}
          />
          {fieldErrors.price && <span className="admin-form__error">{fieldErrors.price}</span>}
        </label>

        <div className="admin-form__field">
          <span>Image</span>

          <div className="admin-image-picker">
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="admin-image-picker__preview" />
            )}

            <div className="admin-image-picker__controls">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleFileChange}
              />
              <span className="admin-image-picker__or">or paste a URL</span>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => {
                  handleChange('imageUrl')(e);
                  setPreviewUrl(e.target.value || null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                  setForm((prev) => ({ ...prev, imageFile: null }));
                }}
                placeholder="https://…"
                disabled={Boolean(form.imageFile)}
              />
              {(previewUrl || form.imageFile || form.imageUrl) && (
                <button
                  type="button"
                  className="admin-image-picker__clear"
                  onClick={clearImageSelection}
                >
                  Clear image
                </button>
              )}
            </div>
          </div>
          {fieldErrors.image && <span className="admin-form__error">{fieldErrors.image}</span>}
          {editingId && !form.imageFile && !form.imageUrl && (
            <span className="admin-form__hint">Leave both blank to keep the current image.</span>
          )}
        </div>

        <label className="admin-form__field admin-form__checkbox">
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={handleChange('is_available')}
          />
          <span>Available on the public menu</span>
        </label>

        <div className="admin-form__actions">
          <button type="submit" className="admin-form__submit" disabled={submitting}>
            {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Add Menu Item'}
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

export default AdminMenuItems;
