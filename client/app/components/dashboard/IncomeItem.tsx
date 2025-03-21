import { DollarSign } from "lucide-react"
import type { Income } from "../../lib/types/incomes"
import { FinancialItem } from "../shared/FinancialItem"

interface IncomeItemProps {
    income: Income
    isMarking: boolean
    onAction: (id: string) => void
}

export function IncomeItem({ income, isMarking, onAction }: IncomeItemProps) {
    const isPending = !income.last_received_at;

    return (
        <FinancialItem
            id={income.id}
            name={income.name}
            amount={income.amount}
            frequency={income.frequency}
            isPending={isPending}
            accountName={income.account?.name || ""}
            icon={DollarSign}
            isMarking={isMarking}
            onAction={onAction}
            actionText={{
                pending: "Mark as Received",
                completed: "Mark as Pending"
            }}
        />
    )
}