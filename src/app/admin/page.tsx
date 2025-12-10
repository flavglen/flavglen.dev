import { ExpenseDashboardComponent } from "@/components/expense-dashboard.component"

export default function AdminHomePage() {
  return (
    <div className="h-full w-full p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Overview and analytics for your expense data
        </p>
      </div>
      <ExpenseDashboardComponent />
    </div>
  )
}

