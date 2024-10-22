import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import DecodeJwtService from '../DecodeJwtService';

const AuthGuard = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('jwt');
  
  if (!token) {
    // Redirect to login if there's no token
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const userRole = DecodeJwtService.getRoleFromToken(token);
    const currentPath = location.pathname;
    
    // Check if user is authorized to access this path
    if (!isAuthorized(currentPath, userRole)) {
      // Redirect to appropriate home page based on role
      const homePage = getHomePageForRole(userRole);
      return <Navigate to={homePage} replace />;
    }

    // User is authorized, render the protected component
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
    case 'ROLE_ADMIN':
      if (path.startsWith('/admin') || 
          path === '/HomeAdmin' || 
          path === '/profileAdmin' ||
          path.includes('/afficher') || 
          path.includes('/add')) {
        return true;
      }
      break;

    case 'ROLE_CADRE_ADMIN':
      if (path.includes('CA') || 
          path === '/HomeCA' || 
          path === '/profileCA' ||
          path === '/afficherClient') {
        return true;
      }
      break;

    case 'ROLE_CHEF_POLE':
      if (path.includes('CP') || 
          path === '/HomeCP' || 
          path === '/profileCP') {
        return true;
      }
      break;

    case 'ROLE_CHEF_DIVISION':
      if (path.includes('CD') || 
          path === '/HomeCD' || 
          path === '/profileCD') {
        return true;
      }
      break;

    case 'ROLE_CHEF_PROJET':
      if (path.includes('CDP') || 
          path === '/HomeCDP' || 
          path === '/profileCDP') {
        return true;
      }
      break;
  }

  return false;
};

const getHomePageForRole = (role) => {
  switch (role) {
    case 'ROLE_ADMIN':
      return '/HomeAdmin';
    case 'ROLE_CADRE_ADMIN':
      return '/HomeCA';
    case 'ROLE_CHEF_POLE':
      return '/HomeCP';
    case 'ROLE_CHEF_DIVISION':
      return '/HomeCD';
    case 'ROLE_CHEF_PROJET':
      return '/HomeCDP';
    default:
      return '/login';
  }
};

export default AuthGuard;