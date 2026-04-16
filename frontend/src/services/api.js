import axios from 'axios';

const api = axios.create({
  // ✅ FIX: Changed from process.env to import.meta.env
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add to Api.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Or wherever you store the JWT
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;