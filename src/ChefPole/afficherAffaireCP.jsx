import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faInfo, faTasks } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const TableRow = ({ item, onShowInfo }) => (
    <tr>
        <td>{item.idAffaire}</td>
        <td>{item.libelle_affaire}</td>
        <td>{item.statusAffaire}</td>
        <td>{item.client.nom_client}</td>
        <td>
            <button onClick={() => onShowInfo(item)} className="btn btn-link btn-primary">
                <FontAwesomeIcon icon={faInfo} />
            </button>
        </td>
    </tr>
);

const AfficherAffaire = () => {
    const navigate = useNavigate();
    const [affairesPrincipales, setAffairesPrincipales] = useState([]);
    const [affairesSecondaires, setAffairesSecondaires] = useState([]);
    const [loadingPrincipales, setLoadingPrincipales] = useState(true);
    const [loadingSecondaires, setLoadingSecondaires] = useState(true);
    const [errorPrincipales, setErrorPrincipales] = useState('');
    const [errorSecondaires, setErrorSecondaires] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [userPole, setUserPole] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAffaire, setSelectedAffaire] = useState(null);

    const fetchUserPole = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await axios.get(`http://localhost:8080/api/utilisateurs/${userId}`);
            setUserPole(response.data.pole);
        } catch (error) {
            console.error('Error fetching user pole:', error);
            setErrorPrincipales('Failed to fetch user information');
        }
    };

    const fetchAffairesPrincipales = useCallback(async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/affaires/affairechefpoleprincipale/${userId}`);
            setAffairesPrincipales(response.data);
        } catch (error) {
            console.error("Error fetching principales affaires:", error);
            setErrorPrincipales("Failed to fetch principales affaires data");
        } finally {
            setLoadingPrincipales(false);
        }
    }, []);
    
    const fetchAffairesSecondaires = useCallback(async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/affaires/affairechefpolesecondaire/${userId}`);
            setAffairesSecondaires(response.data);
        } catch (error) {
            console.error("Error fetching secondaires affaires:", error);
            setErrorSecondaires("Failed to fetch secondaires affaires data");
        } finally {
            setLoadingSecondaires(false);
        }
    }, []);
    
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userPole && userId) {
            fetchAffairesPrincipales(userId);
            fetchAffairesSecondaires(userId);
        }
    }, [userPole, fetchAffairesPrincipales, fetchAffairesSecondaires]);
          
    useEffect(() => {
        fetchUserPole();
    }, []);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const filteredAffairesPrincipales = useMemo(() => {
        return affairesPrincipales.filter(affaire =>
            affaire.libelle_affaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affaire.client.nom_client.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [affairesPrincipales, searchTerm]);

    const filteredAffairesSecondaires = useMemo(() => {
        return affairesSecondaires.filter(affaire =>
            affaire.libelle_affaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affaire.client.nom_client.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [affairesSecondaires, searchTerm]);

    const sortedDataPrincipales = useMemo(() => {
        let sortableItems = [...filteredAffairesPrincipales];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredAffairesPrincipales, sortConfig]);

    const sortedDataSecondaires = useMemo(() => {
        let sortableItems = [...filteredAffairesSecondaires];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredAffairesSecondaires, sortConfig]);

    const handleShowInfo = (affaire) => {
        setSelectedAffaire(affaire);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAffaire(null);
    };

    const handleShowMissions = (affaireId) => {
        navigate(`/afficherMissionCP/${affaireId}`);
        handleCloseModal();
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader onSearch={handleSearch} />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Gestion des Affaires</h3>
                        </div>
                        
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Affaires Principales</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            {loadingPrincipales ? (
                                                <p>Loading...</p>
                                            ) : errorPrincipales ? (
                                                <p>{errorPrincipales}</p>
                                            ) : (
                                                <Table striped hover>
                                                    <thead>
                                                        <tr>
                                                            <th>ID Affaire</th>
                                                            <th>Libellé Affaire</th>
                                                            <th>Status</th>
                                                            <th>Client</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sortedDataPrincipales.map((item) => (
                                                            <TableRow key={item.idAffaire} item={item} onShowInfo={handleShowInfo} />
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 mt-4">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Affaires Secondaires</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            {loadingSecondaires ? (
                                                <p>Loading...</p>
                                            ) : errorSecondaires ? (
                                                <p>{errorSecondaires}</p>
                                            ) : (
                                                <Table striped hover>
                                                    <thead>
                                                        <tr>
                                                            <th>ID Affaire</th>
                                                            <th>Libellé Affaire</th>
                                                            <th>Status</th>
                                                            <th>Client</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sortedDataSecondaires.map((item) => (
                                                            <TableRow key={item.idAffaire} item={item} onShowInfo={handleShowInfo} />
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            {selectedAffaire && (
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Détails de l'Affaire</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>ID: {selectedAffaire.idAffaire}</p>
                        <p>Libellé: {selectedAffaire.libelle_affaire}</p>
                        <p>Status: {selectedAffaire.statusAffaire}</p>
                        <p>Client: {selectedAffaire.client.nom_client}</p>
                        <Button onClick={() => handleShowMissions(selectedAffaire.idAffaire)}>Voir Missions</Button>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default AfficherAffaire;
