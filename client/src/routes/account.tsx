import { Layout } from "../components/ui/Layout";
import { PageHeader } from "../components/ui/PageHeader";
import { Link } from "react-router";
import { DollarSign, Wallet } from "lucide-react";

export default function AccountSection() {
  return (
    <Layout>
      <PageHeader
        title="Account Management"
        description="Manage your accounts and income sources in one place"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Link
          to="/account/accounts"
          className="block p-6 bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-yellow-50 rounded-full mr-4">
              <Wallet className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Accounts</h2>
          </div>
          <p className="text-gray-600">
            View and manage all your financial accounts in one place.
          </p>
        </Link>

        <Link
          to="/account/incomes"
          className="block p-6 bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-50 rounded-full mr-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Incomes</h2>
          </div>
          <p className="text-gray-600">
            Track and manage your income sources and recurring payments.
          </p>
        </Link>
      </div>
    </Layout>
  );
} 