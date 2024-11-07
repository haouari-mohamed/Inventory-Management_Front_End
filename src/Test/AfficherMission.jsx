import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AfficherAffaireTest from './AfficherAffaire.jsx';
import './MissionAffaire.css'; 

const AfficherMissionTest = () => {
   const { affaireId } = useParams();
   const [affaire, setAffaire] = useState(null);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState('');

   const fetchAffaire = async () => {
      try {
         setLoading(true);
         const response = await axios.get(`http://localhost:8080/api/affaires/${affaireId}`);
         setAffaire(response.data);
         setLoading(false);
      } catch (err) {
         console.error('Error fetching affaire:', err);
         setError('Erreur lors de la récupération de l\'affaire');
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAffaire();
   }, [affaireId]);

   if (loading) return <p>Chargement en cours...</p>;
   if (error) return <p>{error}</p>;
   if (!affaire) return <p>Aucune affaire trouvée.</p>;

   return (
      <div className="container">
         <div className="sidebar">
            <AfficherAffaireTest />
         </div>
         <div className="content">
            <h2>Détails de l'Affaire</h2>
            <p><strong>ID de l'affaire :</strong> {affaire.idAffaire}</p>
            <p><strong>Libellé :</strong> {affaire.libelle_affaire}</p>
            <p><strong>Prix Global :</strong> {affaire.prixGlobal} MAD</p>
            <p><strong>Status :</strong> {affaire.statusAffaire}</p>
            <p><strong>Numéro de Marché :</strong> {affaire.marche}</p>
            <p><strong>Date de Début :</strong> {new Date(affaire.dateDebut).toLocaleDateString()}</p>
            <p><strong>Date de Fin :</strong> {new Date(affaire.dateFin).toLocaleDateString()}</p>
            {affaire.dateArret && (
               <p><strong>Date d'Arrêt :</strong> {new Date(affaire.dateArret).toLocaleDateString()}</p>
            )}
            {affaire.dateRecommencement && (
               <p><strong>Date de Recommencement :</strong> {new Date(affaire.dateRecommencement).toLocaleDateString()}</p>
            )}
            <p><strong>Client :</strong> {affaire.client?.nom}</p>
            <p><strong>Pôle Principal :</strong> {affaire.polePrincipale?.nom}</p>
            <p><strong>Division Principale :</strong> {affaire.divisionPrincipale?.nom}</p>
            <p><strong>Part CID :</strong> {affaire.partCID}</p>
            <p><strong>Chef de Projet :</strong> {affaire.chefProjet?.nom}</p>
         </div>
      </div>
   );
};

export default AfficherMissionTest;
