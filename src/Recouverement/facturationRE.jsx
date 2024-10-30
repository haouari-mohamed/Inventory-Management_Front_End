import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const FacturationManagerRE = () => {
   const navigate = useNavigate();
  const [facturations, setFacturations] = useState([]);

  useEffect(() => {
    fetchFacturations();
  }, []);

  const fetchFacturations = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/facturations');
      setFacturations(response.data);
    } catch (error) {
      console.error('Error fetching facturations:', error);
    }
  };
  const handleNavigateToNewRoute = (id_facture) => {
   navigate(`/afficherEncaisementRE/${id_facture}`);
};

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        <MainHeader />
        <div className="container mx-auto p-4">
          <div className="border rounded-md p-4">
            <h3 className="fw-bold mb-3">Liste des Facturations</h3>
            <div className="table-responsive">
              <table className="table table-striped table-hover mt-3">
                <thead>
                  <tr>
                    <th>ID Facture</th>
                    <th>Document de Facture</th>
                    <th>Montant</th>
                    <th>Date de Facturation</th>
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
                        <button variant="link" onClick={() => handleNavigateToNewRoute(facture.id_facture)}>
                              <FontAwesomeIcon icon={faArrowRight} />
                        </button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">Aucune donnée trouvée.</td>
                    </tr>
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

export default FacturationManagerRE;
