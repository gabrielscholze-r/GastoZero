import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const api = axios.create({
  baseURL: 'http://localhost:8080/',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = cookies.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
