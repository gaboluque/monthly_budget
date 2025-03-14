import { insightsApi } from "../lib/api/insights";
import { Layout } from "../components/Layout"
import { PageHeader } from "../components/PageHeader"
import { useEffect, useState } from "react";
import "../styles/markdown.css"
import Markdown from 'react-markdown'

export default function Insights() {
    const [loading, setLoading] = useState(false)
    const [insights, setInsights] = useState("")

    useEffect(() => {
        const fetchInsights = async () => {
            setLoading(true)
            const response = await insightsApi.getAll()
            setInsights(response)
            setLoading(false)
        }
        fetchInsights()
    }, []);

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
                    <div className="bg-white shadow rounded-lg p-6 text-black">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className="markdown">
                                <Markdown>{insights}</Markdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
} 