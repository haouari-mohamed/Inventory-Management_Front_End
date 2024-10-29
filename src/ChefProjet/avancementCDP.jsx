import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DecodeJwtService from '../service/DecodeJwtService';
import Sidebar from './components/sideBar';
import MainHeader from './components/mainHeader';
import Footer from './components/footer';
import { useNavigate, useParams } from 'react-router-dom';

const AvancementCDP = () => {
  const navigate = useNavigate();
  const { id_mission } = useParams();

  const [avancements, setAvancements] = useState([]);
  const [formState, setFormState] = useState({
    montantAvancement: '',
    commentaire: '',
    chefProjetId: '',
  });
  const [selectedAvancement, setSelectedAvancement] = useState(null);
  const [updateMode, setUpdateMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mission, setMission] = useState(null);

  useEffect(() => {
    const checkAuthAndInitialize = async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const decodedToken = DecodeJwtService.decodeToken();
        if (!decodedToken) {
          throw new Error('Invalid token');
        }

        setFormState((prev) => ({ ...prev, chefProjetId: decodedToken.id }));
        await fetchMissionDetails();
        await fetchAvancements();
      } catch (error) {
        console.error('Authentication error:', error);
        setErrorMessage('Authentication failed. Please login again.');
        navigate('/login');
      }
    };

    checkAuthAndInitialize();
  }, [id_mission, navigate]);

  const fetchMissionDetails = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const response = await axios.get(`/api/missions/${id_mission}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMission(response.data);
    } catch (error) {
      handleAxiosError(error, 'fetching mission details');
    }
  };

  const fetchAvancements = async () => {
    setLoading(true);
    const token = localStorage.getItem('jwt');
    try {
      const response = await axios.get(`/api/avancements/mission/${id_mission}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvancements(response.data);
    } catch (error) {
      handleAxiosError(error, 'fetching avancements');
    } finally {
      setLoading(false);
    }
  };

  const handleAxiosError = (error, action) => {
    let errorMsg = `Error ${action}.`;
    if (error.response) {
      errorMsg += ` Server error: ${error.response.status}`;
      if (error.response.status === 401) {
        navigate('/login');
      } else if (error.response.data?.message) {
        errorMsg += ` - ${error.response.data.message}`;
      }
    } else if (error.request) {
      errorMsg += ' No response from server. Please check your connection.';
    } else {
      errorMsg += ` Error: ${error.message}`;
    }
    setErrorMessage(errorMsg);
    console.error(`Error ${action}:`, error);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formState.montantAvancement || formState.montantAvancement <= 0) {
      setErrorMessage('The amount must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const token = localStorage.getItem('jwt');
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const userId=localStorage.getItem("userId")
      const payload = {
        ...formState,
        montantAvancement: parseFloat(formState.montantAvancement),
        chefProjet: { id_utilisateur: userId }, 
        mission: { id_mission: id_mission },
      };
console.log("paylod id uti",payload.chefProjet.id_utilisateur)
console.log("paylod id mission",payload.mission.id_mission)
console.log("paylod pr montant",payload.montantAvancement)
      if (updateMode) {
        await axios.put(`/api/avancements/${selectedAvancement.id_avancement}`, payload, config);
      } else {
        await axios.post('/api/avancements', payload);
      }
      resetForm();
      await fetchAvancements();
      setErrorMessage('');
    } catch (error) {
      handleAxiosError(error, updateMode ? 'updating avancement' : 'creating avancement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (avancement) => {
    setFormState({
      montantAvancement: avancement.montantAvancement,
      commentaire: avancement.commentaire || '',
      chefProjetId: avancement.chefProjetId,
    });
    setSelectedAvancement(avancement);
    setUpdateMode(true);
    setErrorMessage('');
  };

  const handleDelete = async (id_avancement) => {
    setLoading(true);
    const token = localStorage.getItem('jwt');
    try {
      await axios.delete(`/api/avancements/${id_avancement}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchAvancements();
    } catch (error) {
      handleAxiosError(error, 'deleting avancement');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormState({
      montantAvancement: '',
      commentaire: '',
      chefProjetId: formState.chefProjetId,
    });
    setUpdateMode(false);
    setSelectedAvancement(null);
    setErrorMessage('');
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="main-panel">
        <MainHeader />
        <div className="container mt-4">
          <div className="page-inner">
            <div className="page-header">
              <h2>Avancements {mission && `- ${mission.libelle_mission}`}</h2>
            </div>

            {errorMessage && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {errorMessage}
                <button type="button" className="close" onClick={() => setErrorMessage('')}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}

            <div className="card">
              <div className="card-header">
                <h4 className="card-title">{updateMode ? 'Modifier' : 'Ajouter'} un avancement</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Montant</label>
                    <input
                      type="number"
                      className="form-control"
                      name="montantAvancement"
                      value={formState.montantAvancement}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Commentaire (optionnel)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="commentaire"
                      value={formState.commentaire}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mr-2" disabled={loading}>
                    {loading ? 'En cours...' : 'Sauvegarder'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Annuler
                  </button>
                </form>
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-header">
                <h4 className="card-title">Liste des avancements</h4>
              </div>
              <div className="card-body">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Montant</th>
                        <th>Commentaire</th>
                        <th>Date insertion</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {avancements.map((avancement) => (
                        <tr key={avancement.id_avancement}>
                          <td>{avancement.montantAvancement}</td>
                          <td>{avancement.commentaire || 'N/A'}</td>
                          <td>{avancement.dateMiseAJour}</td>
                          <td>
                            <button className="btn btn-warning" onClick={() => handleEdit(avancement)}>
                              Modifier
                            </button>
                            <button className="btn btn-danger" onClick={() => handleDelete(avancement.id_avancement)}>
                              Supprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AvancementCDP;
