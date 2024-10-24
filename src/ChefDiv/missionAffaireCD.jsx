import React, { useEffect, useState } from 'react';
import axios from 'axios'; 

const AffairesMissionsDivisions = () => {
    const [affaires, setAffaires] = useState([]);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        const idUser=localStorage.getItem('userId')
        axios.get(`http://localhost:8080/api/missions/missions-divisions/${idUser}`)
            .then(response => {
                setAffaires(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur lors de la récupération des données", error);
                setError("Une erreur s'est produite lors de la récupération des données.");
                setLoading(false);
            });
    }, []);
    

    if (loading) {
        return <p>Chargement en cours...</p>;
    }

    return (
        <div className="container">
            <h2>Liste des Affaires, Missions et Divisions</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Libelle Affaire</th>
                        <th>Date Début</th>
                        <th>Date Fin</th>
                        <th>Part CID</th>
                        <th>Libelle Mission</th>
                        <th>Division Principale</th>
                        <th>Part Division Principale</th>
                        <th>Division Secondaire</th>
                        <th>Part Division Secondaire</th>
                        <th>Sous-traitant</th>
                        <th>Part Sous-traitant</th>
                        <th>Partenaire</th>
                        <th>Part Partenaire</th>
                    </tr>
                </thead>
                <tbody>
                    {affaires.map((affaire, index) => (
                        <tr key={index}>
                            <td>{affaire.libelleAffaire}</td>
                            <td>{affaire.dateDebut}</td>
                            <td>{affaire.dateFin}</td>
                            <td>{affaire.partCID}</td>
                            <td>{affaire.libelleMission}</td>
                            <td>{affaire.nomDivisionPrincipale}</td>
                            <td>{affaire.partDivisionPrincipale}</td>
                            <td>{affaire.divisionSecondaireNom}</td>
                            <td>{affaire.partDivisionSecondaire}</td>
                            <td>{affaire.sousTraitantNom}</td>
                            <td>{affaire.partSousTraitant}</td>
                            <td>{affaire.partenaireNom}</td>
                            <td>{affaire.partPartenaire}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AffairesMissionsDivisions;
