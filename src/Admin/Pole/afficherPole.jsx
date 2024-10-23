import React, { useState, useEffect, useMemo } from 'react';
import apiClient from '../../../src/service/Intercepteur'; // Use the apiClient instead of axios
import { Button, Modal, Form, Table, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHome,
    faArrowRight,
    faEdit,
    faTimes,
    faPlus,
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../components/sideBar';
import MainHeader from '../components/mainHeader';
import Footer from '../components/footer';

const AfficherPole = () => {
    const [poles, setPoles] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingPole, setEditingPole] = useState(null);
    const [deletingPole, setDeletingPole] = useState(null);
    const [newPole, setNewPole] = useState({ libelle_pole: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showCascadeDeleteModal, setShowCascadeDeleteModal] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    useEffect(() => {
        fetchPoles();
    }, []);

    const fetchPoles = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get('/api/poles'); 
            setPoles(response.data);
        } catch (error) {
            console.error('Error fetching poles:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredPoles = useMemo(() => {
        return poles.filter(pole => 
            pole.libelle_pole.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [poles, searchTerm]);

    const handleEditPole = (pole) => {
        setEditingPole(pole);
        setShowEditModal(true);
    };

    const handleUpdatePole = async () => {
        try {
            await apiClient.put(`/api/poles/${editingPole.id_pole}`, editingPole); // Use apiClient instead of axios
            fetchPoles();
            setShowEditModal(false);
        } catch (error) {
            console.error('Error updating pole:', error);
        }
    };

    const handleDeletePole = (pole) => {
        setDeletingPole(pole);
        setShowDeleteModal(true);
    };

    const confirmDeletePole = async () => {
        try {
            const response = await apiClient.delete(`/api/poles/${deletingPole.id_pole}`); // Use apiClient instead of axios
            if (response.status === 200) {
                fetchPoles();
                setShowDeleteModal(false);
                setShowCascadeDeleteModal(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setDeleteError(error.response.data);
                setShowDeleteModal(false);
                setShowCascadeDeleteModal(true);
            } else {
                console.error('Error deleting pole:', error);
            }
        }
    };

    const confirmCascadeDelete = async () => {
        try {
            await apiClient.delete(`/api/poles/${deletingPole.id_pole}/cascade`); // Use apiClient instead of axios
            fetchPoles();
            setShowCascadeDeleteModal(false);
        } catch (error) {
            console.error('Error performing cascade delete:', error);
        }
    };

    const handleAddPole = async () => {
        try {
            await apiClient.post('/api/poles', newPole); // Use apiClient instead of axios
            fetchPoles();
            setShowAddModal(false);
            setNewPole({ libelle_pole: '' });
        } catch (error) {
            console.error('Error adding pole:', error);
        }
    };

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan="3" className="text-center">Chargement...</td>
                </tr>
            );
        }

        return filteredPoles.map((pole) => (
            <tr key={pole.id_pole}>
                <td>{pole.id_pole}</td>
                <td>{pole.libelle_pole}</td>
                <td>
                    <Button variant="link" className="btn-primary" onClick={() => handleEditPole(pole)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="link" className="btn-danger" onClick={() => handleDeletePole(pole)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="wrapper">
            <Sidebar />
            <div className="main-panel">
                <MainHeader onSearch={handleSearch} />
                <div className="container">
                    <div className="page-inner">
                        <div className="page-header">
                            <h3 className="fw-bold mb-3">Gestion des Pôles</h3>
                            <ul className="breadcrumbs mb-3">
                                <li className="nav-home">
                                    <span><FontAwesomeIcon icon={faHome} /></span>
                                </li>
                                <li className="separator">
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </li>
                                <li className="nav-item">
                                    <span>Gestion des Pôles</span>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h4 className="card-title mb-0">Liste des Pôles</h4>
                                        <Button
                                            variant="primary"
                                            onClick={() => setShowAddModal(true)}
                                            className="btn-lg"
                                        >
                                            <FontAwesomeIcon icon={faPlus} /> Ajouter un pôle
                                        </Button>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <Table className="table table-striped table-hover mt-3">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>Libellé du Pôle</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {renderTableContent()}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>

                {/* Add Pole Modal */}
                <Modal 
                    show={showAddModal} 
                    onHide={() => setShowAddModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Ajouter un nouveau pôle</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Libellé du pôle</Form.Label>
                            <Form.Control
                                type="text"
                                value={newPole.libelle_pole}
                                onChange={(e) => setNewPole({ ...newPole, libelle_pole: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={handleAddPole}>
                            Ajouter
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Edit Modal */}
                <Modal 
                    show={showEditModal} 
                    onHide={() => setShowEditModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Modifier le pôle</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                            <Form.Label>Libellé du pôle</Form.Label>
                            <Form.Control
                                type="text"
                                value={editingPole?.libelle_pole || ''}
                                onChange={(e) => setEditingPole({ ...editingPole, libelle_pole: e.target.value })}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="primary" onClick={handleUpdatePole}>
                            Sauvegarder
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Delete Confirmation Modal */}
                <Modal 
                    show={showDeleteModal} 
                    onHide={() => setShowDeleteModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Supprimer le pôle</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Êtes-vous sûr de vouloir supprimer ce pôle ?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={confirmDeletePole}>
                            Supprimer
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Cascade Delete Confirmation Modal */}
                <Modal 
                    show={showCascadeDeleteModal} 
                    onHide={() => setShowCascadeDeleteModal(false)}
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Suppression en cascade</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {deleteError ? (
                            <Alert variant="danger">
                                {deleteError}
                            </Alert>
                        ) : (
                            "Êtes-vous sûr de vouloir supprimer ce pôle et toutes ses dépendances ?"
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowCascadeDeleteModal(false)}>
                            Annuler
                        </Button>
                        <Button variant="danger" onClick={confirmCascadeDelete}>
                            Supprimer tout
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default AfficherPole;
