import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Receipt, Edit, Trash } from "lucide-react";

const EncaissementManager = () => {
  const { idFacture } = useParams();
  const navigate = useNavigate();
  const [encaissements, setEncaissements] = useState([]);
  const [newEncaissement, setNewEncaissement] = useState({
    documentFacture: '',
    dateEncaissement: '',
    montantEncaisse: '',
    idFacture: idFacture
  });

  useEffect(() => {
    fetchEncaissements();
  }, []);

  const fetchEncaissements = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/encaissements');
      setEncaissements(response.data);
    } catch (error) {
      console.error('Error fetching encaissements:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet encaissement ?')) {
      try {
        await axios.delete(`http://localhost:8080/api/encaissements/${id}`);
        fetchEncaissements();
      } catch (error) {
        console.error('Error deleting encaissement:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEncaissement((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/encaissements', newEncaissement);
      setNewEncaissement({
        documentFacture: '',
        dateEncaissement: '',
        montantEncaisse: '',
        idFacture: idFacture
      });
      fetchEncaissements(); 
    } catch (error) {
      console.error('Error adding encaissement:', error);
    }
  };

  const handleNavigateToNewRoute = (id_encaissement) => {
    navigate(`/afficherEncaissement/${id_encaissement}`);
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        <MainHeader />
        <div className="container mx-auto p-4">
          <div className="border rounded-lg mb-4">
            <h2 className="font-medium text-lg p-4">Ajouter un Encaissement</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 p-4">
              <input
                type="text"
                name="documentFacture"
                value={newEncaissement.documentFacture}
                onChange={handleChange}
                placeholder="Document"
                className="border p-2"
                required
              />
              <input
                type="date"
                name="dateEncaissement"
                value={newEncaissement.dateEncaissement}
                onChange={handleChange}
                className="border p-2"
                required
              />
              <input
                type="number"
                name="montantEncaisse"
                value={newEncaissement.montantEncaisse}
                onChange={handleChange}
                placeholder="Montant"
                className="border p-2"
                required
              />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                Ajouter
              </button>
            </form>
          </div>

          <div className="border rounded-lg">
            <h3 className="fw-bold mb-3 p-4">Liste des Encaissements</h3>
            <div className="table-responsive">
              <table className="table table-striped table-hover mt-3">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Facture</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {encaissements.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">Aucun encaissement trouvé.</td>
                    </tr>
                  ) : (
                    encaissements.map((encaissement) => (
                      <tr key={encaissement.id_encaissement}>
                        <td>
                          <div className="flex items-center">
                            <Receipt className="h-4 w-4 mr-2" />
                            {encaissement.documentFacture}
                          </div>
                        </td>
                        <td>{new Date(encaissement.dateEncaissement).toLocaleDateString('fr-FR')}</td>
                        <td>{encaissement.montantEncaisse} DH</td>
                        <td>
                          Facture #{idFacture}
                        </td>
                        <td className="flex gap-2">
                        {/*   <button
                            className="text-blue-600"
                            onClick={() => handleNavigateToNewRoute(encaissement.id_encaissement)}
                          >
                            <FontAwesomeIcon icon={faArrowRight} />
                          </button> */}
                          <button
                            className="text-red-600"
                            onClick={() => handleDelete(encaissement.id_encaissement)}
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EncaissementManager;
