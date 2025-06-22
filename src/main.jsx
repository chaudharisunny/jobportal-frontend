import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

// ✅ Setup for cross-device communication
axios.defaults.baseURL = 'https://jobportal-backend-d315.onrender.com/'; // your backend IP
axios.defaults.withCredentials = true;                  // allow cookies/session

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
