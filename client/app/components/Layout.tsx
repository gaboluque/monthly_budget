import { type ReactNode } from 'react';
import { Header } from './Header';
import ProtectedRoute from './ProtectedRoute';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:max-w-4xl">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
} 