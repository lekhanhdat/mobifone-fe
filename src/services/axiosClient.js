// services/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

axiosClient.interceptors.response.use(
  (response) => response.data, // Tự động lấy response.data
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
// Git push 
export default axiosClient;
