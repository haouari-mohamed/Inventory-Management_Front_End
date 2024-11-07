import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Plus, Download, XCircle } from "lucide-react";
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';

const FacturationManager = () => {
  const { idMissionf } = useParams();
  const [facturations, setFacturations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [downloadError, setDownloadError] = useState('');
  const [formData, setFormData] = useState({
    montantFacture: '',
    documentFacture: '',
    dateFacturation: '',
    mission: { id_mission: idMissionf },
    file: null 
  });

  useEffect(() => {
    fetchFacturations();
  }, []);

  const fetchFacturations = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/facturations/bymission/1`);
      setFacturations(response.data);
    } catch (error) {
      console.error('Error fetching facturations:', error);
    }
  };

  

  const handleDownload = async (id_facture) => {
    console.log("Downloading file for facture ID:", id_facture);
    try {
      const response = await axios({
        url: `http://localhost:8080/api/facturations/download/${id_facture}`, 
        method: 'GET',
        responseType: 'blob',
      });
      console.log("i think the problem here ")
      console.log(response.data)
  
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '') 
        : 'downloaded_file';
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
  
      window.URL.revokeObjectURL(url);
      setDownloadError('');
    } catch (error) {
      console.error('Error downloading file:', error);
      setDownloadError('Erreur lors du téléchargement du fichier. Veuillez réessayer plus tard.');
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
    formDataToSend.append('id_mission', idMissionf);
    if (formData.file) {
      formDataToSend.append('file', formData.file);
    }

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
      mission: { id_mission: idMissionf },
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
      id_mission: idMissionf,
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
                className=" btn btn-primary flex items-center bg-blue-600 text-black py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Facturation
              </button>
            </div>

            {downloadError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 flex items-center">
                <XCircle className="h-4 w-4 mr-2" />
                <span>{downloadError}</span>
                <button 
                  className="absolute top-0 right-0 p-2"
                  onClick={() => setDownloadError('')}
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            )}
            
            {isOpen && (
             <form onSubmit={handleSubmit} className="space-y-4 mt-4 ">
              <div className="d-flex ">
              <div className="flex flex-col md:flex-row items-center md:space-x-4">
               <div className="flex-1">
                 <label className="block text-sm font-medium mb-1">Montant de la Facture</label>
                 <input
                   type="number"
                   value={formData.montantFacture}
                   onChange={(e) => setFormData({ ...formData, montantFacture: e.target.value })}
                   required
                   className="border rounded-lg p-2 w-full"
                 />
               </div>
               <div className="mt-2 flex-1">
                 <label className="block text-sm font-medium mb-1">Document de la Facture</label>
                 <input
                   type="file"
                   onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                   required
                   className="border rounded-lg p-2 w-full"
                 />
               </div>
             </div>
             <div className="flex-1">
               <label className="block text-sm font-medium mb-1">Date de Facturation</label>
               <input
                 type="date"
                 value={formData.dateFacturation}
                 onChange={(e) => setFormData({ ...formData, dateFacturation: e.target.value })}
                 required
                 className="border rounded-lg p-2 w-full"
               />
             </div>

              </div>
            
             <button
               type="submit"
               className="btn btn-primary bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
             >
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
                        <td>
                        <button
                            onClick={() => handleDownload(facture.id_facture)} 
                            className="flex items-center text-blue-600 border-0 hover:text-blue-800 text-primary"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            {facture.documentFacture}
                          </button>

                        </td>
                        <td>{facture.dateFacturation}</td>
                        <td>
                          <button 
                            onClick={() => handleOpenModal(facture)}
                            className="btn btn-success bg-blue-600 text-black rounded-md px-4 py-2 hover:bg-blue-700 transition duration-300 rounded"
                          >
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