import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import DecodeJwtService from './DecodeJwtService';

const AuthGuard = ({ role: requiredRole }) => {
  const token = localStorage.getItem('jwt');

  if (!token) {
    return <Navigate to="/login" />;
  }

  const userRole = DecodeJwtService.getRoleFromToken(token);

  if (userRole === requiredRole) {
    return <Outlet />;
  } else {
    localStorage.removeItem('jwt');
    return <Navigate to="/login" />;
  }
};

export default AuthGuard;
