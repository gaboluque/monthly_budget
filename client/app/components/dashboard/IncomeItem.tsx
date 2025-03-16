import { DollarSign, Check, Undo, Loader2 } from "lucide-react"
import { Button } from "../ui/Button"
import { formatCurrency } from "../../lib/utils/currency"
import type { Income } from "../../lib/types/incomes"

interface IncomeItemProps {
    income: Income
    isMarking: boolean
    onAction: (id: string) => void
}

export function IncomeItem({ income, isMarking, onAction }: IncomeItemProps) {
    const isPending = !income.last_received_at;

    const iconBgColor = isPending ? "bg-blue-100" : "bg-green-100"
    const iconColor = isPending ? "text-blue-600" : "text-green-600"
    const buttonBgColor = isPending ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
    const ActionIcon = isPending ? Check : Undo
    const actionText = isPending ? "Mark as Received" : "Mark as Pending"

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            {/* Mobile Layout */}
            <div className="md:hidden">
                <div className="flex items-center gap-3 mb-3">
                    <div className={`flex-shrink-0 w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
                        <DollarSign className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div>
                        <h3 className="text-base font-medium text-gray-900">{income.name}</h3>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(income.amount)}</p>
                        <p className="text-xs text-gray-500 capitalize">{income.frequency}</p>
                    </div>
                </div>

                <Button
                    onClick={() => onAction(income.id)}
                    disabled={isMarking}
                    className={`w-full flex items-center justify-center gap-2 ${buttonBgColor} text-white py-2.5 rounded-lg transition-colors`}
                >
                    {isMarking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ActionIcon className="w-4 h-4" />}
                    <span>{actionText}</span>
                </Button>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
                            <DollarSign className={`w-5 h-5 ${iconColor}`} />
                        </div>
                        <div>
                            <h3 className="text-base font-medium text-gray-900">{income.name}</h3>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                    <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">{formatCurrency(income.amount)}</p>
                        <p className="text-xs text-gray-500 capitalize">{income.frequency}</p>
                    </div>
                    <Button
                        onClick={() => onAction(income.id)}
                        disabled={isMarking}
                        className={`flex items-center gap-2 ${buttonBgColor} text-white px-4 py-2 rounded-lg transition-colors`}
                    >
                        {isMarking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ActionIcon className="w-4 h-4" />}
                        <span>{actionText}</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}