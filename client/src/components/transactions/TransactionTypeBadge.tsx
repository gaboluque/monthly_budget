import { TransactionType } from "../../lib/types/transactions";
import { transactionTypeColor } from "../../lib/ui/colorHelpers";


export function TransactionTypeBadge({ transactionType }: { transactionType: TransactionType }) {
  return <div className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${transactionTypeColor(transactionType)}-100 text-${transactionTypeColor(transactionType)}-800`}>
    {transactionType}
  </div>
}
