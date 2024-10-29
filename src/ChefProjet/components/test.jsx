import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Test = () => {
    const [avancements, setAvancements] = useState([]);
    const [error, setError] = useState(null);
    const [newAvancement, setNewAvancement] = useState({
        dateMiseAJour: '',
        montantAvancement: '',
        commentaire: ''
    });
    const baseUrl = 'http://localhost:8080';

    useEffect(() => {
        const fetchAvancements = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/avancements/mission/2`);
                setAvancements(response.data);
            } catch (error) {
                console.error('Error fetching avancements:', error);
                setError('Failed to load avancements. Please try again later.');
            }
        };

        fetchAvancements();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAvancement({ ...newAvancement, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${baseUrl}/api/avancements`, newAvancement);
            setAvancements([...avancements, response.data]);
            setNewAvancement({
                dateMiseAJour: '',
                montantAvancement: '',
                commentaire: ''
            });
        } catch (error) {
            console.error('Error adding avancement:', error);
            setError('Failed to add avancement. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Avancements for Mission 2</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {avancements.map(avancement => (
                    <li key={avancement.id}>
                        <div>
                            <strong>Date Mise à Jour:</strong> {new Date(avancement.dateMiseAJour).toLocaleString()}
                        </div>
                        <div>
                            <strong>Montant Avancement:</strong> {avancement.montantAvancement.toFixed(2)} Dhs
                        </div>
                        <div>
                            <strong>Commentaire:</strong> {avancement.commentaire}
                        </div>
                    </li>
                ))}
            </ul>

            <h3>Add New Avancement</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Date Mise à Jour:</label>
                    <input
                        type="datetime-local"
                        name="dateMiseAJour"
                        value={newAvancement.dateMiseAJour}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Montant Avancement:</label>
                    <input
                        type="number"
                        name="montantAvancement"
                        value={newAvancement.montantAvancement}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Commentaire:</label>
                    <textarea
                        name="commentaire"
                        value={newAvancement.commentaire}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit">Add Avancement</button>
            </form>
        </div>
    );
};

export default Test;
