import { ExpenseSummaryFirebaseComponent } from "@/components/expense-summary-firebase.component"

export default function ExpenseAnalyticsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Expense Analytics (Firebase)</h1>
                <p className="text-gray-600">
                    Advanced expense analytics with Firebase period data storage for optimized performance and AI training.
                </p>
            </div>
            
            <ExpenseSummaryFirebaseComponent />
        </div>
    )
}

