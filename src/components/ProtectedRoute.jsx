import { useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

/**
 * Route component that requires authentication
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute = ({ isAuthenticated }) => {
  const location = useLocation();

  // If user is not authenticated, redirect to login with the current path as redirect
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`} 
        replace 
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;