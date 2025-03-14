/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const AssignMissionChefProjet = () => {
    const { idMission } = useParams(); 
    const navigate = useNavigate();
    const [availableChefs, setAvailableChefs] = useState([]);
    const [selectedChef, setSelectedChef] = useState('');
    const [currentChef, setCurrentChef] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [affaireId, setAffaireId] = useState(null);

    useEffect(() => {
        const fetchChefs = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:8080/api/utilisateurs/chefs-de-projet/${userId}`);
                console.log('Chefs de Projet response:', response.data);
                setAvailableChefs(response.data);
            } catch (error) {
                console.error('Error fetching chefs de projet:', error);
            }
        };

        const fetchMission = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/missions/${idMission}`);
                const mission = response.data;
                setAffaireId(mission.affaire.idAffaire);
                if (mission.chefProjet) {
                    setCurrentChef(mission.chefProjet.id_utilisateur);
                    setSelectedChef(mission.chefProjet.id_utilisateur);
                }
            } catch (error) {
                console.error('Error fetching mission:', error);
            }
        };

        fetchChefs();
        fetchMission();
    }, [idMission]);

    const handleChefChange = (e) => {
        setSelectedChef(e.target.value);
    };

    const handleApply = async () => {
        if (selectedChef) {
            try {
                console.log('chef de projet selected',selectedChef)
                await axios.post(`http://localhost:8080/api/mission/chefprojet`, { 
                    mission: { id_mission: idMission }, 
                    chefProjet: { id_utilisateur: selectedChef }
                });
              
                setShowSuccessModal(true);
                console.log('Chef de Projet assigned to mission successfully');
            } catch (error) {
                console.error('Error assigning Chef de Projet to mission:', error);
            }
        } else {
            console.log('Please select a Chef de Projet');
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate(`/afficherMissionCD/${affaireId}`);
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Désignation du Chef de Projet</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <a href="#">
                                        <i className="icon-home" />
                                    </a>
                                </li>
                                <li className="separator">
                                    <i className="icon-arrow-right" />
                                </li>
                                <li className="nav-item">
                                    <a href="#">Gestion des Missions</a>
                                </li>
                                <li className="separator">
                                    <i className="icon-arrow-right" />
                                </li>
                                <li className="nav-item">
                                    <a href="#">Désignation du Chef de Projet</a>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-title" style={{ textAlign: 'left' }}>
                                            Sélectionner le Chef de Projet pour la mission "{idMission}"
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="form-group">
                                            <label htmlFor="chefProjet" className="form-label">Chef de Projet</label>
                                            <select
                                                className="form-select form-control"
                                                id="chefProjet"
                                                value={selectedChef}
                                                onChange={handleChefChange}
                                            >
                                                <option value="">Sélectionner un Chef de Projet</option>
                                                {availableChefs.map((chef) => (
                                                    <option key={chef.id_utilisateur} value={chef.id_utilisateur}>
                                                        {chef.username}_____{chef.email}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="card-action" style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
                                            <button className="btn btn-primary" onClick={handleApply}>
                                                {currentChef ? 'Update' : 'Appliquer'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Succès</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <FaCheckCircle size={50} color="green" />
                    <p className="mt-3">Chef de Projet désigné avec succès pour la mission!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseSuccessModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AssignMissionChefProjet;
