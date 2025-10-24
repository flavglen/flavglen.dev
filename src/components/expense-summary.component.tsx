"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addDays, subDays, getWeek, getYear, getMonth } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Calendar } from "./ui/calendar"
import { CalendarIcon, Download, FileText, Search } from "lucide-react"
import { Expense } from "./expense.component"

export interface ExpenseSummary {
    period: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    transactionCount: number;
    averageAmount: number;
    categories: {
        [key: string]: {
            total: number;
            count: number;
            percentage: number;
        };
    };
    topPlaces: Array<{
        place: string;
        amount: number;
        count: number;
    }>;
    expenses: Expense[];
}

export interface SegregatedExpenses {
    weekly: ExpenseSummary[];
    monthly: ExpenseSummary[];
    yearly: ExpenseSummary[];
    searchOptimized: {
        embeddings: Array<{
            text: string;
            metadata: {
                period: string;
                category: string;
                amount: number;
                date: string;
                place: string;
            };
        }>;
        trainingData: Array<{
            input: string;
            output: string;
            context: string;
        }>;
    };
}

export function ExpenseSummaryComponent() {
    const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null);
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 365), // Last year by default
        to: new Date(),
    })
    const [expenses, setExpenses] = React.useState<Expense[]>([]);
    const [segregatedData, setSegregatedData] = React.useState<SegregatedExpenses | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'weekly' | 'monthly' | 'yearly'>('monthly');

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const dateTo = date?.to ? addDays(date.to, 1) : null;
            const dateFrom = date?.from || null;

            if (!dateTo || !dateFrom) {
                throw new Error("Invalid date range");
            }

            const response = await fetch(`/api/protected/expenses?from=${dateFrom?.toISOString()}&to=${dateTo?.toISOString()}`);
            const data = await response.json();
            const dataFormatted = data?.data?.map((expense: Expense) => ({ ...expense, amount: +expense.amount }));
            setExpenses(dataFormatted || []);
            
            // Process the data for segregation
            const segregated = processExpenseData(dataFormatted || []);
            setSegregatedData(segregated);
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
        } finally {
            setLoading(false);
        }
    }

    const processExpenseData = (expenses: Expense[]): SegregatedExpenses => {
        // Group by week
        const weeklyData = groupByWeek(expenses);
        // Group by month
        const monthlyData = groupByMonth(expenses);
        // Group by year
        const yearlyData = groupByYear(expenses);
        
        // Create search-optimized data
        const searchOptimized = createSearchOptimizedData(expenses);

        return {
            weekly: weeklyData,
            monthly: monthlyData,
            yearly: yearlyData,
            searchOptimized
        };
    }

    const groupByWeek = (expenses: Expense[]): ExpenseSummary[] => {
        const weekGroups: { [key: string]: Expense[] } = {};
        
        expenses.forEach(expense => {
            const date = new Date(expense.internalDate);
            const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
            const weekKey = format(weekStart, 'yyyy-MM-dd');
            
            if (!weekGroups[weekKey]) {
                weekGroups[weekKey] = [];
            }
            weekGroups[weekKey].push(expense);
        });

        return Object.entries(weekGroups).map(([weekKey, weekExpenses]) => {
            return createSummary(weekExpenses, `Week of ${format(new Date(weekKey), 'MMM dd, yyyy')}`, weekKey, endOfWeek(new Date(weekKey), { weekStartsOn: 1 }));
        });
    }

    const groupByMonth = (expenses: Expense[]): ExpenseSummary[] => {
        const monthGroups: { [key: string]: Expense[] } = {};
        
        expenses.forEach(expense => {
            const date = new Date(expense.internalDate);
            const monthKey = format(date, 'yyyy-MM');
            
            if (!monthGroups[monthKey]) {
                monthGroups[monthKey] = [];
            }
            monthGroups[monthKey].push(expense);
        });

        return Object.entries(monthGroups).map(([monthKey, monthExpenses]) => {
            const date = new Date(monthKey + '-01');
            return createSummary(monthExpenses, format(date, 'MMMM yyyy'), monthKey, endOfMonth(date));
        });
    }

    const groupByYear = (expenses: Expense[]): ExpenseSummary[] => {
        const yearGroups: { [key: string]: Expense[] } = {};
        
        expenses.forEach(expense => {
            const date = new Date(expense.internalDate);
            const yearKey = date.getFullYear().toString();
            
            if (!yearGroups[yearKey]) {
                yearGroups[yearKey] = [];
            }
            yearGroups[yearKey].push(expense);
        });

        return Object.entries(yearGroups).map(([yearKey, yearExpenses]) => {
            const date = new Date(parseInt(yearKey), 0, 1);
            return createSummary(yearExpenses, yearKey, yearKey, endOfYear(date));
        });
    }

    const createSummary = (expenses: Expense[], period: string, startKey: string, endDate: Date): ExpenseSummary => {
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const transactionCount = expenses.length;
        const averageAmount = transactionCount > 0 ? totalAmount / transactionCount : 0;

        // Category breakdown
        const categories: { [key: string]: { total: number; count: number; percentage: number } } = {};
        expenses.forEach(expense => {
            if (!categories[expense.category]) {
                categories[expense.category] = { total: 0, count: 0, percentage: 0 };
            }
            categories[expense.category].total += expense.amount;
            categories[expense.category].count += 1;
        });

        // Add percentage to categories
        Object.keys(categories).forEach(category => {
            categories[category].percentage = (categories[category].total / totalAmount) * 100;
        });

        // Top places
        const placeTotals: { [key: string]: { amount: number; count: number } } = {};
        expenses.forEach(expense => {
            if (!placeTotals[expense.place]) {
                placeTotals[expense.place] = { amount: 0, count: 0 };
            }
            placeTotals[expense.place].amount += expense.amount;
            placeTotals[expense.place].count += 1;
        });

        const topPlaces = Object.entries(placeTotals)
            .map(([place, data]) => ({ place, ...data }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        return {
            period,
            startDate: startKey,
            endDate: endDate.toISOString(),
            totalAmount,
            transactionCount,
            averageAmount,
            categories,
            topPlaces,
            expenses
        };
    }

    const createSearchOptimizedData = (expenses: Expense[]) => {
        const embeddings: Array<{
            text: string;
            metadata: {
                period: string;
                category: string;
                amount: number;
                date: string;
                place: string;
            };
        }> = [];

        const trainingData: Array<{
            input: string;
            output: string;
            context: string;
        }> = [];

        expenses.forEach(expense => {
            const date = new Date(expense.internalDate);
            const period = format(date, 'yyyy-MM');
            
            // Create embedding text
            const embeddingText = `Expense at ${expense.place} for $${expense.amount} in ${expense.category} category on ${format(date, 'MMM dd, yyyy')}`;
            
            embeddings.push({
                text: embeddingText,
                metadata: {
                    period,
                    category: expense.category,
                    amount: expense.amount,
                    date: expense.internalDate,
                    place: expense.place
                }
            });

            // Create training data for AI
            trainingData.push({
                input: `What did I spend on ${expense.category}?`,
                output: `You spent $${expense.amount} at ${expense.place} on ${format(date, 'MMM dd, yyyy')}`,
                context: `Expense category: ${expense.category}, Amount: $${expense.amount}, Place: ${expense.place}, Date: ${format(date, 'yyyy-MM-dd')}`
            });
        });

        return { embeddings, trainingData };
    }

    const exportData = (exportFormat: 'json' | 'csv' | 'training') => {
        if (!segregatedData) return;

        let dataToExport: any;
        let filename: string;
        let mimeType: string;

        switch (exportFormat) {
            case 'json':
                dataToExport = segregatedData;
                filename = `expense-summary-${format(new Date(), 'yyyy-MM-dd')}.json`;
                mimeType = 'application/json';
                break;
            case 'csv':
                dataToExport = convertToCSV(segregatedData);
                filename = `expense-summary-${format(new Date(), 'yyyy-MM-dd')}.csv`;
                mimeType = 'text/csv';
                break;
            case 'training':
                dataToExport = segregatedData.searchOptimized.trainingData;
                filename = `expense-training-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
                mimeType = 'application/json';
                break;
        }

        const blob = new Blob([typeof dataToExport === 'string' ? dataToExport : JSON.stringify(dataToExport, null, 2)], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const convertToCSV = (data: SegregatedExpenses): string => {
        const headers = ['Period', 'Start Date', 'End Date', 'Total Amount', 'Transaction Count', 'Average Amount', 'Top Category', 'Top Place'];
        const rows = [headers.join(',')];

        const allSummaries = [...data.weekly, ...data.monthly, ...data.yearly];
        allSummaries.forEach(summary => {
            const topCategory = Object.entries(summary.categories)
                .sort(([,a], [,b]) => b.total - a.total)[0];
            const topPlace = summary.topPlaces[0];
            
            rows.push([
                summary.period,
                summary.startDate,
                summary.endDate,
                summary.totalAmount,
                summary.transactionCount,
                summary.averageAmount,
                topCategory ? topCategory[0] : '',
                topPlace ? topPlace.place : ''
            ].join(','));
        });

        return rows.join('\n');
    }

    React.useEffect(() => {
        void fetchExpenses();
    }, [])

    const currentData = segregatedData ? segregatedData[activeTab] : [];

    return (
        <div className="w-full space-y-6">
            {/* Date Range Selector */}
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
                <Button variant="default" onClick={fetchExpenses} disabled={loading} className="w-full sm:w-auto">
                    {loading ? "Loading..." : "Fetch Data"}
                </Button>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => exportData('json')} disabled={!segregatedData} className="flex-1 sm:flex-none">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Export JSON</span>
                    <span className="sm:hidden">JSON</span>
                </Button>
                <Button variant="outline" onClick={() => exportData('csv')} disabled={!segregatedData} className="flex-1 sm:flex-none">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Export CSV</span>
                    <span className="sm:hidden">CSV</span>
                </Button>
                <Button variant="outline" onClick={() => exportData('training')} disabled={!segregatedData} className="flex-1 sm:flex-none">
                    <Search className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Export Training Data</span>
                    <span className="sm:hidden">Training</span>
                </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2">
                <Button 
                    variant={activeTab === 'weekly' ? 'default' : 'outline'} 
                    onClick={() => setActiveTab('weekly')}
                    className="flex-1 sm:flex-none"
                >
                    <span className="hidden sm:inline">Weekly</span>
                    <span className="sm:hidden">Week</span>
                </Button>
                <Button 
                    variant={activeTab === 'monthly' ? 'default' : 'outline'} 
                    onClick={() => setActiveTab('monthly')}
                    className="flex-1 sm:flex-none"
                >
                    <span className="hidden sm:inline">Monthly</span>
                    <span className="sm:hidden">Month</span>
                </Button>
                <Button 
                    variant={activeTab === 'yearly' ? 'default' : 'outline'} 
                    onClick={() => setActiveTab('yearly')}
                    className="flex-1 sm:flex-none"
                >
                    <span className="hidden sm:inline">Yearly</span>
                    <span className="sm:hidden">Year</span>
                </Button>
            </div>

            {/* Summary Table */}
            {segregatedData && (
                <div className="rounded-md border overflow-x-auto">
                    <Table className="min-w-[600px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Transactions</TableHead>
                                <TableHead>Average</TableHead>
                                <TableHead>Top Category</TableHead>
                                <TableHead>Top Place</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.map((summary, index) => {
                                const topCategory = Object.entries(summary.categories)
                                    .sort(([,a], [,b]) => b.total - a.total)[0];
                                const topPlace = summary.topPlaces[0];
                                
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{summary.period}</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(summary.totalAmount)}
                                        </TableCell>
                                        <TableCell>{summary.transactionCount}</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(summary.averageAmount)}
                                        </TableCell>
                                        <TableCell>
                                            {topCategory ? `${topCategory[0]} (${topCategory[1].percentage.toFixed(1)}%)` : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {topPlace ? `${topPlace.place} ($${topPlace.amount.toFixed(2)})` : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Search Optimized Data Preview */}
            {segregatedData && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Search Optimized Data</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-2">Embeddings Sample (First 3)</h4>
                            <div className="space-y-2">
                                {segregatedData.searchOptimized.embeddings.slice(0, 3).map((embedding, index) => (
                                    <div key={index} className="p-3 border rounded text-sm">
                                        <div className="font-medium">{embedding.text}</div>
                                        <div className="text-gray-500 text-xs mt-1">
                                            {embedding.metadata.category} • {embedding.metadata.period}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Training Data Sample (First 3)</h4>
                            <div className="space-y-2">
                                {segregatedData.searchOptimized.trainingData.slice(0, 3).map((training, index) => (
                                    <div key={index} className="p-3 border rounded text-sm">
                                        <div className="font-medium">Input: {training.input}</div>
                                        <div className="text-gray-600">Output: {training.output}</div>
                                        <div className="text-gray-500 text-xs mt-1">Context: {training.context}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
