import { Layout } from "../components/Layout"
import { PageHeader } from "../components/PageHeader"

export default function Insights() {
    return (
        <Layout>
            <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8">

                <PageHeader
                    title="Financial Insights"
                    description="Analyze your financial data with detailed insights and trends."
                    buttonText="Generate Report"
                    buttonColor="blue"
                />

                <div className="space-y-6">
                    {/* TODO: Add insights content */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Overview</h3>
                        <p className="text-gray-600">Coming soon: Detailed financial insights and analytics.</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
} 