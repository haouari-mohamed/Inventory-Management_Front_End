import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api'
});

export const login = async (loginRequest) => {
        const response = await apiClient.post('/utilisateurs/login', loginRequest);
        return response.data;
};

export default {
    login,
    
};
