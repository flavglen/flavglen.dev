import { ExpenseComponent } from "@/components/expense.component";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Database } from "lucide-react";

export default function Page() {
    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Expense Management</h1>
                <p className="text-gray-600 mb-6">
                    View, add, edit, and delete expense records with real-time data processing and filtering.
                </p>
                
                {/* Navigation Links */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <Link href="/admin/expense-dashboard">
                        <Button variant="outline" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Visual Dashboard
                        </Button>
                    </Link>
                    <Link href="/admin/expense-analytics">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            Firebase Analytics
                        </Button>
                    </Link>
                </div>
            </div>
            <ExpenseComponent />
        </div>
    );
}