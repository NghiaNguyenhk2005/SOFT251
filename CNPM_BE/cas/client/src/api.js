import axios from 'axios';

/**
 * Axios instance configured for CAS server communication
 * withCredentials: true is CRITICAL - it allows cookies (session ID) to be sent cross-origin
 */
const api = axios.create({
  baseURL: 'http://localhost:5001',
  withCredentials: true, // Send cookies (session) with every request
});

export default api;
