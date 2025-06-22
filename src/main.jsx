import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios';

// ✅ Setup for cross-device communication
axios.defaults.baseURL = 'http://192.168.151.250:3000'; // your backend IP
axios.defaults.withCredentials = true;                  // allow cookies/session

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
