import { ExpenseComponent } from "@/components/expense.component";

export default function Page() {
    return (
        <div className="container py-4 sm:py-8 px-2 sm:px-6">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Expense Management</h1>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                    View, add, edit, and delete expense records with real-time data processing and filtering.
                </p>
            </div>
            <ExpenseComponent />
        </div>
    );
}