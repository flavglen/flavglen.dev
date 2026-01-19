"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { format, addDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Play, RefreshCw, AlertCircle, CheckCircle2, XCircle, Copy, Database } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// Using native select for simplicity - can replace with shadcn Select component later

interface MigrationResult {
  success: boolean;
  totalExpenses: number;
  updatedExpenses: number;
  unchangedExpenses: number;
  errors: number;
  updatedExpensesDetails: Array<{
    docId: string;
    place: string;
    oldCategory: string;
    newCategory: string;
    date?: string;
    amount?: number;
  }>;
  errorsDetails: Array<{
    docId: string;
    error: string;
  }>;
}

export function MigrateCategoriesComponent() {
  const [mounted, setMounted] = React.useState(false)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -new Date().getDate()),
    to: new Date(),
  })

  React.useEffect(() => {
    setMounted(true)
  }, [])
  const [collectionName, setCollectionName] = React.useState("ai_expenses")
  const [dryRun, setDryRun] = React.useState(true)
  const [syncPeriodData, setSyncPeriodData] = React.useState(true)
  const [loading, setLoading] = React.useState(false)
  const [cloning, setCloning] = React.useState(false)
  const [cloneResult, setCloneResult] = React.useState<any>(null)
  const [result, setResult] = React.useState<MigrationResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const cloneCollection = async () => {
    setCloning(true)
    setError(null)
    setCloneResult(null)

    try {
      const params = new URLSearchParams({
        sourceCollection: "ai_expenses",
        targetCollection: "ai_expenses_test",
        overwrite: "true",
      })

      const response = await fetch(`/api/protected/clone-collection?${params.toString()}`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Clone failed")
      }

      setCloneResult(data.results)
      // Auto-switch to test collection after successful clone
      if (data.results?.success) {
        setCollectionName("ai_expenses_test")
      }
    } catch (err: any) {
      console.error("Clone error:", err)
      setError(err.message || "Failed to clone collection")
    } finally {
      setCloning(false)
    }
  }

  const runMigration = async () => {
    if (!date?.from || !date?.to) {
      setError("Please select a date range")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const fromDate = date.from.toISOString()
      const toDate = date.to.toISOString()

      const params = new URLSearchParams({
        dryRun: dryRun.toString(),
        syncPeriodData: syncPeriodData.toString(),
        fromDate,
        toDate,
        collectionName,
      })

      const response = await fetch(`/api/protected/migrate-categories?${params.toString()}`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Migration failed")
      }

      setResult(data.results)
    } catch (err: any) {
      console.error("Migration error:", err)
      setError(err.message || "Failed to run migration")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Expense Category Migration</CardTitle>
          <CardDescription>
            Update expense categories based on updated category patterns. Select a date range to migrate specific expenses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Collection Selector */}
          <div className="space-y-2">
            <Label>Collection</Label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative w-full sm:w-[250px]">
                <Database className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <select
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="ai_expenses">ai_expenses (Production)</option>
                  <option value="ai_expenses_test">ai_expenses_test (Test)</option>
                </select>
              </div>
              <Button
                onClick={cloneCollection}
                disabled={cloning}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {cloning ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Cloning...
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Clone to Test
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Select the collection to migrate. Use &quot;Clone to Test&quot; to copy ai_expenses to ai_expenses_test for safe testing.
            </p>
            {collectionName === "ai_expenses" && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  You are working with the production collection. Consider using ai_expenses_test for testing.
                </AlertDescription>
              </Alert>
            )}
            {cloneResult && (
              <Alert variant={cloneResult.success ? "default" : "destructive"}>
                {cloneResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {cloneResult.success ? "Clone Successful" : "Clone Failed"}
                </AlertTitle>
                <AlertDescription>
                  {cloneResult.success
                    ? `Successfully copied ${cloneResult.documentsCopied} documents to ai_expenses_test`
                    : `Failed to clone collection: ${cloneResult.errors} errors`}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Date Range Selector */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              {mounted ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn("w-full sm:w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white z-40" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-full sm:w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                  disabled
                >
                  <CalendarIcon />
                  <span>Pick a date range</span>
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Select the date range for expenses to migrate. If not specified, all expenses will be migrated.
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="dry-run"
                checked={dryRun}
                onCheckedChange={setDryRun}
              />
              <Label htmlFor="dry-run" className="cursor-pointer">
                Dry Run (Preview only - No changes will be made)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="sync-period-data"
                checked={syncPeriodData}
                onCheckedChange={setSyncPeriodData}
              />
              <Label htmlFor="sync-period-data" className="cursor-pointer">
                Sync Period Data (Update period aggregations after migration)
              </Label>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={runMigration}
            disabled={loading || !date?.from || !date?.to}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Running Migration...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                {dryRun ? "Preview Migration" : "Run Migration"}
              </>
            )}
          </Button>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {result && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.success ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Migration {dryRun ? "Preview" : "Completed"} Successfully
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                      Migration Completed with Errors
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold">{result.totalExpenses}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Updated</p>
                    <p className="text-2xl font-bold text-blue-600">{result.updatedExpenses}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Unchanged</p>
                    <p className="text-2xl font-bold text-gray-600">{result.unchangedExpenses}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">Errors</p>
                    <p className="text-2xl font-bold text-red-600">{result.errors}</p>
                  </div>
                </div>

                {/* Updated Expenses Details */}
                {result.updatedExpensesDetails.length > 0 && (() => {
                  // Filter to show:
                  // 1. Expenses where old category is "Others" and new category is not "Others"
                  // 2. Expenses where old category is blank/empty (to be updated)
                  const filteredDetails = result.updatedExpensesDetails.filter(
                    detail => {
                      const isOthersToCategory = detail.oldCategory === "Others" && detail.newCategory !== "Others";
                      const isBlankCategory = detail.oldCategory === "(blank)" || detail.oldCategory === "" || !detail.oldCategory;
                      return isOthersToCategory || isBlankCategory;
                    }
                  );
                  
                  return filteredDetails.length > 0 ? (
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">
                        Expenses to Update ({filteredDetails.length} of {result.updatedExpensesDetails.length})
                      </Label>
                      <div className="max-h-60 overflow-auto border rounded-md">
                        <div className="inline-block min-w-full align-middle">
                          <table className="min-w-full text-sm">
                            <thead className="bg-muted sticky top-0">
                              <tr>
                                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap min-w-[80px]">Doc ID</th>
                                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap min-w-[150px]">Place</th>
                                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap min-w-[100px]">Date</th>
                                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap min-w-[80px]">Amount</th>
                                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap min-w-[100px]">Old Category</th>
                                <th className="px-3 py-2 text-left font-semibold whitespace-nowrap min-w-[100px]">New Category</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredDetails.map((detail, idx) => (
                                <tr key={idx} className="border-t">
                                  <td className="px-3 py-2 text-xs font-mono text-gray-600 break-all">
                                    {detail.docId}
                                  </td>
                                  <td className="px-3 py-2 text-xs whitespace-nowrap">{detail.place}</td>
                                  <td className="px-3 py-2 text-xs text-gray-600 whitespace-nowrap">
                                    {detail.date ? (
                                      typeof detail.date === 'string' && detail.date.includes('T') 
                                        ? format(new Date(detail.date), "MMM dd, yyyy")
                                        : detail.date
                                    ) : '-'}
                                  </td>
                                  <td className="px-3 py-2 text-xs whitespace-nowrap text-right font-medium">
                                    ${typeof detail.amount === 'number' ? detail.amount.toFixed(2) : detail.amount || '0.00'}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <span className="px-2 py-1 rounded text-xs bg-gray-100">
                                      {detail.oldCategory}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                                      {detail.newCategory}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">
                        Updated Expenses ({result.updatedExpensesDetails.length})
                      </Label>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>No Expenses to Display</AlertTitle>
                        <AlertDescription>
                          No expenses with &quot;Others&quot; or blank categories were found in the results.
                        </AlertDescription>
                      </Alert>
                    </div>
                  );
                })()}

                {/* Error Details */}
                {result.errorsDetails.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-red-600">
                      Errors ({result.errorsDetails.length})
                    </Label>
                    <div className="max-h-40 overflow-y-auto border rounded-md border-red-200">
                      <div className="p-3 space-y-2">
                        {result.errorsDetails.map((errorDetail, idx) => (
                          <div key={idx} className="text-sm text-red-600">
                            <p className="font-medium">Doc ID: {errorDetail.docId}</p>
                            <p className="text-muted-foreground">{errorDetail.error}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

