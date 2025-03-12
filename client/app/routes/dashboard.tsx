import type { MetaFunction } from '@remix-run/node';
import { Layout } from '../components/Layout';

export const meta: MetaFunction = () => {
  return [
    { title: 'Dashboard | Monthly Budget' },
    { name: 'description', content: 'Your Monthly Budget Dashboard' },
  ];
};

export default function Dashboard() {
  return (
    <Layout>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
        {/* Dashboard content */}
      </div>
    </Layout>
  );
} 