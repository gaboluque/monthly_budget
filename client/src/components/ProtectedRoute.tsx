import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { isAuthenticated } from '../lib/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * A component that protects routes by checking if the user is authenticated.
 * If not authenticated, it redirects to the specified path (default: /login).
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/login',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isAuthenticated()) {
      // Redirect to login page with the return url
      navigate(
        `${redirectTo}?returnUrl=${encodeURIComponent(location.pathname)}`,
        { replace: true }
      );
    }
  }, [navigate, redirectTo, location.pathname, isClient]);

  // During server-side rendering or before client-side hydration, render a loading state or null
  if (!isClient) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  // If not authenticated on the client side, render nothing while redirecting
  if (!isAuthenticated()) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  // If authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute; 