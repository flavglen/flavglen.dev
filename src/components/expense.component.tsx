"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { format, addDays } from "date-fns"
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
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Calendar } from "./ui/calendar"
import { ArrowUpDown, CalendarIcon } from "lucide-react"

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
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [expenses, setExpenses] = React.useState<Expense[]>([]);
    const [open, setOpen] = React.useState(false)

       
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

 
    const columns1 = React.useMemo<ColumnDef<Expense>[]>(() => [
        {
            accessorKey: "place",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Place
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue("place")}</div>,
        },
        {
            accessorKey: "amount",
            header: () => <div className="text-right">Amount</div>,
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("amount"));
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(amount);
                return <div className="text-right font-medium">{formatted}</div>;
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
                >
                    Date
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="lowercase">
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
                >
                    Category
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue("category")}</div>,
        },
        {
            accessorKey: "docId",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Doc ID
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-mono text-xs text-gray-600 break-all">
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
                >
                    ID
                    <ArrowUpDown />
                </Button>
            ),
            cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
        },
        {
            id: "actions",
            header: () => <span>Action</span>,
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="destructive"
                        onClick={() => { setSelectedDocId(row.getValue("docId"))}}
                    >
                        Delete
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


    const ConfirmDialog = React.useCallback(() => {
        let text = "Press a button!\nEither OK or Cancel.";
        if (confirm(text) == true) {
            deleteRow(selectedDocId);
        } else {
            console.log("You pressed Not OK!");
            setSelectedDocId(null);
        }
    },[selectedDocId])

    
    React.useEffect(() => {
        if(selectedDocId) {
            console.log("Selected docId:", selectedDocId);
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

    return (
        <div className="w-full relative">
            {/* Total Expenses Summary */}
            <div className="mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Count</p>
                                <p className="text-2xl font-bold">{totalExpenses}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                <p className="text-2xl font-bold">
                                    {new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    }).format(totalAmount)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top 4 Categories Cards */}
            {categorySummary.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Top Categories</h2>
                    <div className="grid grid-cols-4 gap-2 sm:gap-4">
                        {categorySummary.map((cat, index) => (
                            <Card key={cat.category}>
                                <CardHeader className="pb-2 p-3 sm:p-6">
                                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                                        {index + 1}. {cat.category}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 pt-0 sm:p-6 sm:pt-0">
                                    <div className="space-y-1 sm:space-y-2">
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground">Count</p>
                                            <p className="text-sm sm:text-xl font-bold">{cat.count}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-muted-foreground">Total</p>
                                            <p className="text-xs sm:text-lg font-semibold truncate">
                                                {new Intl.NumberFormat("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                }).format(cat.total)}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
                                <span>Pick a date</span>
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
                <Button variant="default" className="w-full sm:w-auto sm:ml-5" onClick={fetchExpenses}>Fetch</Button>
            </div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter Expenses ..."
                    value={globalFilter ?? ""}
                    onChange={(event) => {
                        table.setGlobalFilter(event.target.value)
                        //table.getColumn("place")?.setFilterValue(event.target.value)
                    }
                    }
                    className="w-full max-w-sm"
                />
            </div>
            <div className="rounded-md border overflow-x-auto w-full">
                <Table className="min-w-[800px] w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        {table.getFooterGroups().map((footerGroup) => (
                            <TableRow key={footerGroup.id}>
                                {footerGroup.headers.map((header) => (
                                    <TableCell key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.footer,
                                                header.getContext()
                                            )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableFooter>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
