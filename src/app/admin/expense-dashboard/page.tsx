import { ExpenseDashboardComponent } from "@/components/expense-dashboard.component"

export default function ExpenseDashboardPage() {
    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Expense Dashboard</h1>
                <p className="text-gray-600">
                    Visual analytics and insights for your expense data with interactive charts and graphs.
                </p>
            </div>
            
            <ExpenseDashboardComponent />
        </div>
    )
}



