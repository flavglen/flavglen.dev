import { MigrateCategoriesComponent } from "@/components/migrate-categories.component"

export default function MigrateCategoriesPage() {
  return (
    <div className="container py-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Category Migration</h1>
        <p className="text-gray-600">
          Update expense categories based on updated category patterns. Select a date range to migrate specific expenses.
        </p>
      </div>
      
      <MigrateCategoriesComponent />
    </div>
  )
}

