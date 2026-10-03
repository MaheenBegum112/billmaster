import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('billmaster_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and on protected route, clear stale token
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup' && currentPath !== '/' && currentPath !== '/about' && currentPath !== '/contact') {
        localStorage.removeItem('billmaster_token');
        localStorage.removeItem('billmaster_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getCurrentUser: () => api.get('/auth/me')
};

// Contact Form API
export const contactApi = {
  submit: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact')
};

// Products API
export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByBarcode: (barcode) => api.get(`/products/barcode/${barcode}`),
  search: (query) => api.get(`/products/search?query=${encodeURIComponent(query || '')}`),
  getCategories: () => api.get('/products/categories'),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

// Billing API
export const billsApi = {
  create: (billData) => api.post('/bills', billData),
  getAll: () => api.get('/bills'),
  getById: (id) => api.get(`/bills/${id}`),
  getByNumber: (number) => api.get(`/bills/number/${encodeURIComponent(number)}`)
};

// Inventory API
export const inventoryApi = {
  getSummary: () => api.get('/inventory/summary'),
  getItems: () => api.get('/inventory/items'),
  restock: (data) => api.post('/inventory/restock', data)
};

// Reports API
export const reportsApi = {
  getAdminSummary: () => api.get('/reports/summary'),
  getCashierSummary: () => api.get('/reports/cashier-summary'),
  getDaily: (days = 7) => api.get(`/reports/daily?days=${days}`),
  getMonthly: (months = 6) => api.get(`/reports/monthly?months=${months}`),
  getTopProducts: (limit = 5) => api.get(`/reports/top-products?limit=${limit}`),
  getCategories: () => api.get('/reports/categories')
};

// AI Intelligence API
export const aiApi = {
  getSummary: () => api.get('/ai/summary'),
  getSmartRestock: () => api.get('/ai/smart-restock'),
  getAnomalies: () => api.get('/ai/anomalies'),
  getForecasts: (days = 7) => api.get(`/ai/forecast?days=${days}`),
  getProductForecast: (productId, days = 7) => api.get(`/ai/forecast/${productId}?days=${days}`)
};

// Users API (Admin)
export const usersApi = {
  getAll: () => api.get('/users'),
  createCashier: (data) => api.post('/users/cashier', data),
  toggleStatus: (id) => api.put(`/users/${id}/toggle-status`)
};

// Settings API
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data)
};

export default api;
