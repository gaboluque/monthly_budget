import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { isAuthenticated } from '../lib/utils/auth';

export const meta: MetaFunction = () => {
  return [
    { title: 'Monthly Budget' },
    { name: 'description', content: 'Manage your finances with ease' },
  ];
};

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    if (isAuthenticated()) {
      // If authenticated, redirect to dashboard
      navigate('/dashboard');
    } else {
      // If not authenticated, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // Return a loading state while redirecting
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-700">Redirecting...</h2>
        <p className="mt-2 text-gray-500">Please wait while we redirect you to the appropriate page.</p>
      </div>
    </div>
  );
}
