const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(options.headers || {}),
      },
    });
  } catch (networkError) {
    throw new Error(
      'Could not reach the server. Is the Laravel API running at ' + API_BASE_URL + '?'
    );
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const error = new Error(data?.message || `Request failed (${res.status})`);
    error.status = res.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
}

export function fetchCategories() {
  return request('/categories');
}

export function fetchMenuItems(categorySlug) {
  const query = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : '';
  return request(`/menu-items${query}`);
}

export function createOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchOrder(orderNumber) {
  return request(`/orders/${encodeURIComponent(orderNumber)}`);
}

export function createReservation(payload) {
  return request('/reservations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

// --- Admin: auth ---

export function adminLogin(payload) {
  return request('/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function adminLogout(token) {
  return request('/admin/logout', {
    method: 'POST',
    headers: authHeader(token),
  });
}

export function fetchAdminMe(token) {
  return request('/admin/me', { headers: authHeader(token) });
}

// --- Admin: categories ---

export function fetchAdminCategories(token) {
  return request('/admin/categories', { headers: authHeader(token) });
}

export function createCategory(token, payload) {
  return request('/admin/categories', {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(payload),
  });
}

export function updateCategory(token, id, payload) {
  return request(`/admin/categories/${id}`, {
    method: 'PUT',
    headers: authHeader(token),
    body: JSON.stringify(payload),
  });
}

export function deleteCategory(token, id) {
  return request(`/admin/categories/${id}`, {
    method: 'DELETE',
    headers: authHeader(token),
  });
}

// --- Admin: menu items ---

export function fetchAdminMenuItems(token) {
  return request('/admin/menu-items', { headers: authHeader(token) });
}

function buildMenuItemFormData(payload) {
  const formData = new FormData();
  formData.append('category_id', payload.category_id);
  formData.append('name', payload.name);
  formData.append('description', payload.description ?? '');
  formData.append('price', payload.price);
  formData.append('is_available', payload.is_available ? '1' : '0');

  if (payload.imageFile) {
    formData.append('image_file', payload.imageFile);
  } else if (payload.imageUrl) {
    formData.append('image_url', payload.imageUrl);
  }

  return formData;
}

export function createMenuItem(token, payload) {
  return request('/admin/menu-items', {
    method: 'POST',
    headers: authHeader(token),
    body: buildMenuItemFormData(payload),
  });
}

export function updateMenuItem(token, id, payload) {
  const formData = buildMenuItemFormData(payload);
  // PHP doesn't parse multipart bodies on PUT requests, so we POST with a
  // spoofed _method field, which Laravel maps back to the update() route.
  formData.append('_method', 'PUT');

  return request(`/admin/menu-items/${id}`, {
    method: 'POST',
    headers: authHeader(token),
    body: formData,
  });
}

export function deleteMenuItem(token, id) {
  return request(`/admin/menu-items/${id}`, {
    method: 'DELETE',
    headers: authHeader(token),
  });
}
