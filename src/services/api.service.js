import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important: allows cookies to be sent
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication API calls
export const authAPI = {
  /**
   * Register new user
   * @param {Object} data - { name, email, password }
   * @returns {Promise} Response with user data
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} data - { email, password }
   * @returns {Promise} Response with user data
   */
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  /**
   * Logout user
   * @returns {Promise} Response
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Verify current session
   * @returns {Promise} Response with user data
   */
  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export default api;
