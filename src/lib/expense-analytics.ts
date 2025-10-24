import { Expense } from "@/components/expense.component";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

export interface AnalyticsConfig {
    groupBy: 'week' | 'month' | 'year';
    includeEmbeddings: boolean;
    includeTrainingData: boolean;
    exportFormat: 'json' | 'csv' | 'training';
}

export interface ExpenseAnalytics {
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
    trends: {
        amountChange: number;
        transactionChange: number;
        categoryChanges: { [key: string]: number };
    };
}

export class ExpenseAnalyticsProcessor {
    private expenses: Expense[];

    constructor(expenses: Expense[]) {
        this.expenses = expenses;
    }

    /**
     * Process expenses into analytics data
     */
    public processAnalytics(config: AnalyticsConfig): {
        analytics: ExpenseAnalytics[];
        embeddings?: Array<{
            text: string;
            metadata: {
                period: string;
                category: string;
                amount: number;
                date: string;
                place: string;
            };
        }>;
        trainingData?: Array<{
            input: string;
            output: string;
            context: string;
        }>;
    } {
        const groupedData = this.groupExpenses(config.groupBy);
        const analytics = Object.values(groupedData).map(group => this.createAnalytics(group));
        
        const result: any = { analytics };

        if (config.includeEmbeddings) {
            result.embeddings = this.generateEmbeddings();
        }

        if (config.includeTrainingData) {
            result.trainingData = this.generateTrainingData();
        }

        return result;
    }

    /**
     * Group expenses by specified time period
     */
    private groupExpenses(groupBy: 'week' | 'month' | 'year'): { [key: string]: Expense[] } {
        const groups: { [key: string]: Expense[] } = {};

        this.expenses.forEach(expense => {
            const date = new Date(expense.internalDate);
            let key: string;

            switch (groupBy) {
                case 'week':
                    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
                    key = format(weekStart, 'yyyy-MM-dd');
                    break;
                case 'month':
                    key = format(date, 'yyyy-MM');
                    break;
                case 'year':
                    key = date.getFullYear().toString();
                    break;
            }

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(expense);
        });

        return groups;
    }

    /**
     * Create analytics for a group of expenses
     */
    private createAnalytics(expenses: Expense[]): ExpenseAnalytics {
        const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const transactionCount = expenses.length;
        const averageAmount = transactionCount > 0 ? totalAmount / transactionCount : 0;

        // Category analysis
        const categories: { [key: string]: { total: number; count: number; percentage: number } } = {};
        expenses.forEach(expense => {
            if (!categories[expense.category]) {
                categories[expense.category] = { total: 0, count: 0, percentage: 0 };
            }
            categories[expense.category].total += expense.amount;
            categories[expense.category].count += 1;
        });

        // Add percentages
        Object.keys(categories).forEach(category => {
            categories[category].percentage = (categories[category].total / totalAmount) * 100;
        });

        // Top places analysis
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

        // Calculate trends (simplified - would need historical data for accurate trends)
        const trends = this.calculateTrends(expenses);

        return {
            period: this.getPeriodString(expenses, categories),
            startDate: expenses[0]?.internalDate || '',
            endDate: expenses[expenses.length - 1]?.internalDate || '',
            totalAmount,
            transactionCount,
            averageAmount,
            categories,
            topPlaces,
            trends
        };
    }

    /**
     * Generate embeddings for search optimization
     */
    private generateEmbeddings(): Array<{
        text: string;
        metadata: {
            period: string;
            category: string;
            amount: number;
            date: string;
            place: string;
        };
    }> {
        return this.expenses.map(expense => {
            const date = new Date(expense.internalDate);
            const period = format(date, 'yyyy-MM');
            
            return {
                text: `Expense at ${expense.place} for $${expense.amount} in ${expense.category} category on ${format(date, 'MMM dd, yyyy')}`,
                metadata: {
                    period,
                    category: expense.category,
                    amount: expense.amount,
                    date: expense.internalDate,
                    place: expense.place
                }
            };
        });
    }

    /**
     * Generate training data for AI models
     */
    private generateTrainingData(): Array<{
        input: string;
        output: string;
        context: string;
    }> {
        return this.expenses.map(expense => {
            const date = new Date(expense.internalDate);
            
            return {
                input: `What did I spend on ${expense.category}?`,
                output: `You spent $${expense.amount} at ${expense.place} on ${format(date, 'MMM dd, yyyy')}`,
                context: `Expense category: ${expense.category}, Amount: $${expense.amount}, Place: ${expense.place}, Date: ${format(date, 'yyyy-MM-dd')}`
            };
        });
    }

    /**
     * Calculate trends (simplified implementation)
     */
    private calculateTrends(expenses: Expense[]): {
        amountChange: number;
        transactionChange: number;
        categoryChanges: { [key: string]: number };
    } {
        // This is a simplified implementation
        // In a real scenario, you'd compare with previous periods
        return {
            amountChange: 0,
            transactionChange: 0,
            categoryChanges: {}
        };
    }

    /**
     * Get period string for display
     */
    private getPeriodString(expenses: Expense[], categories: any): string {
        if (expenses.length === 0) return 'No data';
        
        const firstDate = new Date(expenses[0].internalDate);
        const lastDate = new Date(expenses[expenses.length - 1].internalDate);
        
        return `${format(firstDate, 'MMM dd')} - ${format(lastDate, 'MMM dd, yyyy')}`;
    }

    /**
     * Export data in various formats
     */
    public exportData(format: 'json' | 'csv' | 'training', analytics: ExpenseAnalytics[]): string {
        switch (format) {
            case 'json':
                return JSON.stringify(analytics, null, 2);
            case 'csv':
                return this.convertToCSV(analytics);
            case 'training':
                return JSON.stringify(this.generateTrainingData(), null, 2);
            default:
                return '';
        }
    }

    /**
     * Convert analytics to CSV format
     */
    private convertToCSV(analytics: ExpenseAnalytics[]): string {
        const headers = [
            'Period', 'Start Date', 'End Date', 'Total Amount', 
            'Transaction Count', 'Average Amount', 'Top Category', 'Top Place'
        ];
        const rows = [headers.join(',')];

        analytics.forEach(analytics => {
            const topCategory = Object.entries(analytics.categories)
                .sort(([,a], [,b]) => b.total - a.total)[0];
            const topPlace = analytics.topPlaces[0];
            
            rows.push([
                analytics.period,
                analytics.startDate,
                analytics.endDate,
                analytics.totalAmount,
                analytics.transactionCount,
                analytics.averageAmount,
                topCategory ? topCategory[0] : '',
                topPlace ? topPlace.place : ''
            ].join(','));
        });

        return rows.join('\n');
    }
}

/**
 * Utility function to create expense analytics
 */
export function createExpenseAnalytics(expenses: Expense[], config: AnalyticsConfig) {
    const processor = new ExpenseAnalyticsProcessor(expenses);
    return processor.processAnalytics(config);
}

