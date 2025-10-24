"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { format as formatDate, addDays, subDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover"
import { Calendar } from "./ui/calendar"
import { CalendarIcon, RefreshCw, Database, TrendingUp, DollarSign, BarChart3, PieChart } from "lucide-react"
import { PeriodData, PeriodAnalytics } from "@/lib/expense-periods"
import { clientCache, CACHE_TTL } from "@/lib/client-cache"
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart
} from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

export function ExpenseDashboardComponent() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 365), // Last year by default
        to: new Date(),
    })
    const [periodAnalytics, setPeriodAnalytics] = React.useState<PeriodAnalytics | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [activePeriod, setActivePeriod] = React.useState<'weekly' | 'monthly' | 'yearly'>('monthly');

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
            
            console.log(`[Dashboard] Fetching period analytics for date range: ${dateFrom?.toISOString()} to ${dateTo?.toISOString()}`);
            console.log(`[Dashboard] Normalized cache key: ${cacheKey}`);
            
            const data = await clientCache.get<{data: PeriodAnalytics}>(url, {}, {
                ttl: CACHE_TTL.PERIOD_ANALYTICS,
                key: cacheKey
            });
            setPeriodAnalytics(data.data);
        } catch (error) {
            console.error("Failed to fetch period analytics:", error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        void fetchPeriodAnalytics();
    }, [])

    // Prepare data for charts
    const prepareChartData = () => {
        if (!periodAnalytics) return { monthlyData: [], categoryData: [], trendData: [] };

        const currentData = periodAnalytics[activePeriod];
        
        // Monthly trend data
        const monthlyData = currentData.map(period => ({
            period: period.metadata.periodDisplay,
            amount: period.totalAmount,
            transactions: period.transactionCount,
            average: period.averageAmount,
            date: new Date(period.startDate).getTime()
        })).sort((a, b) => a.date - b.date);

        // Category breakdown
        const categoryTotals: { [key: string]: number } = {};
        currentData.forEach(period => {
            Object.entries(period.categories).forEach(([category, data]) => {
                categoryTotals[category] = (categoryTotals[category] || 0) + data.total;
            });
        });

        const categoryData = Object.entries(categoryTotals)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 8);

        // Top places data
        const placeTotals: { [key: string]: number } = {};
        currentData.forEach(period => {
            period.topPlaces.forEach(place => {
                placeTotals[place.place] = (placeTotals[place.place] || 0) + place.amount;
            });
        });

        const topPlacesData = Object.entries(placeTotals)
            .map(([place, amount]) => ({ place, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10);

        return { monthlyData, categoryData, topPlacesData };
    };

    const { monthlyData, categoryData, topPlacesData } = prepareChartData();

    const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
    const formatNumber = (value: number) => value.toLocaleString();

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold">Expense Dashboard</h2>
                    <p className="text-sm sm:text-base text-gray-600">Visual analytics and insights for your expense data</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button 
                        variant="outline" 
                        onClick={fetchPeriodAnalytics} 
                        disabled={loading}
                        className="flex items-center space-x-2"
                    >
                        <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                        <span>{loading ? "Loading..." : "Refresh Data"}</span>
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            clientCache.clearAll();
                            alert('Cache cleared! Data will be refreshed on next request.');
                        }}
                        className="flex items-center space-x-2"
                    >
                        <Database className="w-4 h-4" />
                        <span className="hidden sm:inline">Clear Cache</span>
                        <span className="sm:hidden">Clear</span>
                    </Button>
                </div>
            </div>

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
                <Button variant="default" onClick={fetchPeriodAnalytics} disabled={loading} className="w-full sm:w-auto">
                    <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                    {loading ? "Loading..." : "Update Charts"}
                </Button>
            </div>

            {/* Period Selector */}
            <div className="flex flex-wrap gap-2">
                <Button 
                    variant={activePeriod === 'weekly' ? 'default' : 'outline'} 
                    onClick={() => setActivePeriod('weekly')}
                    className="flex-1 sm:flex-none"
                >
                    <span className="hidden sm:inline">Weekly</span>
                    <span className="sm:hidden">Week</span>
                </Button>
                <Button 
                    variant={activePeriod === 'monthly' ? 'default' : 'outline'} 
                    onClick={() => setActivePeriod('monthly')}
                    className="flex-1 sm:flex-none"
                >
                    <span className="hidden sm:inline">Monthly</span>
                    <span className="sm:hidden">Month</span>
                </Button>
                <Button 
                    variant={activePeriod === 'yearly' ? 'default' : 'outline'} 
                    onClick={() => setActivePeriod('yearly')}
                    className="flex-1 sm:flex-none"
                >
                    <span className="hidden sm:inline">Yearly</span>
                    <span className="sm:hidden">Year</span>
                </Button>
            </div>

            {/* Summary Cards */}
            {periodAnalytics && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(periodAnalytics.totalAmount)}</div>
                            <p className="text-xs text-muted-foreground">
                                {periodAnalytics.totalExpenses} transactions
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(periodAnalytics.totalAmount / periodAnalytics.totalExpenses)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Per transaction
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Periods Analyzed</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{monthlyData.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {activePeriod} periods
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
                            <PieChart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {categoryData[0]?.category || 'N/A'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {categoryData[0] ? formatCurrency(categoryData[0].amount) : 'No data'}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spending Trend Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Spending Trend</CardTitle>
                        <CardDescription>Total amount over time by {activePeriod} periods</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="period" 
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip 
                                        formatter={(value: number) => [formatCurrency(value), 'Amount']}
                                        labelStyle={{ fontSize: 12 }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="amount" 
                                        stroke="#8884d8" 
                                        fill="#8884d8" 
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Breakdown</CardTitle>
                        <CardDescription>Spending distribution by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="amount"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Amount']} />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Transaction Volume */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaction Volume</CardTitle>
                        <CardDescription>Number of transactions over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="period" 
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip 
                                        formatter={(value: number) => [formatNumber(value), 'Transactions']}
                                        labelStyle={{ fontSize: 12 }}
                                    />
                                    <Bar dataKey="transactions" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Places */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Spending Places</CardTitle>
                        <CardDescription>Highest spending locations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topPlacesData} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" tick={{ fontSize: 12 }} />
                                    <YAxis 
                                        dataKey="place" 
                                        type="category" 
                                        tick={{ fontSize: 12 }}
                                        width={100}
                                    />
                                    <Tooltip 
                                        formatter={(value: number) => [formatCurrency(value), 'Amount']}
                                        labelStyle={{ fontSize: 12 }}
                                    />
                                    <Bar dataKey="amount" fill="#ffc658" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Combined Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Spending & Transaction Analysis</CardTitle>
                    <CardDescription>Combined view of amount and transaction trends</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="period" 
                                    tick={{ fontSize: 12 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                                <Tooltip 
                                    formatter={(value: number, name: string) => [
                                        name === 'amount' ? formatCurrency(value) : formatNumber(value),
                                        name === 'amount' ? 'Amount' : 'Transactions'
                                    ]}
                                    labelStyle={{ fontSize: 12 }}
                                />
                                <Legend />
                                <Bar yAxisId="left" dataKey="amount" fill="#8884d8" name="Amount" />
                                <Line yAxisId="right" type="monotone" dataKey="transactions" stroke="#82ca9d" name="Transactions" />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
