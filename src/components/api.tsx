import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'https://tbooke.net/api', // live API
});

// Add a request interceptor to include the token
api.interceptors.request.use(
  (config) => {
    try {
      const token = Cookies.get('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error retrieving token:', error);
      throw error;
    }
  },
  (error) => Promise.reject(error)
);

export default api;
