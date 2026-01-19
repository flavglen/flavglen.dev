"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { format as formatDate, addDays, subDays } from "date-fns"
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
import { CalendarIcon, Download, FileText, Search, RefreshCw, Database } from "lucide-react"
import { PeriodData, PeriodAnalytics } from "@/lib/expense-periods"
import { clientCache } from "@/lib/client-cache"

export function ExpenseSummaryFirebaseComponent() {
    const [mounted, setMounted] = React.useState(false)
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 365), // Last year by default
        to: new Date(),
    })

    React.useEffect(() => {
        setMounted(true)
    }, [])
    const [periodAnalytics, setPeriodAnalytics] = React.useState<PeriodAnalytics | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [syncing, setSyncing] = React.useState(false);

    const fetchPeriodAnalytics = async () => {
        setLoading(true);
        try {
            const dateTo = date?.to ? addDays(date.to, 1) : null;
            const dateFrom = date?.from || null;

            if (!dateTo || !dateFrom) {
                throw new Error("Invalid date range");
            }

            const url = `/api/protected/expense-periods?startDate=${dateFrom?.toISOString()}&endDate=${dateTo?.toISOString()}`;
            
            // Create a more stable cache key by normalizing the dates to the start of the day
            const normalizedStart = dateFrom ? new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate()).toISOString() : '';
            const normalizedEnd = dateTo ? new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate()).toISOString() : '';
            const cacheKey = `period-analytics:${normalizedStart}:${normalizedEnd}`;
            
            console.log(`[Firebase] Fetching period analytics for date range: ${dateFrom?.toISOString()} to ${dateTo?.toISOString()}`);
            console.log(`[Firebase] Normalized cache key: ${cacheKey}`);
            
            const data = await clientCache.get<{data: PeriodAnalytics}>(url, {}, {
                ttl: 5 * 60 * 1000, // 5 minutes cache for period analytics
                key: cacheKey
            });
            setPeriodAnalytics(data.data);
        } catch (error) {
            console.error("Failed to fetch period analytics:", error);
        } finally {
            setLoading(false);
        }
    }

    const syncPeriodData = async () => {
        setSyncing(true);
        try {
            const response = await fetch('/api/protected/expense-periods', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'sync' })
            });
            
            const result = await response.json();
            if (result.success) {
                // Invalidate cache after sync to ensure fresh data
                clientCache.invalidate('period-analytics');
                alert("Period data synced successfully!");
                await fetchPeriodAnalytics(); // Refresh data
            } else {
                alert("Failed to sync period data");
            }
        } catch (error) {
            console.error("Failed to sync period data:", error);
            alert("Failed to sync period data");
        } finally {
            setSyncing(false);
        }
    }

    const exportData = (format: 'json' | 'csv' | 'training') => {
        if (!periodAnalytics) return;

        let dataToExport: any;
        let filename: string;
        let mimeType: string;

        switch (format) {
            case 'json':
                dataToExport = periodAnalytics;
                filename = `expense-period-analytics-${formatDate(new Date(), 'yyyy-MM-dd')}.json`;
                mimeType = 'application/json';
                break;
            case 'csv':
                dataToExport = convertToCSV(periodAnalytics);
                filename = `expense-period-analytics-${formatDate(new Date(), 'yyyy-MM-dd')}.csv`;
                mimeType = 'text/csv';
                break;
            case 'training':
                dataToExport = generateTrainingData(periodAnalytics);
                filename = `expense-training-data-${formatDate(new Date(), 'yyyy-MM-dd')}.json`;
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

    const convertToCSV = (analytics: PeriodAnalytics): string => {
        const headers = ['Period Type', 'Period', 'Start Date', 'End Date', 'Total Amount', 'Transaction Count', 'Average Amount', 'Top Category', 'Top Place'];
        const rows = [headers.join(',')];

        const allPeriods = [
            ...analytics.weekly.map(p => ({ ...p, periodType: 'Weekly' })),
            ...analytics.monthly.map(p => ({ ...p, periodType: 'Monthly' })),
            ...analytics.yearly.map(p => ({ ...p, periodType: 'Yearly' }))
        ];

        allPeriods.forEach(period => {
            const topCategory = Object.entries(period.categories)
                .sort(([,a], [,b]) => b.total - a.total)[0];
            const topPlace = period.topPlaces[0];
            
            rows.push([
                period.periodType,
                period.metadata.periodDisplay,
                period.startDate,
                period.endDate,
                period.totalAmount,
                period.transactionCount,
                period.averageAmount,
                topCategory ? topCategory[0] : '',
                topPlace ? topPlace.place : ''
            ].join(','));
        });

        return rows.join('\n');
    }

    const generateTrainingData = (analytics: PeriodAnalytics) => {
        const trainingData: Array<{
            input: string;
            output: string;
            context: string;
        }> = [];

        // Generate training data for each period
        const allPeriods = [...analytics.weekly, ...analytics.monthly, ...analytics.yearly];
        
        allPeriods.forEach(period => {
            // Category-based queries
            Object.entries(period.categories).forEach(([category, data]) => {
                trainingData.push({
                    input: `How much did I spend on ${category} in ${period.metadata.periodDisplay}?`,
                    output: `You spent $${data.total.toFixed(2)} on ${category} in ${period.metadata.periodDisplay} (${data.count} transactions)`,
                    context: `Period: ${period.metadata.periodDisplay}, Category: ${category}, Amount: $${data.total}, Count: ${data.count}, Percentage: ${data.percentage.toFixed(1)}%`
                });
            });

            // Top places queries
            period.topPlaces.slice(0, 3).forEach(place => {
                trainingData.push({
                    input: `Where did I spend the most in ${period.metadata.periodDisplay}?`,
                    output: `You spent the most at ${place.place} with $${place.amount.toFixed(2)} in ${period.metadata.periodDisplay}`,
                    context: `Period: ${period.metadata.periodDisplay}, Place: ${place.place}, Amount: $${place.amount}, Count: ${place.count}`
                });
            });

            // Summary queries
            trainingData.push({
                input: `What was my total spending in ${period.metadata.periodDisplay}?`,
                output: `Your total spending in ${period.metadata.periodDisplay} was $${period.totalAmount.toFixed(2)} across ${period.transactionCount} transactions`,
                context: `Period: ${period.metadata.periodDisplay}, Total: $${period.totalAmount}, Count: ${period.transactionCount}, Average: $${period.averageAmount.toFixed(2)}`
            });
        });

        return trainingData;
    }

    React.useEffect(() => {
        void fetchPeriodAnalytics();
    }, [])

    const currentData = periodAnalytics ? periodAnalytics[activeTab] : [];

    return (
        <div className="w-full space-y-6">
            {/* Header with Sync Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Expense Analytics (Firebase)</h2>
                    <p className="text-sm sm:text-base text-gray-600">Period-based analytics with Firebase storage</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button 
                        variant="outline" 
                        onClick={syncPeriodData} 
                        disabled={syncing}
                        className="flex items-center space-x-2"
                    >
                        <Database className="w-4 h-4" />
                        <span className="hidden sm:inline">{syncing ? "Syncing..." : "Sync Period Data"}</span>
                        <span className="sm:hidden">{syncing ? "Syncing..." : "Sync"}</span>
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            clientCache.clearAll();
                            alert('Cache cleared! Data will be refreshed on next request.');
                        }}
                        className="flex items-center space-x-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="hidden sm:inline">Clear Cache</span>
                        <span className="sm:hidden">Clear</span>
                    </Button>
                </div>
            </div>

            {/* Date Range Selector */}
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
                                            {formatDate(date.from, "LLL dd, y")} - {formatDate(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        formatDate(date.from, "LLL dd, y")
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
                <Button variant="default" onClick={fetchPeriodAnalytics} disabled={loading} className="w-full sm:w-auto">
                    <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                    {loading ? "Loading..." : "Fetch Analytics"}
                </Button>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => exportData('json')} disabled={!periodAnalytics} className="flex-1 sm:flex-none">
                    <Download className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Export JSON</span>
                    <span className="sm:hidden">JSON</span>
                </Button>
                <Button variant="outline" onClick={() => exportData('csv')} disabled={!periodAnalytics} className="flex-1 sm:flex-none">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Export CSV</span>
                    <span className="sm:hidden">CSV</span>
                </Button>
                <Button variant="outline" onClick={() => exportData('training')} disabled={!periodAnalytics} className="flex-1 sm:flex-none">
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
                    <span className="ml-1">({periodAnalytics?.weekly.length || 0})</span>
                </Button>
                <Button 
                    variant={activeTab === 'monthly' ? 'default' : 'outline'} 
                    onClick={() => setActiveTab('monthly')}
                    className="flex-1 sm:flex-none"
                >
                    <span className="hidden sm:inline">Monthly</span>
                    <span className="sm:hidden">Month</span>
                    <span className="ml-1">({periodAnalytics?.monthly.length || 0})</span>
                </Button>
                <Button 
                    variant={activeTab === 'yearly' ? 'default' : 'outline'} 
                    onClick={() => setActiveTab('yearly')}
                    className="flex-1 sm:flex-none"
                >
                    <span className="hidden sm:inline">Yearly</span>
                    <span className="sm:hidden">Year</span>
                    <span className="ml-1">({periodAnalytics?.yearly.length || 0})</span>
                </Button>
            </div>

            {/* Summary Stats */}
            {periodAnalytics && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">{periodAnalytics.totalExpenses}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Total Transactions</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-green-600">
                            ${periodAnalytics.totalAmount.toLocaleString()}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Total Amount</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600">{periodAnalytics.weekly.length}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Weekly Periods</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-orange-600">{periodAnalytics.monthly.length}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Monthly Periods</div>
                    </div>
                </div>
            )}

            {/* Period Data Table */}
            {periodAnalytics && (
                <div className="rounded-md border overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Period</TableHead>
                                <TableHead>Total Amount</TableHead>
                                <TableHead>Transactions</TableHead>
                                <TableHead>Average</TableHead>
                                <TableHead>Top Category</TableHead>
                                <TableHead>Top Place</TableHead>
                                <TableHead>Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.map((period, index) => {
                                // Debug logging
                                if (index === 0) {
                                    console.log('Sample period data:', {
                                        period: period.metadata.periodDisplay,
                                        categories: period.categories,
                                        topPlaces: period.topPlaces
                                    });
                                }
                                
                                const topCategory = period.categories && Object.keys(period.categories).length > 0 
                                    ? Object.entries(period.categories).sort(([,a], [,b]) => b.total - a.total)[0]
                                    : null;
                                const topPlace = period.topPlaces && period.topPlaces.length > 0 
                                    ? period.topPlaces[0] 
                                    : null;
                                
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">
                                            <div>
                                                <div className="font-semibold">{period.metadata.periodDisplay}</div>
                                                <div className="text-sm text-gray-500">{period.periodKey}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(period.totalAmount)}
                                        </TableCell>
                                        <TableCell>{period.transactionCount}</TableCell>
                                        <TableCell>
                                            {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                            }).format(period.averageAmount)}
                                        </TableCell>
                                        <TableCell>
                                            {topCategory ? (
                                                <div>
                                                    <div className="font-medium">{topCategory[0]}</div>
                                                    <div className="text-sm text-gray-500">{topCategory[1].percentage.toFixed(1)}%</div>
                                                </div>
                                            ) : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {topPlace ? (
                                                <div>
                                                    <div className="font-medium">{topPlace.place}</div>
                                                    <div className="text-sm text-gray-500">${topPlace.amount.toFixed(2)}</div>
                                                </div>
                                            ) : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {formatDate(new Date(period.lastUpdated), 'MMM dd, yyyy HH:mm')}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Training Data Preview */}
            {periodAnalytics && (
                <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold">AI Training Data Preview</h3>
                    <div className="space-y-2">
                        {generateTrainingData(periodAnalytics).slice(0, 5).map((training, index) => (
                            <div key={index} className="p-3 border rounded text-xs sm:text-sm">
                                <div className="font-medium text-blue-600 break-words">Input: {training.input}</div>
                                <div className="text-gray-700 mt-1 break-words">Output: {training.output}</div>
                                <div className="text-gray-500 text-xs mt-1 break-words">Context: {training.context}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
