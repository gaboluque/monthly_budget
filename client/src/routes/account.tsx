import { Layout } from "../components/ui/Layout";
import { PageHeader } from "../components/ui/PageHeader";
import { Link } from "react-router";
import { accountRoutes } from "./_index";

export default function AccountSection() {

  return (
    <Layout>
      <PageHeader
        title="Account Management"
        description="Manage your accounts and income sources in one place"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
        {accountRoutes?.map(({ path, label, icon: Icon, color, description }) => (
          Icon && (
            <Link
              key={path}
              to={path}
              className="block p-6 bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 bg-${color}-50 rounded-full mr-4`}>
                  <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{label}</h2>
              </div>
              <p className="text-gray-600">
                {description}
              </p>
            </Link>
          )
        ))}
      </div>
    </Layout>
  );
} 