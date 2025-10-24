import { db } from "@/lib/firebase";
import { saveLog } from "./common-server";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, getWeek } from "date-fns";
import { Expense } from "@/components/expense.component";
import { serverFirebaseCache, CACHE_TTL } from "./firebase-cache-server";

export interface PeriodData {
    id: string;
    periodType: 'weekly' | 'monthly' | 'yearly';
    periodKey: string; // e.g., "2024-01" for monthly, "2024-W01" for weekly
    startDate: string; // ISO string
    endDate: string;   // ISO string
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
    lastUpdated: string; // ISO string
    expenseIds: string[]; // Array of expense document IDs
    metadata: {
        periodDisplay: string; // e.g., "January 2024", "Week of Jan 1, 2024"
        year: number;
        month?: number;
        week?: number;
    };
}

export interface PeriodAnalytics {
    weekly: PeriodData[];
    monthly: PeriodData[];
    yearly: PeriodData[];
    lastSyncDate: string;
    totalExpenses: number;
    totalAmount: number;
}

export class ExpensePeriodService {
    private static instance: ExpensePeriodService;
    
    public static getInstance(): ExpensePeriodService {
        if (!ExpensePeriodService.instance) {
            ExpensePeriodService.instance = new ExpensePeriodService();
        }
        return ExpensePeriodService.instance;
    }

    /**
     * Store or update period data for a collection of expenses
     */
    async storePeriodData(expenses: Expense[]): Promise<boolean> {
        try {
            console.log(`Starting to store period data for ${expenses.length} expenses`);
            
            if (!expenses || expenses.length === 0) {
                console.log("No expenses to process");
                return true;
            }

            const batch = db.batch();
            
            // Group expenses by different periods
            const weeklyGroups = this.groupExpensesByWeek(expenses);
            const monthlyGroups = this.groupExpensesByMonth(expenses);
            const yearlyGroups = this.groupExpensesByYear(expenses);

            console.log(`Grouped into ${Object.keys(weeklyGroups).length} weekly, ${Object.keys(monthlyGroups).length} monthly, ${Object.keys(yearlyGroups).length} yearly periods`);

            // Store weekly data
            for (const [periodKey, periodExpenses] of Object.entries(weeklyGroups)) {
                const periodData = this.createPeriodData('weekly', periodKey, periodExpenses);
                const docRef = db.collection('expense_periods_weekly').doc(periodData.id);
                batch.set(docRef, periodData);
            }

            // Store monthly data
            for (const [periodKey, periodExpenses] of Object.entries(monthlyGroups)) {
                const periodData = this.createPeriodData('monthly', periodKey, periodExpenses);
                const docRef = db.collection('expense_periods_monthly').doc(periodData.id);
                batch.set(docRef, periodData);
            }

            // Store yearly data
            for (const [periodKey, periodExpenses] of Object.entries(yearlyGroups)) {
                const periodData = this.createPeriodData('yearly', periodKey, periodExpenses);
                const docRef = db.collection('expense_periods_yearly').doc(periodData.id);
                batch.set(docRef, periodData);
            }

            // Update metadata
            const metadataRef = db.collection('expense_periods_metadata').doc('last_sync');
            batch.set(metadataRef, {
                lastSyncDate: new Date().toISOString(),
                totalExpenses: expenses.length,
                totalAmount: expenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0)
            });

            await batch.commit();
            
            // Invalidate period data cache after storing new data
            serverFirebaseCache.invalidate("period_data");
            
            saveLog({ 
                message: "Period data stored successfully", 
                data: { 
                    weekly: Object.keys(weeklyGroups).length,
                    monthly: Object.keys(monthlyGroups).length,
                    yearly: Object.keys(yearlyGroups).length,
                    totalExpenses: expenses.length
                } 
            }, true);
            
            return true;
        } catch (error) {
            saveLog({ message: "Error storing period data", error }, false);
            return false;
        }
    }

    /**
     * Get all period data for a specific type
     */
    async getAllPeriodData(periodType: 'weekly' | 'monthly' | 'yearly'): Promise<PeriodData[]> {
        try {
            const collectionName = `expense_periods_${periodType}`;
            
            return await serverFirebaseCache.getCollectionQuery(
                collectionName,
                (query) => query.orderBy('startDate', 'asc'),
                        {
                            ttl: CACHE_TTL.PERIOD_ANALYTICS,
                            key: `period_data:${periodType}:all`
                        }
            );
        } catch (error) {
            saveLog({ message: "Error fetching all period data", error }, false);
            return [];
        }
    }

    /**
     * Get period data for a specific time range
     */
    async getPeriodData(
        periodType: 'weekly' | 'monthly' | 'yearly',
        startDate: string,
        endDate: string
    ): Promise<PeriodData[]> {
        try {
            const collectionName = `expense_periods_${periodType}`;
            
            return await serverFirebaseCache.getCollectionQuery(
                collectionName,
                (query) => query
                    .where('startDate', '>=', startDate)
                    .where('startDate', '<=', endDate)
                    .orderBy('startDate', 'asc'),
                        {
                            ttl: CACHE_TTL.PERIOD_ANALYTICS,
                            key: `period_data:${periodType}:${startDate}:${endDate}`
                        }
            );
        } catch (error) {
            saveLog({ message: "Error fetching period data", error }, false);
            return [];
        }
    }

    /**
     * Get all period analytics
     */
    async getAllPeriodAnalytics(startDate?: string, endDate?: string): Promise<PeriodAnalytics> {
        try {
            // If no date range specified, get all data
            if (!startDate || !endDate) {
                const [weekly, monthly, yearly] = await Promise.all([
                    this.getAllPeriodData('weekly'),
                    this.getAllPeriodData('monthly'),
                    this.getAllPeriodData('yearly')
                ]);

                // Get accurate totals directly from source data to avoid double counting
                const accurateTotals = await this.getAccurateTotals();

                return {
                    weekly,
                    monthly,
                    yearly,
                    lastSyncDate: new Date().toISOString(),
                    totalExpenses: accurateTotals.totalExpenses,
                    totalAmount: accurateTotals.totalAmount
                };
            }

            const [weekly, monthly, yearly] = await Promise.all([
                this.getPeriodData('weekly', startDate, endDate),
                this.getPeriodData('monthly', startDate, endDate),
                this.getPeriodData('yearly', startDate, endDate)
            ]);

            // Get accurate totals directly from source data to avoid double counting
            const accurateTotals = await this.getAccurateTotals();

            return {
                weekly,
                monthly,
                yearly,
                lastSyncDate: new Date().toISOString(),
                totalExpenses: accurateTotals.totalExpenses,
                totalAmount: accurateTotals.totalAmount
            };
        } catch (error) {
            saveLog({ message: "Error fetching all period analytics", error }, false);
            return {
                weekly: [],
                monthly: [],
                yearly: [],
                lastSyncDate: new Date().toISOString(),
                totalExpenses: 0,
                totalAmount: 0
            };
        }
    }

    /**
     * Delete period data for a specific expense
     */
    async deleteExpenseFromPeriods(expenseId: string, docId: string): Promise<boolean> {
        try {
            const batch = db.batch();
            
            // Find and update all period documents that contain this expense
            const collections = ['expense_periods_weekly', 'expense_periods_monthly', 'expense_periods_yearly'];
            
            for (const collectionName of collections) {
                const snapshot = await db.collection(collectionName)
                    .where('expenseIds', 'array-contains', docId)
                    .get();

                for (const doc of snapshot.docs) {
                    const periodData = doc.data() as PeriodData;
                    const updatedExpenseIds = periodData.expenseIds.filter(id => id !== docId);
                    
                    if (updatedExpenseIds.length === 0) {
                        // If no expenses left, delete the period document
                        batch.delete(doc.ref);
                    } else {
                        // Update the period document with new expense data
                        const updatedPeriodData = await this.recalculatePeriodData(periodData, updatedExpenseIds);
                        batch.set(doc.ref, updatedPeriodData);
                    }
                }
            }

            await batch.commit();
            return true;
        } catch (error) {
            saveLog({ message: "Error deleting expense from periods", error }, false);
            return false;
        }
    }

    /**
     * Sync all expenses to period data
     */
    async syncAllExpensesToPeriods(): Promise<boolean> {
        try {
            console.log("Starting sync of all expenses to periods");
            
            // Get all expenses
            const expensesSnapshot = await db.collection('ai_expenses').get();
            console.log(`Found ${expensesSnapshot.docs.length} expenses in ai_expenses collection`);
            
            if (expensesSnapshot.docs.length === 0) {
                console.log("No expenses found in ai_expenses collection");
                return true;
            }

            const expenses = expensesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    docId: doc.id,
                    amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount,
                    category: data.category || 'Uncategorized' // Ensure category exists
                };
            }) as Expense[];

            console.log(`Processed ${expenses.length} expenses for period data creation`);

            // Store period data
            const result = await this.storePeriodData(expenses);
            console.log(`Period data storage result: ${result}`);
            return result;
        } catch (error) {
            console.error("Error syncing all expenses to periods:", error);
            saveLog({ message: "Error syncing all expenses to periods", error }, false);
            return false;
        }
    }

    /**
     * Group expenses by week
     */
    private groupExpensesByWeek(expenses: Expense[]): { [key: string]: Expense[] } {
        const groups: { [key: string]: Expense[] } = {};
        
        expenses.forEach(expense => {
            const date = new Date(expense.internalDate);
            const weekStart = startOfWeek(date, { weekStartsOn: 1 });
            const weekKey = format(weekStart, 'yyyy-MM-dd');
            
            if (!groups[weekKey]) {
                groups[weekKey] = [];
            }
            groups[weekKey].push(expense);
        });

        return groups;
    }

    /**
     * Group expenses by month
     */
    private groupExpensesByMonth(expenses: Expense[]): { [key: string]: Expense[] } {
        const groups: { [key: string]: Expense[] } = {};
        
        expenses.forEach(expense => {
            const date = new Date(expense.internalDate);
            const monthKey = format(date, 'yyyy-MM');
            
            if (!groups[monthKey]) {
                groups[monthKey] = [];
            }
            groups[monthKey].push(expense);
        });

        return groups;
    }

    /**
     * Group expenses by year
     */
    private groupExpensesByYear(expenses: Expense[]): { [key: string]: Expense[] } {
        const groups: { [key: string]: Expense[] } = {};
        
        expenses.forEach(expense => {
            const date = new Date(expense.internalDate);
            const yearKey = date.getFullYear().toString();
            
            if (!groups[yearKey]) {
                groups[yearKey] = [];
            }
            groups[yearKey].push(expense);
        });

        return groups;
    }

    /**
     * Create period data from expenses
     */
    private createPeriodData(
        periodType: 'weekly' | 'monthly' | 'yearly',
        periodKey: string,
        expenses: Expense[]
    ): PeriodData {
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const transactionCount = expenses.length;
        const averageAmount = transactionCount > 0 ? totalAmount / transactionCount : 0;

        // Calculate categories
        const categories: { [key: string]: { total: number; count: number; percentage: number } } = {};
        expenses.forEach(expense => {
            // Handle missing or undefined categories
            const category = expense.category || 'Uncategorized';
            if (!categories[category]) {
                categories[category] = { total: 0, count: 0, percentage: 0 };
            }
            categories[category].total += expense.amount;
            categories[category].count += 1;
        });

        // Debug logging for categories
        if (expenses.length > 0) {
            console.log(`Period ${periodKey} categories:`, Object.keys(categories));
        }

        // Add percentages
        Object.keys(categories).forEach(category => {
            categories[category].percentage = (categories[category].total / totalAmount) * 100;
        });

        // Calculate top places
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

        // Calculate date range
        const dates = expenses.map(exp => new Date(exp.internalDate)).sort((a, b) => a.getTime() - b.getTime());
        const startDate = dates[0]?.toISOString() || new Date().toISOString();
        const endDate = dates[dates.length - 1]?.toISOString() || new Date().toISOString();

        // Create metadata
        const metadata = this.createMetadata(periodType, periodKey, expenses);

        return {
            id: `${periodType}_${periodKey}`,
            periodType,
            periodKey,
            startDate,
            endDate,
            totalAmount,
            transactionCount,
            averageAmount,
            categories,
            topPlaces,
            lastUpdated: new Date().toISOString(),
            expenseIds: expenses.map(exp => exp.docId || exp.id),
            metadata
        };
    }

    /**
     * Create metadata for period
     */
    private createMetadata(
        periodType: 'weekly' | 'monthly' | 'yearly',
        periodKey: string,
        expenses: Expense[]
    ): PeriodData['metadata'] {
        const date = new Date(expenses[0]?.internalDate || new Date());
        
        switch (periodType) {
            case 'weekly':
                const weekStart = startOfWeek(date, { weekStartsOn: 1 });
                return {
                    periodDisplay: `Week of ${format(weekStart, 'MMM dd, yyyy')}`,
                    year: date.getFullYear(),
                    week: getWeek(date, { weekStartsOn: 1 })
                };
            case 'monthly':
                return {
                    periodDisplay: format(date, 'MMMM yyyy'),
                    year: date.getFullYear(),
                    month: date.getMonth() + 1
                };
            case 'yearly':
                return {
                    periodDisplay: date.getFullYear().toString(),
                    year: date.getFullYear()
                };
        }
    }

    /**
     * Get accurate totals directly from source expense data
     */
    async getAccurateTotals(): Promise<{ totalExpenses: number; totalAmount: number }> {
        try {
            const expensesSnapshot = await db.collection('ai_expenses').get();
            const expenses = expensesSnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    amount: typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount
                };
            });

            const totalExpenses = expenses.length;
            const totalAmount = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);

            console.log(`Accurate totals from source: ${totalExpenses} expenses, $${totalAmount.toFixed(2)}`);

            return { totalExpenses, totalAmount };
        } catch (error) {
            console.error("Error getting accurate totals:", error);
            return { totalExpenses: 0, totalAmount: 0 };
        }
    }

    /**
     * Check if period data exists and force sync if needed
     */
    async checkAndSyncPeriodData(): Promise<boolean> {
        try {
            // Check if any period data exists
            const weeklySnapshot = await db.collection('expense_periods_weekly').limit(1).get();
            const monthlySnapshot = await db.collection('expense_periods_monthly').limit(1).get();
            const yearlySnapshot = await db.collection('expense_periods_yearly').limit(1).get();

            const hasPeriodData = weeklySnapshot.docs.length > 0 || monthlySnapshot.docs.length > 0 || yearlySnapshot.docs.length > 0;

            if (!hasPeriodData) {
                console.log("No period data found, forcing sync...");
                return await this.syncAllExpensesToPeriods();
            }

            return true;
        } catch (error) {
            console.error("Error checking period data:", error);
            return false;
        }
    }

    /**
     * Recalculate period data after expense deletion
     */
    private async recalculatePeriodData(periodData: PeriodData, expenseIds: string[]): Promise<PeriodData> {
        // This would need to fetch the remaining expenses and recalculate
        // For now, return the updated period data with new expense IDs
        return {
            ...periodData,
            expenseIds,
            lastUpdated: new Date().toISOString()
        };
    }
}

// Export singleton instance
export const expensePeriodService = ExpensePeriodService.getInstance();
