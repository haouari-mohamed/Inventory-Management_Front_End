import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

class DecodeJwtService {
    constructor() {
        this.token = null;
        if (typeof localStorage !== 'undefined') {
            this.token = localStorage.getItem('jwt');
        }
    }

    decodeToken(token = this.token) {
        if (!token || typeof token !== 'string') {
            console.error('Invalid token format:', token);
            return null; // Return null if the token is invalid
        }

        try {
            return jwtDecode(token);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    getUsernameFromToken(token = this.token) {
        const decodedToken = this.decodeToken(token);
        return decodedToken ? decodedToken.sub : null; // Return null if decoding fails
    }

    getRoleFromToken(token = this.token) {
        const decodedToken = this.decodeToken(token);
        return decodedToken ? decodedToken.roles : null;
    }

    async getIdByUsername(token = this.token) {
        const username = this.getUsernameFromToken(token);
        if (!username) {
            throw new Error('Username could not be retrieved from token');
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/utilisateurs/find/utilisateur/${username}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user by username:', error);
            throw error; // Re-throw to handle it in the caller function
        }
    }
}

export default new DecodeJwtService();
