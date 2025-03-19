import { TransactionType } from "../types/transactions";

export const transactionTypeColor = (type: TransactionType) => {
  switch (type) {
    case "income":
      return "green";
    case "expense":
      return "red";
    case "transfer":
      return "blue";
    default:
      return "gray";
  }
};
