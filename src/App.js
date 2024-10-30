import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AffaireProvider } from './context/AffaireContext';
import PageMeta from './PageMeta';
import { UserProvider, useUser } from './context/UserContext';
import AuthGuard from'./service/Guard/AuthGuard';
// Import views
import Login from './views/login';
import HomeCA from './CadreAdmin/homeCA';
import AddAffaireCA from './CadreAdmin/addAffaireCA';
import AfficherAffaireCA from './CadreAdmin/afficherAffaireCA';
import AddMissionCA from './CadreAdmin/addMissionCA';
import AfficherMissionCA from './CadreAdmin/afficherMissionCA';
import HomeCP from './ChefPole/homeCP';
import AfficherAffaireCP from './ChefPole/afficherAffaireCP';
import AfficherMissionCP from './ChefPole/afficherMissionCP'
import HomeCD from './ChefDiv/homeCD';
import AfficherAffaireCD from './ChefDiv/afficherAffaireCD';
import RepartirMissionCD from './ChefDiv/repartitionMissionCD';
import AfficherMissionCD from './ChefDiv/afficherMissionCD';
import DesignationChefProjetCD from './ChefDiv/designationChefProjetCD';
import HomeCDP from './ChefProjet/homeCDP';
import AfficherAffaireCDP from './ChefProjet/afficherAffaireCDP';
import AfficherMissionCDP from './ChefProjet/afficherMissionCDP';
import ConsultMissionCDP from './ChefProjet/consultMissionCDP';
import AfficherUnite from './Admin/Unite/afficherUnite'
import AfficherRole from './Admin/Role/afficherRole';
import AfficherUser from './Admin/Utilisateur/afficherUser';
import AddUser from './Admin/Utilisateur/addUser';
import AfficherPole from './Admin/Pole/afficherPole';
import AfficherDivision from './Admin/Division/afficherDivision'
import AfficherClient from './CadreAdmin/Client/afficherClient'
import AfficherPays from './Admin/Pays/afficherPays'
import AfficherSousTraitant from './Admin/SousTraitant/afficherST'
import AfficherPartenaire from './Admin/Partenaire/afficherPartenaire'
import HomeAdmin from './Admin/HomeAdmin';
import ProfilePageCA from './CadreAdmin/profileCA';
import ProfilePageAdmin from './Admin/profileAdmin';
import ProfilePageCP from './ChefPole/profileCP';
import ProfilePageCD from './ChefDiv/profileCD';
import ProfilePageCDP from './ChefProjet/profileCDP';
import AffairesMissionsDivisions from './ChefDiv/missionAffaireCD';
import AvancementCDP from './ChefProjet/avancementCDP';
import Test from './ChefProjet/components/test';
import AfficherMissionprCD from './ChefDiv/afficherMissionprCD';
import AssignMissionChefProjetCD from './ChefDiv/assignMissionChefProjetCD';
import AfficherMissionCDPC from './ChefProjet/afficherMissionCDPC';
import detailsMissionPartSecondaire from './ChefProjet/detailsMissionPartSecondaire';
import AfficherAffaire from './Daf/afficherAffaire';
import AfficherAffaireDA from './Daf/afficherAffaire';
import AfficherMissionDA from './Daf/afficherMission';
import FacturationManager from './Daf/facturation';
import FacturationManagerRE from './Recouverement/facturationRE';
import EncaissementManager from './Recouverement/encaisementRE';


function LogoutComponent() {
  const { setUser } = useUser();

  React.useEffect(() => {
    setUser(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('jwt')
  }, [setUser]);

  return <Navigate to="/login" />;
}

function RootRedirect() {
  return <Navigate to="/login" replace />;
}

const routes = [

  { path: '/test', element: Test, title: 'Test', public: true },

  { path: '/login', element: Login, title: 'Login', public: true },
  { path: '/HomeCA', element: HomeCA, title: 'Accueil - CID', public: false },
  { path: '/addAffaireCA', element: AddAffaireCA, title: 'Ajouter Affaire - CID' },
  { path: '/afficherAffaireCA', element: AfficherAffaireCA, title: 'Afficher Affaire - CID' },
  { path: '/AddMissionCA', element: AddMissionCA, title: 'Ajouter Mission - CID' },
  { path: '/AfficherMissionCA', element: AfficherMissionCA, title: 'Afficher Mission - CID' },
  { path: '/HomeCP', element: HomeCP, title: 'Accueil - CID' },
  { path: '/afficherAffaireCP', element: AfficherAffaireCP, title: 'Afficher Affaire - CID' },
  { path: '/afficherMissionCP/:affaireId', element: AfficherMissionCP, title: 'Afficher Mission - CID' }, 
  { path: '/HomeCD', element: HomeCD, title: 'Accueil - CID' },
  { path: '/assignMissionChefProjetCD/:idMission', element: AssignMissionChefProjetCD, title: 'Assign Mission - CID' },
  { path: '/missionAffaire', element:AffairesMissionsDivisions , title: 'Mission Affaire - CID', public:true },
  { path: '/afficherAffaireCD', element: AfficherAffaireCD, title: 'Afficher Affaire - CID' },
  { path: '/repartirMissionCD/:idMission', element: RepartirMissionCD, title: 'Répartir les Missions - CID' },
  { path: '/afficherMissionCD/:affaireId', element: AfficherMissionCD, title: 'Afficher Mission - CID', public:true },
  { path: '/afficherMissionpCD/:affaireId', element: AfficherMissionprCD, title: 'Afficher Mission - CID', public:true },
  { path: '/designationChefProjetCD/:idAffaire', element: DesignationChefProjetCD, title: 'Designation de Chef de Projet - CID' },
  { path: '/HomeCDP', element: HomeCDP, title: 'Accueil - CID' },

  { path: '/avancementCDP/:id_mission', element: AvancementCDP, title: 'Avancement - CID', public: true },

  /* { path: '/avancementCDP', element: AvancementCDP, title: 'Avancement - CID',public:true }, */
  { path: '/afficherAffaireDA', element: AfficherAffaireDA, title: 'Afficher affaires DAF - CID',public:true },
  { path: '/afficherMissionDA/:idAffaire', element: AfficherMissionDA, title: 'Afficher mission DAF - CID',public:true },
  { path: '/afficherFacturationDA/:idMission', element: FacturationManager, title: 'Afficher facturation DAF - CID',public:true },
  { path: '/afficherFacturationRE', element: FacturationManagerRE, title: 'Afficher facturation RECOUVREMENT - CID',public:true },
  { path: '/afficherEncaisementRE/:idFacture', element: EncaissementManager, title: 'Afficher encaisement RECOUVREMENT - CID',public:true },



  { path: '/afficherAffaireCDP', element: AfficherAffaireCDP, title: 'Afficher Affaire - CID' },
  { path: '/afficherMissionCDP/:idAffaire', element: AfficherMissionCDP, title: 'Afficher Mission - CID' },
  { path: '/afficherMissionCDPC/:idAffaire', element: AfficherMissionCDPC, title: 'Afficher Mission - CID' },
  { path: '/detailsmissionpsc/:id', element: detailsMissionPartSecondaire, title: 'Afficher Details Mission - CID' ,public:true},
  { path: '/consultMissionCDP/:idMission', element: ConsultMissionCDP, title: 'Consulter Mission - CID' },
  { path: '/afficherUnite', element: AfficherUnite, title: 'Gestion des Unités - CID' },
  { path: '/afficherRole', element: AfficherRole, title: 'Gestion des Roles - CID' },
  { path: '/afficherUser', element: AfficherUser, title: 'Gestion des Utilisateurs - CID',public:true },
  { path: '/addUser', element: AddUser, title: 'Gestion des Utilisateurs - CID' ,public:true},
  { path: '/afficherPole', element: AfficherPole, title: 'Gestion des Poles - CID' },
  { path: '/afficherDivision', element: AfficherDivision, title: 'Gestion des Divisions - CID' },
  { path: '/afficherClient', element: AfficherClient, title: 'Gestion des Clients - CID' },
  { path: '/afficherPays', element: AfficherPays, title: 'Gestion des Pays - CID' },
  { path: '/afficherSousTraitant', element: AfficherSousTraitant, title: 'Gestion des Sous-traitants - CID' },
  { path: '/afficherPartenaire', element: AfficherPartenaire, title: 'Gestion des Partenaires - CID' },
  { path: '/HomeAdmin', element: HomeAdmin, title: 'Accueil - CID' },
  { path: '/profileCA', element: ProfilePageCA, title: 'Profile - CID' },
  { path: '/logout', element: LogoutComponent, title: 'Logout', public: true },
  { path: '/profileAdmin', element: ProfilePageAdmin, title: 'Profile - CID' },
  { path: '/profileCP', element: ProfilePageCP, title: 'Profile - CID' },
  { path: '/profileCD', element: ProfilePageCD, title: 'Profile - CID' },
  { path: '/profileCDP', element: ProfilePageCDP, title: 'Profile - CID' },
];

function App() {
    return (
      <UserProvider>
        <AffaireProvider>
          <Router>
            <Routes>
              {routes.map(({ path, element: Element, title, public: isPublic }) => (
                <Route 
                  key={path} 
                  path={path} 
                  element={
                    isPublic ? (
                      <>
                        <PageMeta title={title} />
                        <Element />
                      </>
                    ) : (
                      <AuthGuard>
                        <PageMeta title={title} />
                        <Element />
                      </AuthGuard>
                    )
                  } 
                />
              ))}
              <Route path="/" element={<RootRedirect />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
              

            </Routes>
          </Router>
        </AffaireProvider>
      </UserProvider>
    );
  }
  
  export default App;
