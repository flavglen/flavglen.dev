import { Expense } from "@/components/expense.component";

export function getCurrentMonthStartEnd() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based: Jan = 0
  
    const dateFrom = new Date(year, month, 1);
    const dateTo = new Date(year, month + 1, 0); // last day of current month
  
    return { dateFrom : dateFrom.toISOString(), dateTo: dateTo.toISOString() };
  }

 export const fetchExpenses = async ({ dateTo, dateFrom }: { dateTo: string; dateFrom: string }) => {
        try {
            if (!dateTo || !dateFrom) {
                throw new Error("Invalid date range");
            }

            const response = await fetch(`/api/protected/expenses?from=${dateFrom}&to=${dateTo}`);
            const data = await response.json();
            const dataFormated = data?.data?.map((expense: Expense) => ({ ...expense, amount: +expense.amount }));
            return dataFormated;
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
            return null;
        }
    }
