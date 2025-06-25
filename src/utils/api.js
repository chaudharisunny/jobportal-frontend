import axios from 'axios';

// const API = axios.create({
//   baseURL: 'https://your-backend.onrender.com', // ✅ Replace with your real deployed backend
//   withCredentials: true                // ✅ Send session cookie
// });

const isLocalhost = window.location.hostname.includes('localhost');

const API = axios.create({
  baseURL: isLocalhost
    ? import.meta.env.VITE_API_URL ||'http://localhost:3000' // local backend
    : 'https://jobportal-backend-d315.onrender.com', // deployed backend
  withCredentials: true
});
// 🔐 Attach token from sessionStorage to every request
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      sessionStorage.removeItem('token');
      window.location.href = '/login'; // force redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;
