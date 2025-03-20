import { type ReactNode } from 'react';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';
import ProtectedRoute from '../ProtectedRoute';
import { FloatingActionButton } from './FloatingActionButton';
import { useLocation } from '@remix-run/react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const showTransactionFAB = location.pathname !== '/transactions';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:max-w-4xl pb-40 md:pb-6">
          {children}
        </main>
        {showTransactionFAB && (
          <FloatingActionButton
            to="/transactions?new=true"
            ariaLabel="Add new transaction"
          />
        )}
        <MobileNavigation />
      </div>
    </ProtectedRoute>
  );
} 