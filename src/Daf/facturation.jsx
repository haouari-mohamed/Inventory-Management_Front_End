import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Plus } from "lucide-react";
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const FacturationManager = () => {
  const { idMissionf } = useParams();
  const [facturations, setFacturations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [formData, setFormData] = useState({
    montantFacture: '',
    documentFacture: '',
    dateFacturation: '',
    id_mission: idMission,
    file: null 

  });

  useEffect(() => {
    fetchFacturations();
  }, []);

  const fetchFacturations = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/facturations/bymission/${idMissionf}`);
      setFacturations(response.data);
    } catch (error) {
      console.error('Error fetching facturations:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = selectedFacture 
      ? `http://localhost:8080/api/facturations/${selectedFacture.id_facture}` 
      : 'http://localhost:8080/api/facturations';
    
    const method = selectedFacture ? 'PUT' : 'POST';

    const formDataToSend = new FormData();
    formDataToSend.append('montantFacture', formData.montantFacture);
    formDataToSend.append('dateFacturation', formData.dateFacturation);
    formDataToSend.append('id_mission', formData.id_mission);
    if (formData.file) {
        formDataToSend.append('file', formData.file);
    }
    
    console.log(formDataToSend)

    try {
      const response = await axios({
        method: method,
        url: url,
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        fetchFacturations(); 
        handleCloseModal();
        resetForm();
      } else {
        console.error('Error updating facturation:', response.data);
      }
    } catch (error) {
      console.error('Error saving facturation:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      montantFacture: '',
      documentFacture: '',
      dateFacturation: '',
      id_mission: idMission,
      file: null

    });
    setSelectedFacture(null);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleOpenModal = (facture = null) => {
    setSelectedFacture(facture);
    setFormData({
      montantFacture: facture ? facture.montantFacture : '',
      documentFacture: facture ? facture.documentFacture : '',
      dateFacturation: facture ? facture.dateFacturation : '',
      id_mission: idMission,
      file: null 

    });
    setIsOpen(true);
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        <MainHeader />
        <div className="container mx-auto p-4">
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Gestion des Facturations</h2>
              <button 
                onClick={() => handleOpenModal()} 
                className="flex items-center bg-blue-600 text-black py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Facturation
              </button>
            </div>
            
            {isOpen && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Montant de la Facture</label>
                  <input
                    type="number"
                    value={formData.montantFacture}
                    onChange={(e) => setFormData({ ...formData, montantFacture: e.target.value })}
                    required
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Document de la Facture</label>
                  <input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    required
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date de Facturation</label>
                  <input
                    type="date"
                    value={formData.dateFacturation}
                    onChange={(e) => setFormData({ ...formData, dateFacturation: e.target.value })}
                    required
                    className="border rounded-md p-2 w-full"
                  />
                </div>
                <button type="submit" className="bg-blue-600 text-black py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                  {selectedFacture ? 'Modifier' : 'Créer'} la Facturation
                </button>
              </form>
            )}
            
            <div className="mt-4">
              <h3 className="fw-bold mb-3">Liste des Facturations</h3>
              <div className="table-responsive">
                <table className="table table-striped table-hover mt-3">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Montant</th>
                      <th>Document</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facturations.map((facture) => (
                      <tr key={facture.id_facture}>
                        <td>{facture.id_facture}</td>
                        <td>{facture.montantFacture}</td>
                        <td>{facture.documentFacture}</td>
                        <td>{facture.dateFacturation}</td>
                        <td>
                          <button onClick={() => handleOpenModal(facture)} 
                                  className="bg-blue-600 text-black rounded-md px-4 py-2 hover:bg-blue-700 
                                             transition duration-300">
                            Modifier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default FacturationManager;
