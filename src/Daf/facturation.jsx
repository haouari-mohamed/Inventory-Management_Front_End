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
    idMission: idMissionf 
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
  
    try {
      const response = await axios({
        method: method,
        url: url,
        data: {
          montantFacture: formData.montantFacture,
          documentFacture: formData.documentFacture,
          dateFacturation: formData.dateFacturation,
          mission: { id_mission: formData.idMission }
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
      idMission: idMissionf
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
      montantFacture: facture ?  facture.montantFacture : '',
      documentFacture: facture ? facture.documentFacture : '',
      dateFacturation: facture ? facture.dateFacturation : '',
      idMission: idMissionf
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
                className="flex items-center bg-blue-700 text-blue py-2 px-4 rounded"
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
                    type="text"
                    value={formData.documentFacture}
                    onChange={(e) => setFormData({ ...formData, documentFacture: e.target.value })}
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
                <button type="submit" className="bg-green-500 text-blue py-2 px-4 rounded">
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
          <th>ID Facture</th>
          <th>Document de Facture</th>
          <th>Montant</th>
          <th>Date de Facturation</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {facturations.length > 0 ? (
          facturations.map((facture) => (
            <tr key={facture.id_facture}>
              <td>{facture.id_facture}</td>
              <td>{facture.documentFacture}</td>
              <td>{facture.montantFacture}</td>
              <td>{facture.dateFacturation}</td>
              <td>
                <button onClick={() => handleOpenModal(facture)} className="text-blue-500 ml-2">
                  Modifier
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">Aucune donnée trouvée.</td>
          </tr>
        )}
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
