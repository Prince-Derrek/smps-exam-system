import axios from 'axios';

const api = axios.create({
  // ✅ FIX: Changed from process.env to import.meta.env
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;