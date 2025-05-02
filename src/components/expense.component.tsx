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
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Calendar } from "./ui/calendar"
import { ArrowUpDown, CalendarIcon } from "lucide-react"

export type Expense = {
    id: string;
    amount: number;
    internalDate: string;
    place: string;
    time?: string;
};

export const columns1: ColumnDef<Expense>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "place",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Place
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("place")}</div>,
    },
    {
        accessorKey: "internalDate",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{new Date(row.getValue("internalDate")).toLocaleString()}</div>,
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("category")}</div>,
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"))
            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
        },
        footer: ({ table }) => {
            const total = table.getFilteredRowModel().rows.reduce((sum, row) => sum + row.original.amount, 0)
            const formattedTotal = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(total)
            return <div className="text-right font-medium">{formattedTotal}</div>
        },
    },
]

export function ExpenseComponent() {
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


    const fetchExpenses = async ()  =>{
        try {
            const dateTo = date?.to ? addDays(date.to, 1) : null;
            const dateFrom = date?.from || null;

            if(!dateTo || !dateFrom) {
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

    React.useEffect(() => {
        void fetchExpenses();
    }, [])


    React.useEffect(() => {
        console.log("date", date)
    },[date])

    return (
        <div className="w-full relative">
            <div className="flex items-center">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
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
                <Button variant="default" className="ml-5" onClick={fetchExpenses}>Fetch</Button>
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
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
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
                {/* <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div> */}
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
