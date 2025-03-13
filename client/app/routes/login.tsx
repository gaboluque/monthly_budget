import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { LoginForm } from '../components/LoginForm';
import { isAuthenticated, setToken } from '../lib/utils/auth';
import { authApi } from '../lib/api/auth';

export const meta: MetaFunction = () => {
  return [
    { title: 'Login | Monthly Budget' },
    { name: 'description', content: 'Login to your Monthly Budget account' },
  ];
};

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated()) {
      navigate(returnUrl);
    }
  }, [navigate, returnUrl]);


  const handleSubmit = async (email: string, password: string) => {
    const data = await authApi.login(email, password);

    if (data.jwt) {
      setToken(data.jwt);
      navigate(returnUrl);
    } else {
      setLoginError(data.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">Monthly Budget</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Manage your finances with ease
        </p>
      </div>
      <div className="mt-8">

        <div className="w-full max-w-md mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <LoginForm onSubmit={handleSubmit} />


            {loginError && (
              <div className="mt-4 text-center text-sm text-red-600">
                {loginError}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
} 