import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Database, PieChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
    return (
        <div className="container py-4 sm:py-8 px-2 sm:px-6">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Reports</h1>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                    View analytics, dashboards, and insights for your expense data.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" />
                            Expense Dashboard
                        </CardTitle>
                        <CardDescription>
                            Visual analytics and insights with interactive charts and graphs
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/admin/reports/dashboard">
                            <Button className="w-full">
                                View Dashboard
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Firebase Analytics
                        </CardTitle>
                        <CardDescription>
                            Advanced analytics with Firebase period data storage
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/admin/reports/analytics">
                            <Button className="w-full">
                                View Analytics
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

