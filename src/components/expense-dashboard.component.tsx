"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { format as formatDate, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, eachWeekOfInterval, parseISO } from "date-fns"
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
import { CalendarIcon, RefreshCw, Database, TrendingUp, DollarSign, BarChart3, PieChart, FileText } from "lucide-react"
import { useBudgetAlerts } from "@/hooks/useBudgetAlerts"
import { BudgetAlertComponent } from "@/components/budget-alert"
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
    ComposedChart,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

interface Expense {
    id?: string;
    docId?: string;
    amount: number;
    place?: string;
    category?: string;
    internalDate?: string;
    [key: string]: any;
}

export function ExpenseDashboardComponent() {
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
    const [activePeriod, setActivePeriod] = React.useState<'weekly' | 'monthly' | 'yearly'>('monthly');
    const [showCurrentReport, setShowCurrentReport] = React.useState(false);
    const [currentMonthExpenses, setCurrentMonthExpenses] = React.useState<Expense[]>([]);
    const [reportLoading, setReportLoading] = React.useState(false);

    const fetchPeriodAnalytics = React.useCallback(async () => {
        console.log('[Dashboard] fetchPeriodAnalytics called with date:', date);
        
        if (!date?.from || !date?.to) {
            console.warn('[Dashboard] Invalid date range - missing from or to date');
            alert('Please select a complete date range (both start and end dates)');
            return;
        }

        setLoading(true);
        try {
            const dateTo = addDays(date.to, 1);
            const dateFrom = date.from;

            const url = `/api/protected/expense-periods?startDate=${dateFrom.toISOString()}&endDate=${dateTo.toISOString()}`;
            
            // Create a more stable cache key by normalizing the dates to the start of the day
            const normalizedStart = new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate()).toISOString();
            const normalizedEnd = new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate()).toISOString();
            const cacheKey = `period-analytics:${normalizedStart}:${normalizedEnd}`;
            
            console.log(`[Dashboard] Fetching period analytics for date range: ${dateFrom.toISOString()} to ${dateTo.toISOString()}`);
            console.log(`[Dashboard] Normalized cache key: ${cacheKey}`);
            console.log(`[Dashboard] API URL: ${url}`);
            
            const data = await clientCache.get<{data: PeriodAnalytics}>(url, {}, {
                ttl: CACHE_TTL.PERIOD_ANALYTICS,
                key: cacheKey
            });
            
            console.log('[Dashboard] Received data:', data);
            
            if (data && data.data) {
                setPeriodAnalytics(data.data);
                console.log('[Dashboard] Period analytics updated successfully');
            } else {
                console.warn('[Dashboard] No data received from API');
                setPeriodAnalytics(null);
            }
        } catch (error) {
            console.error("Failed to fetch period analytics:", error);
            setPeriodAnalytics(null);
            alert('Failed to fetch expense data. Please check the console for details.');
        } finally {
            setLoading(false);
        }
    }, [date])

    // Auto-fetch on initial load only
    React.useEffect(() => {
        if (date?.from && date?.to) {
            console.log('[Dashboard] Initial load - fetching analytics');
            void fetchPeriodAnalytics();
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch current month expenses for report
    const fetchCurrentMonthExpenses = async () => {
        setReportLoading(true);
        try {
            const now = new Date();
            const monthStart = startOfMonth(now);
            const monthEnd = endOfMonth(now);
            
            const response = await fetch(`/api/protected/expenses?from=${monthStart.toISOString()}&to=${addDays(monthEnd, 1).toISOString()}`);
            const data = await response.json();
            const dataFormatted = data?.data?.map((expense: Expense) => ({ ...expense, amount: +expense.amount }));
            setCurrentMonthExpenses(dataFormatted || []);
        } catch (error) {
            console.error("Failed to fetch current month expenses:", error);
        } finally {
            setReportLoading(false);
        }
    }

    React.useEffect(() => {
        if (showCurrentReport) {
            void fetchCurrentMonthExpenses();
        }
    }, [showCurrentReport])

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
            if (period.topPlaces && Array.isArray(period.topPlaces)) {
                period.topPlaces.forEach(place => {
                    if (place && place.place && typeof place.amount === 'number') {
                        placeTotals[place.place] = (placeTotals[place.place] || 0) + place.amount;
                    }
                });
            }
        });

        const topPlacesData = Object.entries(placeTotals)
            .filter(([place, amount]) => place && amount > 0)
            .map(([place, amount]) => ({ 
                place: place.trim() || 'Unknown', 
                amount: Number(amount) || 0 
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10);

        // Debug logging
        if (topPlacesData.length === 0) {
            console.log('[Dashboard] No top places data:', {
                currentDataLength: currentData.length,
                periodsWithPlaces: currentData.filter(p => p.topPlaces && p.topPlaces.length > 0).length,
                placeTotalsKeys: Object.keys(placeTotals).length
            });
        } else {
            console.log('[Dashboard] Top places data:', topPlacesData.slice(0, 3));
        }

        return { monthlyData, categoryData, topPlacesData };
    };

    const { monthlyData, categoryData, topPlacesData } = prepareChartData();
    
    // Debug: Log data for troubleshooting
    React.useEffect(() => {
        if (topPlacesData && topPlacesData.length > 0) {
            console.log('[Dashboard] Top Places Data:', topPlacesData);
        }
    }, [topPlacesData]);

    const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
    const formatNumber = (value: number) => value.toLocaleString();

    // Prepare report data
    const prepareReportData = () => {
        if (!currentMonthExpenses || currentMonthExpenses.length === 0) {
            return {
                dailyData: [],
                categoryData: [],
                weeklyData: [],
                placeData: [],
                dayOfWeekData: []
            };
        }

        // Daily spending data
        const dailyTotals: { [key: string]: number } = {};
        currentMonthExpenses.forEach(expense => {
            if (expense.internalDate) {
                const date = formatDate(parseISO(expense.internalDate), 'yyyy-MM-dd');
                dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount;
            }
        });

        const now = new Date();
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
        
        const dailyData = allDays.map(day => ({
            date: formatDate(day, 'MMM dd'),
            fullDate: formatDate(day, 'yyyy-MM-dd'),
            amount: dailyTotals[formatDate(day, 'yyyy-MM-dd')] || 0,
            dayName: formatDate(day, 'EEE')
        }));

        // Category breakdown
        const categoryTotals: { [key: string]: number } = {};
        currentMonthExpenses.forEach(expense => {
            const category = expense.category || 'Uncategorized';
            categoryTotals[category] = (categoryTotals[category] || 0) + expense.amount;
        });

        const categoryData = Object.entries(categoryTotals)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount);

        // Weekly comparison
        const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd }, { weekStartsOn: 1 });
        const weeklyData = weeks.map(week => {
            const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
            const weekExpenses = currentMonthExpenses.filter(expense => {
                if (!expense.internalDate) return false;
                const expenseDate = parseISO(expense.internalDate);
                return expenseDate >= week && expenseDate <= weekEnd;
            });
            const total = weekExpenses.reduce((sum, e) => sum + e.amount, 0);
            return {
                week: `Week ${weeks.indexOf(week) + 1}`,
                period: `${formatDate(week, 'MMM dd')} - ${formatDate(weekEnd, 'MMM dd')}`,
                amount: total,
                transactions: weekExpenses.length
            };
        });

        // Top places
        const placeTotals: { [key: string]: number } = {};
        currentMonthExpenses.forEach(expense => {
            const place = expense.place || 'Unknown';
            placeTotals[place] = (placeTotals[place] || 0) + expense.amount;
        });

        const placeData = Object.entries(placeTotals)
            .map(([place, amount]) => ({ place, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10);

        // Day of week analysis
        const dayOfWeekTotals: { [key: string]: { amount: number; count: number } } = {};
        currentMonthExpenses.forEach(expense => {
            if (expense.internalDate) {
                const dayName = formatDate(parseISO(expense.internalDate), 'EEEE');
                if (!dayOfWeekTotals[dayName]) {
                    dayOfWeekTotals[dayName] = { amount: 0, count: 0 };
                }
                dayOfWeekTotals[dayName].amount += expense.amount;
                dayOfWeekTotals[dayName].count += 1;
            }
        });

        const dayOfWeekOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const dayOfWeekData = dayOfWeekOrder.map(day => ({
            day,
            amount: dayOfWeekTotals[day]?.amount || 0,
            count: dayOfWeekTotals[day]?.count || 0
        }));

        return { dailyData, categoryData, weeklyData, placeData, dayOfWeekData };
    };

    const reportData = prepareReportData();
    const totalMonthAmount = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalTransactions = currentMonthExpenses.length;
    const averageTransaction = totalTransactions > 0 ? totalMonthAmount / totalTransactions : 0;

    // Check for budget alerts
    const { budgetAlerts } = useBudgetAlerts(currentMonthExpenses);

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-end space-y-4 sm:space-y-0">
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

            <div className="space-y-6 mt-6">
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
                <Button 
                    variant="default" 
                    onClick={() => {
                        console.log('[Dashboard] Update Charts button clicked');
                        console.log('[Dashboard] Current date state:', date);
                        void fetchPeriodAnalytics();
                    }} 
                    disabled={loading || !date?.from || !date?.to} 
                    className="w-full sm:w-auto"
                >
                    <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                    {loading ? "Loading..." : "Update Charts"}
                </Button>
            </div>

            {/* Period Selector */}
            <div className="flex flex-wrap gap-2">
                <Button 
                    variant={activePeriod === 'weekly' ? 'default' : 'outline'} 
                    onClick={() => {
                        setActivePeriod('weekly');
                        setShowCurrentReport(false);
                    }}
                    className="flex-1 sm:flex-none"
                >
                    <span className="hidden sm:inline">Weekly</span>
                    <span className="sm:hidden">Week</span>
                </Button>
                <Button 
                    variant={activePeriod === 'monthly' ? 'default' : 'outline'} 
                    onClick={() => {
                        setActivePeriod('monthly');
                        setShowCurrentReport(false);
                    }}
                    className="flex-1 sm:flex-none"
                >
                    <span className="hidden sm:inline">Monthly</span>
                    <span className="sm:hidden">Month</span>
                </Button>
                <Button 
                    variant={activePeriod === 'yearly' ? 'default' : 'outline'} 
                    onClick={() => {
                        setActivePeriod('yearly');
                        setShowCurrentReport(false);
                    }}
                    className="flex-1 sm:flex-none"
                >
                    <span className="hidden sm:inline">Yearly</span>
                    <span className="sm:hidden">Year</span>
                </Button>
                <Button 
                    variant={showCurrentReport ? 'default' : 'outline'} 
                    onClick={() => setShowCurrentReport(!showCurrentReport)}
                    className="flex-1 sm:flex-none"
                >
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Current Report</span>
                    <span className="sm:hidden">Report</span>
                </Button>
            </div>

            {!showCurrentReport && (
                <div className="space-y-6">
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
                                {topPlacesData && topPlacesData.length > 0 ? (
                                    <div className="h-[400px] sm:h-[450px] md:h-[500px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart 
                                                data={topPlacesData}
                                                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                <XAxis 
                                                    dataKey="place" 
                                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={80}
                                                    interval={0}
                                                    tickFormatter={(value) => {
                                                        return value && value.length > 15 ? value.substring(0, 12) + '...' : value || '';
                                                    }}
                                                    axisLine={{ stroke: '#d1d5db' }}
                                                />
                                                <YAxis 
                                                    tick={{ fontSize: 11, fill: '#6b7280' }}
                                                    tickFormatter={(value) => formatCurrency(value)}
                                                    axisLine={{ stroke: '#d1d5db' }}
                                                />
                                                <Tooltip 
                                                    formatter={(value: number) => [formatCurrency(value), 'Amount']}
                                                    labelFormatter={(label) => `Place: ${label || 'Unknown'}`}
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                                        border: '1px solid #e5e7eb',
                                                        borderRadius: '8px',
                                                        padding: '10px 14px',
                                                        fontSize: '13px',
                                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                    }}
                                                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                                />
                                                <Bar 
                                                    dataKey="amount" 
                                                    radius={[8, 8, 0, 0]}
                                                    label={{ 
                                                        position: 'top', 
                                                        formatter: (value: number) => formatCurrency(value),
                                                        fontSize: 10,
                                                        fill: '#6b7280'
                                                    }}
                                                >
                                                    {topPlacesData.map((entry, index) => (
                                                        <Cell 
                                                            key={`cell-${index}`} 
                                                            fill={COLORS[index % COLORS.length]} 
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                                        <div className="text-center">
                                            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                            <p className="font-medium">No places data available</p>
                                            <p className="text-sm mt-2">Select a date range and click Fetch to view top spending places</p>
                                        </div>
                                    </div>
                                )}
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
            )}

            {showCurrentReport && (
                <div className="space-y-6 mt-6">
                    {/* Report Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold">Current Month Report</h3>
                            <p className="text-sm sm:text-base text-gray-600">
                                {formatDate(startOfMonth(new Date()), 'MMMM yyyy')} Expense Analysis
                            </p>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={fetchCurrentMonthExpenses} 
                            disabled={reportLoading}
                            className="flex items-center space-x-2"
                        >
                            <RefreshCw className={cn("w-4 h-4", reportLoading && "animate-spin")} />
                            <span>{reportLoading ? "Loading..." : "Refresh"}</span>
                        </Button>
                    </div>

                    {/* Budget Alerts */}
                    {budgetAlerts.length > 0 && (
                        <BudgetAlertComponent alerts={budgetAlerts} />
                    )}

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total This Month</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(totalMonthAmount)}</div>
                                <p className="text-xs text-muted-foreground">
                                    {totalTransactions} transactions
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(averageTransaction)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Per transaction
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(totalMonthAmount / new Date().getDate())}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Per day this month
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
                                    {reportData.categoryData[0]?.category || 'N/A'}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {reportData.categoryData[0] ? formatCurrency(reportData.categoryData[0].amount) : 'No data'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Daily Spending Trend */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Daily Spending Trend</CardTitle>
                                <CardDescription>Expenses by day throughout the month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={reportData.dailyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="date" 
                                                tick={{ fontSize: 10 }}
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
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
                                                fillOpacity={0.6}
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
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPieChart>
                                            <Pie
                                                data={reportData.categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="amount"
                                            >
                                                {reportData.categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Amount']} />
                                            <Legend />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Weekly Comparison */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Weekly Comparison</CardTitle>
                                <CardDescription>Spending by week this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reportData.weeklyData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="week" 
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip 
                                                formatter={(value: number) => [formatCurrency(value), 'Amount']}
                                                labelFormatter={(label) => `Week: ${label}`}
                                                labelStyle={{ fontSize: 12 }}
                                            />
                                            <Bar dataKey="amount" fill="#82ca9d" radius={[8, 8, 0, 0]}>
                                                {reportData.weeklyData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Day of Week Analysis */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Day of Week Analysis</CardTitle>
                                <CardDescription>Average spending by day of week</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reportData.dayOfWeekData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis 
                                                dataKey="day" 
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis tick={{ fontSize: 12 }} />
                                            <Tooltip 
                                                formatter={(value: number) => [formatCurrency(value), 'Total Amount']}
                                                labelStyle={{ fontSize: 12 }}
                                            />
                                            <Bar dataKey="amount" fill="#FF8042" radius={[8, 8, 0, 0]}>
                                                {reportData.dayOfWeekData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Spending Places */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Spending Places</CardTitle>
                                <CardDescription>Highest spending locations this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart 
                                            data={reportData.placeData}
                                            layout="horizontal"
                                            margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" tick={{ fontSize: 11 }} />
                                            <YAxis 
                                                dataKey="place" 
                                                type="category" 
                                                tick={{ fontSize: 11 }}
                                                width={90}
                                            />
                                            <Tooltip 
                                                formatter={(value: number) => [formatCurrency(value), 'Amount']}
                                            />
                                            <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                                                {reportData.placeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Category Radar Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Category Distribution</CardTitle>
                                <CardDescription>Radar view of spending categories</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={reportData.categoryData.slice(0, 8)}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                                            <PolarRadiusAxis tick={{ fontSize: 10 }} />
                                            <Radar 
                                                name="Amount" 
                                                dataKey="amount" 
                                                stroke="#8884d8" 
                                                fill="#8884d8" 
                                                fillOpacity={0.6} 
                                            />
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                            <Legend />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Combined Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Spending & Transaction Volume</CardTitle>
                            <CardDescription>Combined view of amount and transaction trends</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={reportData.dailyData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="date" 
                                            tick={{ fontSize: 10 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                                        <Tooltip 
                                            formatter={(value: number) => [formatCurrency(value), 'Amount']}
                                            labelStyle={{ fontSize: 12 }}
                                        />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="amount" fill="#8884d8" name="Amount" />
                                        <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#82ca9d" name="Trend" />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
            </div>
        </div>
    )
}
