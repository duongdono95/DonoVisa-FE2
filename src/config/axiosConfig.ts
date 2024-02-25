import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 400) {
        console.error('Bad Request:', error.response.data);
      }
    } else if (error.request) {
      console.error('The request was made but no response was received');
    } else {
      console.error('Error setting up the request:', error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
