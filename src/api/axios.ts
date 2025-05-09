import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://localhost:7086/api', // 🔁 Cambia por tu base real si es distinta
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;
