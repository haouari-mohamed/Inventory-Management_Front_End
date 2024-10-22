// apiClient.js
import axios from 'axios';

// Créer une instance Axios
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/',
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
