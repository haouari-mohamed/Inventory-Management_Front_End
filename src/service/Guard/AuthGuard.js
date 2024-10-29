import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import DecodeJwtService from '../DecodeJwtService';

const AuthGuard = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('jwt');
  
  if (!token) {
    
    localStorage.removeItem('jwt');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const userRole = DecodeJwtService.getRoleFromToken(token);
    const currentPath = location.pathname;
    
   
    if (!isAuthorized(currentPath, userRole)) {
    
      const homePage = getHomePageForRole(userRole);
      return <Navigate to={homePage} replace />;
    }

   
    return children;
  } catch (error) {
    console.error('Token validation error:', error);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

const isAuthorized = (path, role) => {
  // Public routes accessible to all
  if (path === '/login' || path === '/logout') {
    return true;
  }
  

  switch (role) {
    case 'ADMIN':
      if (path.startsWith('/admin') || 
          path === '/HomeAdmin' || 
          path === '/profileAdmin' ||
          path.includes('/afficher') || 
          path.includes('/add') ) {
        return true;
      }
      break;

    case 'CADRE_ADMINISTRATIF':
      if (path.includes('CA') || 
          path === '/HomeCA' || 
          path === '/profileCA' ||
          path === '/afficherClient') {
        return true;
      }
      break;

    case 'CHEF_POLE':
      if (path.includes('CP') || 
          path === '/HomeCP' || 
          path === '/profileCP') {
        return true;
      }
      break;

    case 'DIRECTEUR_DIVISION':
      if (path.includes('CD') || 
          path === '/HomeCD' || 
          path === '/profileCD') {
        return true;
      }
      break;

    case 'CHEF_PROJET':
      if (path.includes('CDP') || 
          path === '/HomeCDP' || 
          path === '/profileCDP'||
          path == '/avancement' ){
        return true;
      }
      break;
  }

  return false;
};

const getHomePageForRole = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/HomeAdmin';
    case 'CADRE_ADMINISTRATIF':
      return '/HomeCA';
    case 'CHEF_POLE':
      return '/HomeCP';
    case 'DIRECTEUR_DIVISION':
      return '/HomeCD';
    case 'CHEF_PROJET':
      return '/HomeCDP';
    default:
      return '/login';
  }
};

export default AuthGuard;