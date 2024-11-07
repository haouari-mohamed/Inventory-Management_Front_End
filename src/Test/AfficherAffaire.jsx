import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sidebar.css'; 
import { useNavigate } from 'react-router-dom';
import AfficherMissionTest from './AfficherMission';

const AfficherAffaireTest = () => {
   const [affaires, setAffaires] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');
   const navigate = useNavigate();

   const fetchAffaires = async () => {
      try {
         setLoading(true);
         const response = await axios.get('http://localhost:8080/api/affaires');
         setAffaires(response.data);
         setLoading(false);
         console.log(response.data)
      } catch (err) {
         console.error('Error fetching affaires:', err);
         setError('Error fetching affaires');
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAffaires();
   }, []);

   const handleAffaireClick = (idAffaire) => {
   
      navigate(`/affaires/${idAffaire}/mission`);
   };

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
                     onClick={() => handleAffaireClick(affaire.idAffaire)}
                  >
                     {affaire.idAffaire}
                  </li>
               ))}
            </ul>
         </div>
         

         

       
         <div className=" right-sidebar">
            <h2 className="sidebar-title">Détails de l'Affaire</h2>
            
            
         </div>
      </div>
   );
};

export default AfficherAffaireTest;
