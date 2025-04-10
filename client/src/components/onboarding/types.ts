export interface OnboardingFormData {
    name: string;
    savingsGoal: number;
    mainAccount: { 
        name: string; 
        type: "checking" | "savings" | "credit" | "cash"; 
        balance: number;
    };
    income: { 
        name: string; 
        amount: number; 
        frequency: "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
    };
    budgetMethod: "50-30-20" | "70-20-10" | "custom";
    budgetDistribution: { 
        needs: number; 
        wants: number; 
        savings: number;
    };
}