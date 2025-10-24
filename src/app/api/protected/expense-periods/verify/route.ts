import { NextResponse } from "next/server"
import { expensePeriodService } from "@/lib/expense-periods"

export async function GET() {
    try {
        console.log("Verifying period data calculations...");
        
        // Get accurate totals from source
        const accurateTotals = await expensePeriodService.getAccurateTotals();
        
        // Get period analytics
        const analytics = await expensePeriodService.getAllPeriodAnalytics();
        
        // Calculate totals from period data
        const periodTotals = {
            weekly: analytics.weekly.reduce((sum, period) => sum + period.totalAmount, 0),
            monthly: analytics.monthly.reduce((sum, period) => sum + period.totalAmount, 0),
            yearly: analytics.yearly.reduce((sum, period) => sum + period.totalAmount, 0),
            combined: analytics.weekly.reduce((sum, period) => sum + period.totalAmount, 0) +
                     analytics.monthly.reduce((sum, period) => sum + period.totalAmount, 0) +
                     analytics.yearly.reduce((sum, period) => sum + period.totalAmount, 0)
        };
        
        return NextResponse.json({ 
            success: true,
            accurateTotals,
            periodTotals,
            analytics: {
                weekly: analytics.weekly.length,
                monthly: analytics.monthly.length,
                yearly: analytics.yearly.length,
                totalExpenses: analytics.totalExpenses,
                totalAmount: analytics.totalAmount
            },
            verification: {
                accurateMatches: accurateTotals.totalAmount === analytics.totalAmount,
                difference: Math.abs(accurateTotals.totalAmount - analytics.totalAmount),
                periodOverlap: periodTotals.combined - accurateTotals.totalAmount
            }
        });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}

