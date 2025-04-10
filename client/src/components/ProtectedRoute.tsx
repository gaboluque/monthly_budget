import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getUser, isAuthenticated } from '../lib/utils/auth';

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

  useEffect(() => {
    if (!isAuthenticated()) {
      // Redirect to login page with the return url
      navigate(
        `${redirectTo}?returnUrl=${encodeURIComponent(location.pathname)}`,
        { replace: true }
      );
    }
  }, [navigate, redirectTo, location.pathname]);

  useEffect(() => {
    const user = getUser();

    if (isAuthenticated() && !user?.onboarding_completed_at) {
      navigate('/onboarding');
    }
  }, [navigate]);

  // During server-side rendering or before client-side hydration, render a loading state or null
  if (!isAuthenticated()) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  // If authenticated, render the children
  return <>{children}</>;
};

export default ProtectedRoute; 