const BASE_URL = '/api';

async function request(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
}

export const api = {
  // Customers
  getCustomers: (search = '', property = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (property) params.append('property', property);
    const query = params.toString();
    return request(`${BASE_URL}/customers${query ? `?${query}` : ''}`);
  },
  getCustomer: (id) => request(`${BASE_URL}/customers/${id}`),
  createCustomer: (data) =>
    request(`${BASE_URL}/customers`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCustomer: (id, data) =>
    request(`${BASE_URL}/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCustomer: (id) =>
    request(`${BASE_URL}/customers/${id}`, {
      method: 'DELETE',
    }),

  // Receipts
  getNextReceiptNumber: () => request(`${BASE_URL}/receipts/next-number`),
  getReceipts: (search = '', month = '', property = '') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (month) params.append('month', month);
    if (property) params.append('property', property);
    const query = params.toString();
    return request(`${BASE_URL}/receipts${query ? `?${query}` : ''}`);
  },
  getReceipt: (id) => request(`${BASE_URL}/receipts/${id}`),
  createReceipt: (data) =>
    request(`${BASE_URL}/receipts`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateReceipt: (id, data) =>
    request(`${BASE_URL}/receipts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteReceipt: (id) =>
    request(`${BASE_URL}/receipts/${id}`, {
      method: 'DELETE',
    }),

  // Settings
  getSettings: () => request(`${BASE_URL}/settings`),
  updateSettings: (data) =>
    request(`${BASE_URL}/settings`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

