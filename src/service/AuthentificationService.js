import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 1000,
});

export const login = async (loginRequest) => {
        const response = await apiClient.post('/utilisateurs/login', );
        return response.data;
};

export default {
    login,
    
};
