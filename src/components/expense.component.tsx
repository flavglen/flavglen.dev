"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { format, addDays, parse, isValid } from "date-fns"
import type { DateRange } from "react-day-picker"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Calendar } from "./ui/calendar"
import { ArrowUpDown, CalendarIcon, DollarSign, Receipt, TrendingUp, Filter, Trash2, Search, Sparkles, Award, AlertTriangle } from "lucide-react"
import { useBudgetAlerts } from "@/hooks/useBudgetAlerts"
import { BudgetAlertComponent } from "@/components/budget-alert"

export interface Expense {
    id: string;                 // Unique identifier for the record
    docId: string;              // Google document ID
    amount: number;             // Expense amount
    category: string;           // Category like 'Others', 'Food', etc.
    place: string;              // Vendor or store name
    time: string;               // Time of transaction (e.g. "2:11 pm")
    internalDate: string;       // ISO timestamp (e.g. "2025-06-01T18:11:11.000Z")
    manual: boolean;            // Whether it was manually added
    googleScript: boolean;      // Whether it was added via Google Script
  }

export function ExpenseComponent() {
    const [mounted, setMounted] = React.useState(false)
    const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -new Date().getDate()),
        to: new Date(),
    })
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    React.useEffect(() => {
        setMounted(true)
    }, [])
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [expenses, setExpenses] = React.useState<Expense[]>([]);
    const [open, setOpen] = React.useState(false)
    const [activeCategory, setActiveCategory] = React.useState("All")
    const [alertsExpanded, setAlertsExpanded] = React.useState(false)
    const [dateInput, setDateInput] = React.useState<string>("")

       
    const fetchExpenses = async () => {
        try {
            const dateTo = date?.to ? addDays(date.to, 1) : null;
            const dateFrom = date?.from || null;

            if (!dateTo || !dateFrom) {
                throw new Error("Invalid date range");
            }

            const response = await fetch(`/api/protected/expenses?from=${dateFrom?.toISOString()}&to=${dateTo?.toISOString()}`);
            const data = await response.json();
            const dataFormated = data?.data?.map((expense: Expense) => ({ ...expense, amount: +expense.amount }));
            setExpenses(dataFormated || []);
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
        }
    }

    const deleteRow = async (docId?: string | null) => {
        if (!docId) {
            console.error("No docId provided", docId);
            return;
        }

        fetch(`/api/protected/expenses/${docId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Success:", data)
                alert("Expense deleted successfully");
                fetchExpenses();
                setSelectedDocId(null);
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Failed to delete expense");
                setSelectedDocId(null);
            });
    }

    // Category color mapping
    const getCategoryColor = (category: string) => {
        const colorMap: { [key: string]: { bg: string; border: string; text: string; badge: string } } = {
            "Food": { 
                bg: "from-green-500 to-green-600", 
                border: "border-green-300 dark:border-green-700", 
                text: "text-green-700 dark:text-green-300",
                badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700"
            },
            "Groceries": { 
                bg: "from-emerald-500 to-emerald-600", 
                border: "border-emerald-300 dark:border-emerald-700", 
                text: "text-emerald-700 dark:text-emerald-300",
                badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
            },
            "Transport": { 
                bg: "from-blue-500 to-blue-600", 
                border: "border-blue-300 dark:border-blue-700", 
                text: "text-blue-700 dark:text-blue-300",
                badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
            },
            "Shopping": { 
                bg: "from-purple-500 to-purple-600", 
                border: "border-purple-300 dark:border-purple-700", 
                text: "text-purple-700 dark:text-purple-300",
                badge: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700"
            },
            "Entertainment": { 
                bg: "from-pink-500 to-pink-600", 
                border: "border-pink-300 dark:border-pink-700", 
                text: "text-pink-700 dark:text-pink-300",
                badge: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700"
            },
            "Utilities": { 
                bg: "from-yellow-500 to-yellow-600", 
                border: "border-yellow-300 dark:border-yellow-700", 
                text: "text-yellow-700 dark:text-yellow-300",
                badge: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700"
            },
            "Healthcare": { 
                bg: "from-red-500 to-red-600", 
                border: "border-red-300 dark:border-red-700", 
                text: "text-red-700 dark:text-red-300",
                badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
            },
            "Education": { 
                bg: "from-indigo-500 to-indigo-600", 
                border: "border-indigo-300 dark:border-indigo-700", 
                text: "text-indigo-700 dark:text-indigo-300",
                badge: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700"
            },
            "Business": { 
                bg: "from-cyan-500 to-cyan-600", 
                border: "border-cyan-300 dark:border-cyan-700", 
                text: "text-cyan-700 dark:text-cyan-300",
                badge: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700"
            },
            "Housing": { 
                bg: "from-amber-500 to-amber-600", 
                border: "border-amber-300 dark:border-amber-700", 
                text: "text-amber-700 dark:text-amber-300",
                badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700"
            },
            "Electronics": { 
                bg: "from-violet-500 to-violet-600", 
                border: "border-violet-300 dark:border-violet-700", 
                text: "text-violet-700 dark:text-violet-300",
                badge: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border-violet-300 dark:border-violet-700"
            },
            "Drinks": { 
                bg: "from-teal-500 to-teal-600", 
                border: "border-teal-300 dark:border-teal-700", 
                text: "text-teal-700 dark:text-teal-300",
                badge: "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700"
            },
            "Others": { 
                bg: "from-gray-500 to-gray-600", 
                border: "border-gray-300 dark:border-gray-700", 
                text: "text-gray-700 dark:text-gray-300",
                badge: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700"
            },
        };
        
        return colorMap[category] || colorMap["Others"];
    };
 
    const columns1 = React.useMemo<ColumnDef<Expense>[]>(() => [
        {
            accessorKey: "place",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-primary/10 hover:text-primary font-semibold h-auto p-0"
                >
                    Place
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-medium text-foreground">{row.getValue("place")}</div>
            ),
        },
        {
            accessorKey: "amount",
            header: () => (
                <div className="text-right font-semibold uppercase tracking-wider">Amount</div>
            ),
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("amount"));
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(amount);
                return (
                    <div className="text-right font-semibold text-primary">
                        {formatted}
                    </div>
                );
            },
            footer: ({ table }) => {
                const total = table.getFilteredRowModel().rows.reduce(
                    (sum, row) => sum + row.original.amount,
                    0
                );
                const formattedTotal = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(total);
                return <div className="text-right font-medium">{formattedTotal}</div>;
            },
        },
        {
            accessorKey: "internalDate",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-primary/10 hover:text-primary font-semibold h-auto p-0"
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {new Date(row.getValue("internalDate")).toLocaleString()}
                </div>
            ),
        },
        {
            accessorKey: "category",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-primary/10 hover:text-primary font-semibold h-auto p-0"
                >
                    Category
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const category = row.getValue("category") as string;
                const color = getCategoryColor(category);
                return (
                    <Badge variant="outline" className={`font-normal ${color.badge}`}>
                        {category}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "docId",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-primary/10 hover:text-primary font-semibold h-auto p-0"
                >
                    Doc ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-mono text-xs text-muted-foreground break-all max-w-[200px] truncate">
                    {row.getValue("docId")}
                </div>
            ),
        },
        {
            accessorKey: "id",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-primary/10 hover:text-primary font-semibold h-auto p-0"
                >
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-mono text-xs text-muted-foreground">
                    {row.getValue("id")}
                </div>
            ),
        },
        {
            id: "actions",
            header: () => (
                <span className="font-semibold uppercase tracking-wider">Action</span>
            ),
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => { setSelectedDocId(row.getValue("docId")); }}
                        className="hover:scale-105 transition-transform"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ], [deleteRow, setSelectedDocId]);

    const table = useReactTable({
        data: expenses,
        columns: columns1,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter
        },
    })


    React.useEffect(() => {
        void fetchExpenses();
    }, [])

    // Update date input when date range changes
    React.useEffect(() => {
        if (date?.from && date?.to) {
            setDateInput(`${format(date.from, "MM/dd/yyyy")} - ${format(date.to, "MM/dd/yyyy")}`)
        } else if (date?.from) {
            setDateInput(format(date.from, "MM/dd/yyyy"))
        } else {
            setDateInput("")
        }
    }, [date])

    // Parse manual date entry
    const handleDateInputChange = (value: string) => {
        setDateInput(value)
        
        // Try to parse date range (format: MM/dd/yyyy - MM/dd/yyyy)
        const rangeMatch = value.match(/^(\d{1,2}\/\d{1,2}\/\d{4})\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4})$/)
        if (rangeMatch) {
            const fromDate = parse(rangeMatch[1], "MM/dd/yyyy", new Date())
            const toDate = parse(rangeMatch[2], "MM/dd/yyyy", new Date())
            
            if (isValid(fromDate) && isValid(toDate) && fromDate <= toDate) {
                setDate({ from: fromDate, to: toDate })
            }
        } else {
            // Try to parse single date
            const singleDate = parse(value, "MM/dd/yyyy", new Date())
            if (isValid(singleDate)) {
                setDate({ from: singleDate, to: singleDate })
            }
        }
    }

    const ConfirmDialog = React.useCallback(() => {
        if (confirm("Confirm to Delete?\nEither OK or Cancel.") === true) {
            deleteRow(selectedDocId);
        } else {
            setSelectedDocId(null);
        }
    }, [selectedDocId])

    React.useEffect(() => {
        if (selectedDocId) {
            ConfirmDialog()
        }
    }, [selectedDocId])

    // Calculate total expenses and category summaries
    const totalExpenses = expenses.length;
    const totalAmount = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    
    // Group expenses by category and get top 4
    const categorySummary = React.useMemo(() => {
        const categoryMap = new Map<string, { count: number; total: number; category: string }>();
        
        expenses.forEach(expense => {
            const category = expense.category || "Others";
            const existing = categoryMap.get(category) || { count: 0, total: 0, category };
            categoryMap.set(category, {
                count: existing.count + 1,
                total: existing.total + (expense.amount || 0),
                category
            });
        });
        
        return Array.from(categoryMap.values())
            .sort((a, b) => b.total - a.total)
            .slice(0, 4);
    }, [expenses]);

    const uniqueCategories = React.useMemo(() => {
        const cats = Array.from(new Set(expenses.map(e => e.category || "Others"))).sort();
        return ["All", ...cats];
    }, [expenses]);

    const handleCategoryFilter = (category: string) => {
        setActiveCategory(category);
        table.getColumn("category")?.setFilterValue(category === "All" ? undefined : category);
    };

    const filteredExpenses = table.getFilteredRowModel().rows.length;
    const filteredAmount = table.getFilteredRowModel().rows.reduce(
        (sum, row) => sum + row.original.amount,
        0
    );

    // Check for budget alerts
    const { budgetAlerts, getCategoryBudgetStatus } = useBudgetAlerts(expenses);

    return (
        <div className="w-full relative space-y-6">
            {/* Budget Alerts */}
            {budgetAlerts.length > 0 && (
                <div className="border-2 rounded-lg overflow-hidden">
                    <button
                        onClick={() => setAlertsExpanded((prev) => !prev)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-destructive/5 hover:bg-destructive/10 transition-colors text-left"
                    >
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="text-sm font-semibold text-destructive">
                                Budget Alerts
                            </span>
                            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                                {budgetAlerts.length}
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                            {alertsExpanded ? "Hide" : "Show"}
                        </span>
                    </button>
                    {alertsExpanded && (
                        <div className="p-4">
                            <BudgetAlertComponent alerts={budgetAlerts} />
                        </div>
                    )}
                </div>
            )}

            {/* Summary and Top Categories in Single Row */}
            <div className="flex flex-col lg:flex-row gap-3">
                {/* Total Expenses Summary */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Summary</h2>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                        <Card className="border border-blue-200/50 dark:border-blue-800/30 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group">
                            <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <Receipt className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Expenses</p>
                                <p className="text-lg font-bold text-blue-700 dark:text-blue-300 tabular-nums">{totalExpenses}</p>
                            </CardContent>
                        </Card>
                        <Card className="border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/20 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group">
                            <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <Filter className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Filtered</p>
                                <p className="text-lg font-bold text-purple-700 dark:text-purple-300 tabular-nums">{filteredExpenses}</p>
                            </CardContent>
                        </Card>
                        <Card className="border border-green-200/50 dark:border-green-800/30 bg-green-50/30 dark:bg-green-950/20 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group">
                            <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <DollarSign className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Total Amount</p>
                                <p className="text-sm font-bold text-green-700 dark:text-green-300 tabular-nums">
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                        maximumFractionDigits: 0,
                                    }).format(totalAmount)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="border border-orange-200/50 dark:border-orange-800/30 bg-orange-50/30 dark:bg-orange-950/20 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] group">
                            <CardContent className="p-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <TrendingUp className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Filtered Amount</p>
                                <p className="text-sm font-bold text-orange-700 dark:text-orange-300 tabular-nums">
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                        maximumFractionDigits: 0,
                                    }).format(filteredAmount)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Top 4 Categories Cards */}
                {categorySummary.length > 0 && (
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2.5">
                            <Award className="h-3.5 w-3.5 text-primary" />
                            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Top Categories</h2>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                        {categorySummary.map((cat, index) => {
                            const color = getCategoryColor(cat.category);
                            const budgetStatus = getCategoryBudgetStatus(cat.category);
                            return (
                                <Card 
                                    key={cat.category} 
                                    className={`border ${budgetStatus.isOverBudget ? 'border-destructive/50 bg-destructive/5' : 'border-border/50'} shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] overflow-hidden relative group`}
                                >
                                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${budgetStatus.isOverBudget ? 'from-destructive to-destructive/80' : color.bg}`} />
                                    <CardContent className="p-3">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                                <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${budgetStatus.isOverBudget ? 'from-destructive to-destructive/80' : color.bg} flex items-center justify-center text-white font-bold text-[10px] flex-shrink-0`}>
                                                    {index + 1}
                                                </div>
                                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 ${budgetStatus.isOverBudget ? 'bg-destructive/10 text-destructive border-destructive/50' : color.badge} truncate`}>
                                                    {cat.category}
                                                </Badge>
                                                {budgetStatus.isOverBudget && (
                                                    <AlertTriangle className="h-3 w-3 text-destructive flex-shrink-0" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-baseline justify-between gap-1">
                                                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Amount</span>
                                                <p className={`text-sm font-bold ${budgetStatus.isOverBudget ? 'text-destructive' : color.text} tabular-nums`}>
                                                    {new Intl.NumberFormat("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                        maximumFractionDigits: 0,
                                                    }).format(cat.total)}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between gap-2 text-[10px]">
                                                <span className="text-muted-foreground">{cat.count} txns</span>
                                                {budgetStatus.hasBudget && (
                                                    <span className={`font-medium tabular-nums ${
                                                        budgetStatus.isOverBudget 
                                                            ? 'text-destructive' 
                                                            : budgetStatus.percentage >= 80 
                                                            ? 'text-yellow-600 dark:text-yellow-500' 
                                                            : 'text-muted-foreground'
                                                    }`}>
                                                        {budgetStatus.percentage}%
                                                    </span>
                                                )}
                                            </div>
                                            {budgetStatus.hasBudget && (
                                                <div className="w-full bg-muted/50 rounded-full h-1 mt-1.5">
                                                    <div
                                                        className={`h-1 rounded-full transition-all ${
                                                            budgetStatus.isOverBudget
                                                                ? 'bg-destructive'
                                                                : budgetStatus.percentage >= 80
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                        }`}
                                                        style={{ width: `${Math.min(budgetStatus.percentage, 100)}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                        </div>
                    </div>
                )}
            </div>

            <Card className="border-2 shadow-md">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <div className="w-full sm:w-[300px]">
                            {mounted ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
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
                                    <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-900 z-40 rounded-md border shadow-md" align="start">
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
                                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                    disabled
                                >
                                    <CalendarIcon />
                                    <span>Pick a date range</span>
                                </Button>
                            )}
                        </div>
                        <Button 
                            variant="default" 
                            className="w-full sm:w-auto gap-2 shadow-md hover:shadow-lg transition-shadow" 
                            onClick={fetchExpenses}
                        >
                            <Search className="h-4 w-4" />
                            Fetch Expenses
                        </Button>
                    </div>
                    <div className="flex items-center mt-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search expenses by place, category, or amount..."
                                value={globalFilter ?? ""}
                                onChange={(event) => {
                                    table.setGlobalFilter(event.target.value)
                                }}
                                className="w-full pl-10 border-2 focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                    {uniqueCategories.length > 1 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {uniqueCategories.map((cat) => {
                                const isActive = activeCategory === cat;
                                const color = cat === "All" ? null : getCategoryColor(cat);
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => handleCategoryFilter(cat)}
                                        className={cn(
                                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
                                            isActive
                                                ? cat === "All"
                                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                    : `${color?.badge} border-transparent shadow-sm scale-105`
                                                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card className="border-2 shadow-lg overflow-hidden">
                <div className="rounded-md border-0 overflow-x-auto w-full">
                    <Table className="min-w-[800px] w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow 
                                    key={headerGroup.id}
                                    className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 border-b-2 border-primary/20 hover:from-primary/15 hover:via-primary/10 hover:to-primary/15 dark:hover:from-primary/25 dark:hover:via-primary/15 dark:hover:to-primary/25 transition-all duration-200"
                                >
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead 
                                                key={header.id}
                                                className="font-bold text-foreground text-sm uppercase tracking-wider py-4 px-4"
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="hover:bg-muted/50 transition-colors cursor-pointer border-b"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns1.length}
                                        className="h-24 text-center"
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Receipt className="h-8 w-8 text-muted-foreground" />
                                            <p className="text-muted-foreground">No expenses found.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                        <TableFooter>
                            {table.getFooterGroups().map((footerGroup) => (
                                <TableRow 
                                    key={footerGroup.id}
                                    className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 dark:from-primary/20 dark:via-primary/10 dark:to-primary/20 border-t-2 border-primary/20"
                                >
                                    {footerGroup.headers.map((header) => {
                                        const hasFooter = header.column.columnDef.footer;
                                        const isAmountColumn = header.id === "amount";
                                        return (
                                            <TableCell 
                                                key={header.id}
                                                className={`py-4 px-4 ${isAmountColumn ? "text-right" : ""}`}
                                            >
                                                {header.isPlaceholder ? null : hasFooter ? (
                                                    <div className={`flex items-center gap-2 ${isAmountColumn ? "justify-end" : ""}`}>
                                                        {isAmountColumn && (
                                                            <DollarSign className="h-5 w-5 text-primary" />
                                                        )}
                                                        <span className="font-bold text-lg text-primary">
                                                            {flexRender(
                                                                header.column.columnDef.footer,
                                                                header.getContext()
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm font-medium">
                                                        {isAmountColumn ? "Total" : ""}
                                                    </span>
                                                )}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableFooter>
                    </Table>
                </div>
            </Card>
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                        table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length} expenses
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="hover:scale-105 transition-transform disabled:opacity-50"
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="hover:scale-105 transition-transform disabled:opacity-50"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
