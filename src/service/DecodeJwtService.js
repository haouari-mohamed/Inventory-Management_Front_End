import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

class DecodeJwtService {
    constructor() {
        this.token = null;
        if (typeof localStorage !== 'undefined') {
            this.token = localStorage.getItem('jwt');
        }
    }

    decodeToken(token) {
        return jwtDecode(token);
    }

    getUsernameFromToken(token) {
        const decodedToken = this.decodeToken(token);
        return decodedToken.sub; 
    }

    getRoleFromToken(token) {
        const decodedToken = this.decodeToken(token);
        return decodedToken.roles;
    }

    async getIdByUsername(token) {
        const username = this.getUsernameFromToken(token);
        const response = await axios.get(`http://localhost:8080/api/utilisateurs/findIdByUsername/${username}`);
        return response.data;
        
    }
}

export default new DecodeJwtService();