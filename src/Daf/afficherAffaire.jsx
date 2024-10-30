import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faInfo, faUserPlus, faTasks } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const TableRow = ({ item, onShowInfo, onDesignateChef }) => (
    <tr>
        <td>{item.idAffaire}</td>
        <td>{item.libelle_affaire}</td>
        <td>{item.prixGlobal}</td>
        <td>{item.dateDebut}</td>
        <td>{item.dateFin}</td>
        <td>
            <button onClick={() => onShowInfo(item)} className="btn btn-link btn-primary me-2" title="Informations">
                <FontAwesomeIcon icon={faInfo} />
            </button>
        </td>
    </tr>
);

const AfficherAffaireDA = () => {
    const navigate = useNavigate();
    const [affaires, setAffaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [showModal, setShowModal] = useState(false);
    const [selectedAffaire, setSelectedAffaire] = useState(null);

    const fetchAffaires = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/affaires/affairesdaf`);
            console.log("hhhhhhh",response.data)
            setAffaires(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement des affaires:', error);
            setError('Échec du chargement des affaires');
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAffaires();
    }, [fetchAffaires]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const handleShowInfo = (affaire) => {
        setSelectedAffaire(affaire);
        setShowModal(true);
    };

  

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAffaire(null);
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key) => {
        if (!sortConfig.key) {
            return faSort;
        }
        return sortConfig.key === key
            ? (sortConfig.direction === 'ascending' ? faSortUp : faSortDown)
            : faSort;
    };

    const sortedData = useMemo(() => {
        let sortableItems = [...affaires];
        if (sortConfig.key) {
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
    }, [affaires, sortConfig]);

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
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th onClick={() => requestSort('idAffaire')} style={{ cursor: 'pointer' }}>
                                            ID Affaire <FontAwesomeIcon icon={getSortIcon('idAffaire')} />
                                        </th>
                                        <th onClick={() => requestSort('libelle_affaire')} style={{ cursor: 'pointer' }}>
                                            Libelle Affaire <FontAwesomeIcon icon={getSortIcon('libelle_affaire')} />
                                        </th>
                                        <th onClick={() => requestSort('prixGlobal')} style={{ cursor: 'pointer' }}>
                                            Prix Global <FontAwesomeIcon icon={getSortIcon('prixGlobal')} />
                                        </th>
                                        <th>Date Début</th>
                                        <th>Date Fin</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedData
                                        .map((item) => (
                                            <TableRow 
                                                key={item.idAffaire} 
                                                item={item} 
                                                onShowInfo={handleShowInfo} 
                                              
                                            />
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <Modal show={showModal} onHide={handleCloseModal} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Détails de l'Affaire</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedAffaire && (
                                    <div>
                                        <h5>ID Affaire : {selectedAffaire.idAffaire}</h5>
                                        <p>Libellé Affaire : {selectedAffaire.libelle_affaire}</p>
                                        <p>Prix Global : {selectedAffaire.prixGlobal}</p>
                                        <p>Date début : {selectedAffaire.dateDebut}</p>
                                        <p>Date fin : {selectedAffaire.dateFin}</p>
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Fermer
                                </Button>
                                <Button 
                                    variant="primary" 
                                    onClick={() => navigate(`/afficherMissionDA/${selectedAffaire?.idAffaire}`)}
                                >
                                    Afficher les Missions <FontAwesomeIcon icon={faTasks} />
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default AfficherAffaireDA;
