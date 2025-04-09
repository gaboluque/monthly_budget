import { type ReactNode } from 'react';
import { Header } from './Header';
import { MobileNavigation } from './MobileNavigation';
import ProtectedRoute from '../ProtectedRoute';
import { FloatingActionButton } from './FloatingActionButton';
import { useLocation } from 'react-router';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const showTransactionFAB = location.pathname !== '/transactions';
  const minHeight = `calc(100vh-128px)`;

  return (
    <ProtectedRoute>
      <div className={`min-h-[${minHeight}] md:min-h-screen bg-gray-50`}>
        <Header />
        <main className="container mx-auto px-0 sm:px-6 py-0 md:py-6 md:max-w-4xl pb-40 md:pb-6">
          <div className={`bg-gray-50 min-h-[${minHeight}] md:min-h-20 rounded-lg shadow-sm-0 md:shadow-sm-lg p-4`}>
            {children}
          </div>
        </main>
        {showTransactionFAB && (
          <FloatingActionButton
            to={`/transactions?new=true&returnTo=${encodeURIComponent(location.pathname)}`}
            ariaLabel="Add new transaction"
          />
        )}
        <MobileNavigation />
      </div>
    </ProtectedRoute>
  );
} 