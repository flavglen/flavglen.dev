import { ExpenseSummaryFirebaseComponent } from "@/components/expense-summary-firebase.component"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function ExpenseAnalyticsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/admin/reports">
                        <Button variant="outline" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Reports
                        </Button>
                    </Link>
                </div>
                <h1 className="text-3xl font-bold mb-2">Expense Analytics (Firebase)</h1>
                <p className="text-gray-600">
                    Advanced expense analytics with Firebase period data storage for optimized performance and AI training.
                </p>
            </div>
            
            <ExpenseSummaryFirebaseComponent />
        </div>
    )
}

