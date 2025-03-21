import { Check, Undo, Loader2, LucideIcon } from "lucide-react"
import { Button } from "../ui/Button"
import { formatCurrency } from "../../lib/utils/currency"
import { ReactNode } from "react"

export interface FinancialItemProps {
    id: string
    name: string
    amount: number
    frequency: string
    isPending: boolean
    accountName?: string
    icon: LucideIcon
    isMarking: boolean
    onAction: (id: string) => void
    actionText?: {
        pending: string
        completed: string
    }
    badge?: ReactNode
}

export function FinancialItem({
    id,
    name,
    amount,
    frequency,
    isPending,
    accountName,
    icon: Icon,
    isMarking,
    onAction,
    actionText = {
        pending: "Mark as Completed",
        completed: "Mark as Pending"
    },
    badge
}: FinancialItemProps) {
    const iconBgColor = isPending ? "bg-blue-100" : "bg-green-100"
    const iconColor = isPending ? "text-blue-600" : "text-green-600"
    const buttonBgColor = isPending ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 hover:bg-gray-700"
    const ActionIcon = isPending ? Check : Undo
    const currentActionText = isPending ? actionText.pending : actionText.completed

    return (
        <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 mb-3 md:mb-0">
                    <div className={`hidden sm:flex flex-shrink-0 w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                    </div>
                    <div className="w-full flex flex-row justify-between gap-3">
                        <h3 className="text-base font-medium text-gray-900 w-24 truncate">{name}</h3>
                        <div className="block">
                            {badge}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between md:justify-end gap-3 md:gap-4">
                    <div className="flex flex-row items-center justify-between md:gap-3">
                        <div className="md:text-right">
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(amount)}</p>
                            <p className="text-xs text-gray-500 capitalize">{frequency}</p>
                        </div>
                        {accountName && (
                            <div className="md:hidden">
                                <p className="text-xs text-gray-500 capitalize">{accountName}</p>
                            </div>
                        )}
                    </div>
                    <Button
                        onClick={() => onAction(id)}
                        disabled={isMarking}
                        className={`flex items-center justify-center gap-2 ${buttonBgColor} text-white py-2.5 px-4 rounded-lg transition-colors`}
                    >
                        {isMarking ? <Loader2 className="w-4 h-4 animate-spin" /> : <ActionIcon className="w-4 h-4" />}
                        <span>{currentActionText}</span>
                    </Button>
                </div>
            </div>
        </div>
    )
} 