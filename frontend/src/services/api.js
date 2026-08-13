import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

// Auth
export const login = (credentials) => API.post('/auth/login', credentials);
export const signup = (data) => API.post('/auth/signup', data);

// Products
export const getProducts = () => API.get('/products');
export const addProduct = (data) => API.post('/products', data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const getYearlySales = () => API.get('/reports/yearly');
export const getWeeklyTrend = () => API.get('/reports/weekly');

// Billing
export const createBill = (billData) => API.post('/bills', billData);

// Reports
export const getSummary = () => API.get('/reports/summary');
export const getRecentBills = () => API.get('/reports/recent-bills');
export const getAllBills = () => API.get('/reports/all-bills');
export const getDailySales = () => API.get('/reports/daily');
export const getMonthlySales = () => API.get('/reports/monthly');
export const getTopProducts = () => API.get('/reports/top-products');

export default API;