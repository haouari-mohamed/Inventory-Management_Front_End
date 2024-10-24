import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';
import { Spinner, Table } from 'react-bootstrap';

const AffairesMissionsDivisions = () => {
    const [affaires, setAffaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const idUser = localStorage.getItem('userId');
        axios.get(`http://localhost:8080/api/missions/missions-divisions/${idUser}`)
            .then(response => {
                setAffaires(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données", error);
                setError("Une erreur s'est produite lors de la récupération des données.");
                setLoading(false);
            });
    }, []);

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
                    <h2 className="mb-4">Liste des Affaires, Missions et Divisions</h2>
                    <div className="table-responsive">
                        <Table striped bordered hover className="table-centered table-sm align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th style={tableStyle}>Libellé Affaire</th>
                                    <th style={tableStyle}>Date Début</th>
                                    <th style={tableStyle}>Date Fin</th>
                                    <th style={tableStyle}>Part CID</th>
                                    <th style={tableStyle}>Libellé Mission</th>
                                    <th style={tableStyle}>Division Principale</th>
                                    <th style={tableStyle}>Part Division Principale</th>
                                    <th style={tableStyle}>Division Secondaire</th>
                                    <th style={tableStyle}>Part Division Secondaire</th>
                                    <th style={tableStyle}>Sous-traitant</th>
                                    <th style={tableStyle}>Part Sous-traitant</th>
                                    <th style={tableStyle}>Partenaire</th>
                                    <th style={tableStyle}>Part Partenaire</th>
                                </tr>
                            </thead>
                            <tbody>
                                {affaires.map((affaire, index) => (
                                    <tr key={index}>
                                        <td style={tableStyle}>{affaire.libelleAffaire}</td>
                                        <td style={tableStyle}>{new Date(affaire.dateDebut).toLocaleDateString()}</td>
                                        <td style={tableStyle}>{new Date(affaire.dateFin).toLocaleDateString()}</td>
                                        <td style={tableStyle}>{affaire.partCID}</td>
                                        <td style={tableStyle}>{affaire.libelleMission}</td>
                                        <td style={tableStyle}>{affaire.nomDivisionPrincipale}</td>
                                        <td style={tableStyle}>{affaire.partDivisionPrincipale}%</td>
                                        <td style={tableStyle}>{affaire.divisionSecondaireNom}</td>
                                        <td style={tableStyle}>{affaire.partDivisionSecondaire}%</td>
                                        <td style={tableStyle}>{affaire.sousTraitantNom}</td>
                                        <td style={tableStyle}>{affaire.partSousTraitant}%</td>
                                        <td style={tableStyle}>{affaire.partenaireNom}</td>
                                        <td style={tableStyle}>{affaire.partPartenaire}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        {affaires.length === 0 && <p className="text-center">Aucune affaire trouvée.</p>}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default AffairesMissionsDivisions;
