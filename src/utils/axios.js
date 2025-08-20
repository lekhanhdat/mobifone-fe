import axios from 'axios';

const instance = axios.create({ baseURL: 'http://localhost:5000' });  // Backend URL

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Add token to headers
  }
  return config;
}, error => Promise.reject(error));

export default instance;