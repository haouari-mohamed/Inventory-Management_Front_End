import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const DetailsMissionPartSecondaire = () => {
    const { id } = useParams();
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/missions/missionpartsecondaire/${id}`)
            .then(response => {
                setMissions(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données", error);
                setError("Une erreur s'est produite lors de la récupération des données.");
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    const tableStyle = {
        fontSize: '0.7rem',
        padding: '0.3rem',
        textAlign: 'center'
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container mt-4">
                    <h2 className="mb-4">Détails de la Mission</h2>
                    <div className="table-responsive">
                        <Table striped bordered hover className="table-centered table-sm align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th style={tableStyle}>Libellé Mission</th>
                                    <th style={tableStyle}>Chef de Projet</th>
                                    <th style={tableStyle}>Division</th>
                                    <th style={tableStyle}>Part Division</th>
                                </tr>
                            </thead>
                            <tbody>
                                {missions.map((mission, index) => (
                                    <tr key={index}>
                                        <td style={tableStyle}>{mission.libelleMission}</td>
                                        <td style={tableStyle}>{mission.username}</td>
                                        <td style={tableStyle}>{mission.nomDivision}</td>
                                        <td style={tableStyle}>{mission.partMission}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {missions.length === 0 && <p className="text-center">Aucune mission trouvée.</p>}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default DetailsMissionPartSecondaire;
