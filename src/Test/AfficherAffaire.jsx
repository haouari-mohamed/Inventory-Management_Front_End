import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sidebar.css'; // Assurez-vous de créer ce fichier CSS

const AfficherAffaireTest = () => {
   const [affaires, setAffaires] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const [selectedAffaire, setSelectedAffaire] = useState(null); // Pour suivre l'affaire sélectionnée

   const fetchAffaires = async () => {
      try {
         setLoading(true);
         const response = await axios.get('http://localhost:8080/api/affaires');
         setAffaires(response.data);
         setLoading(false);
      } catch (err) {
         console.error('Error fetching affaires:', err);
         setError('Error fetching affaires');
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAffaires();
   }, []);

   return (
      <div className="cont">
         <div className=" left-sidebar">
            <h2 className="sidebar-title">Liste des Affaires</h2>
            {loading && <p>Chargement en cours...</p>}
            {error && <p>{error}</p>}
            <ul className="sidebar-list">
               {affaires.map((affaire, index) => (
                  <li
                     key={index}
                     className="sidebar-item"
                     onClick={() => setSelectedAffaire(affaire.idAffaire)}
                  >
                     {affaire.idAffaire}
                  </li>
               ))}
            </ul>
         </div>

       
         <div className=" right-sidebar">
            <h2 className="sidebar-title">Détails de l'Affaire</h2>
            {selectedAffaire ? (
               <p className="affaire-detail">Numéro de l'affaire : {selectedAffaire}</p>
            ) : (
               <p className="affaire-detail">Sélectionnez une affaire</p>
            )}
         </div>
      </div>
   );
};

export default AfficherAffaireTest;
