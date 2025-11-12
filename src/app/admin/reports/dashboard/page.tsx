import { ExpenseDashboardComponent } from "@/components/expense-dashboard.component"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ExpenseDashboardPage() {
    return (
        <div className="container py-4">
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/admin/reports">
                        <Button variant="outline" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Reports
                        </Button>
                    </Link>
                </div>
                <h1 className="text-3xl font-bold mb-2">Expense Dashboard</h1>
                <p className="text-gray-600">
                    Visual analytics and insights for your expense data with interactive charts and graphs.
                </p>
            </div>
            
            <ExpenseDashboardComponent />
        </div>
    )
}

