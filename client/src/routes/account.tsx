import { Layout } from "../components/ui/Layout";
import { PageHeader } from "../components/ui/PageHeader";
import { Link } from "react-router";
import { navigationLinks } from "./_routes";

export default function AccountSection() {

  const accountRoutes = navigationLinks.find((route) => route.path === "/account")?.children;

  return (
    <Layout>
      <PageHeader
        title="Account Management"
        description="Manage your accounts and income sources in one place"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-6">
        {accountRoutes?.map((route) => (
          <Link
            key={route.path}
            to={route.path}
            className="block p-6 bg-white shadow-sm rounded-lg hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-center mb-4">
              <div className={`p-3 bg-${route.color}-50 rounded-full mr-4`}>
                <route.icon className={`w-6 h-6 text-${route.color}-600`} />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{route.label}</h2>
            </div>
            <p className="text-gray-600">
              {route.description}
            </p>
          </Link>
        ))}
      </div>
    </Layout>
  );
} 