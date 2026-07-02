const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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
