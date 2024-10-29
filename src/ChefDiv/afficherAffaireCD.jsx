/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faInfo, faTasks, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

/* const TableRow = ({ item, onShowInfo, onDesignateChef }) => (
    <tr>
        <td>{item.idAffaire}</td>
        <td>{item.libelle_affaire}</td>
        <td>{item.statusAffaire}</td>
        <td>{item.client.nom_client}</td>
        <td>
            <button onClick={() => onShowInfo(item)} className="btn btn-link btn-primary me-2" title="Informations">
                <FontAwesomeIcon icon={faInfo} />
            </button>
            {item.chefProjet === null && (
                <button onClick={() => onDesignateChef(item)} className="btn btn-link btn-primary" title="Désigner Chef de Projet">
                    <FontAwesomeIcon icon={faUserPlus} />
                </button>
            )}
        </td>
    </tr>
); */
const TableRow = ({ item, onShowInfo, onDesignateChef, isPrimaryDivision }) => (
    <tr>
        <td>{item.idAffaire}</td>
        <td>{item.libelle_affaire}</td>
        <td>{item.statusAffaire}</td>
        <td>{item.client.nom_client}</td>
        <td>
            <button onClick={() => onShowInfo(item)} className="btn btn-link btn-primary me-2" title="Informations">
                <FontAwesomeIcon icon={faInfo} />
            </button>
            {isPrimaryDivision && item.chefProjet === null && (
                <button onClick={() => onDesignateChef(item)} className="btn btn-link btn-primary" title="Désigner Chef de Projet">
                    <FontAwesomeIcon icon={faUserPlus} />
                </button>
            )}
        </td>
    </tr>
);

const AfficherAffaire = () => {
    const navigate = useNavigate();
    const [affaires, setAffaires] = useState([]);
    const [affairesSecondaires, setAffairesSecondaires] = useState([]); // Nouvel état pour les affaires secondaires
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [userDivision, setUserDivision] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAffaire, setSelectedAffaire] = useState(null);

    const fetchUserDivision = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:8080/api/utilisateurs/${userId}`);
            setUserDivision(response.data.division);
        } catch (error) {
            console.error('Error fetching user division:', error);
            setError('Failed to fetch user information');
        }
    };

    const fetchAffaires = useCallback(async () => {
        if (!userDivision) return;

        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:8080/api/affaires/affairesdp/${userId}`);
            console.log('Affaires data:', response.data);

            const filteredAffaires = response.data.filter(affaire => {
                const isDivisionPrincipale = affaire.divisionPrincipale && affaire.divisionPrincipale.id_division === userDivision.id_division;
                const isDivisionSecondaire = affaire.divisionSecondaire && affaire.divisionSecondaire.id_division === userDivision.id_division;
                return isDivisionPrincipale || isDivisionSecondaire;
            });

            setAffaires(filteredAffaires);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching affaires:', error);
            setError('Failed to fetch affaires');
            setLoading(false);
        }
    }, [userDivision]);

    const fetchAffairesSecondaires = useCallback(async () => {
        if (!userDivision) return;

        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:8080/api/affaires/affairesds/${userId}`);
            setAffairesSecondaires(response.data);
        } catch (error) {
            console.error('Error fetching secondary affaires:', error);
            setError('Failed to fetch secondary affaires');
        }
    }, [userDivision]);

    useEffect(() => {
        fetchUserDivision();
    }, []);

    useEffect(() => {
        if (userDivision) {
            fetchAffaires();
            fetchAffairesSecondaires();
        }
    }, [userDivision, fetchAffaires, fetchAffairesSecondaires]);

  
    const handleSearch = (term) => {
        setSearchTerm(term);
    };

 
    const handleShowInfo = (affaire) => {
        setSelectedAffaire(affaire);
        setShowModal(true);
    };

 
    const handleDesignateChef = (affaire) => {
        navigate(`/designationChefProjetCD/${affaire.idAffaire}`);
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

    
        const handleShowMissions = (affaireId) => {
            if (selectedAffaire) {
                if (selectedAffaire.divisionPrincipale.nom_division === userDivision?.nom_division) {
                    navigate(`/afficherMissionpCD/${affaireId}`);
                } else {
                    console.log("nom division"+userDivision.nom_division)
                    console.log("nom  selectonee"+selectedAffaire.divisionPrincipale)
                    navigate(`/afficherMissionCD/${affaireId}`);
                }
                handleCloseModal();
            }
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
                                        <h4 className="card-title">Affaires en tant que Division Secondaire</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : error ? (
                                                <p>{error}</p>
                                            ) : (
                                                <table className="table table-striped table-hover mt-3">
                                                    <thead>
                                                        <tr>
                                                            <th>ID Affaire</th>
                                                            <th>Libellé Affaire</th>
                                                            <th>Status</th>
                                                            <th>Client</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {affairesSecondaires.map((item) => (
                                                            <TableRow 
                                                                key={item.idAffaire} 
                                                                item={item} 
                                                                onShowInfo={handleShowInfo} 
                                                                onDesignateChef={handleDesignateChef}
                                                                isPrimaryDivision={false}
                                                            />
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Liste des affaires en tant que Division Principale {userDivision?.nom_division}</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            {loading ? (
                                                <p>Loading...</p>
                                            ) : error ? (
                                                <p>{error}</p>
                                            ) : (
                                                <table className="table table-striped table-hover mt-3">
                                                    <thead>
                                                        <tr>
                                                            <th onClick={() => requestSort('idAffaire')} style={{ cursor: 'pointer' }}>
                                                                ID Affaire <FontAwesomeIcon icon={getSortIcon('idAffaire')} />
                                                            </th>
                                                            <th onClick={() => requestSort('libelle_affaire')} style={{ cursor: 'pointer' }}>
                                                                Libellé Affaire <FontAwesomeIcon icon={getSortIcon('libelle_affaire')} />
                                                            </th>
                                                            <th onClick={() => requestSort('statusAffaire')} style={{ cursor: 'pointer' }}>
                                                                Status <FontAwesomeIcon icon={getSortIcon('statusAffaire')} />
                                                            </th>
                                                            <th>Client</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sortedData
                                                            .filter(item => item.libelle_affaire.toLowerCase().includes(searchTerm.toLowerCase()))
                                                            .map((item) => (
                                                                <TableRow 
                                                                    key={item.idAffaire} 
                                                                    item={item} 
                                                                    onShowInfo={handleShowInfo} 
                                                                    onDesignateChef={handleDesignateChef}
                                                                    isPrimaryDivision={true}
                                                                />
                                                            ))}
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Modal show={showModal} onHide={handleCloseModal} size="lg">
                            <Modal.Header closeButton>
                                <Modal.Title>Détails de l'Affaire</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {selectedAffaire && (
                                    <div>
                                        <h5>Libellé : {selectedAffaire.libelle_affaire}</h5>
                                        <p>Status : {selectedAffaire.statusAffaire}</p>
                                        <p>Client : {selectedAffaire.client.nom_client}</p>
                                    
                                    </div>
                                )}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>
                                    Fermer
                                </Button>
                                <Button 
                                    variant="primary" 
                                     onClick={() => handleShowMissions(selectedAffaire.idAffaire)}
                                >
                                    <FontAwesomeIcon icon={faTasks} className="me-2" />
                                    Afficher Missions
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

export default AfficherAffaire;
