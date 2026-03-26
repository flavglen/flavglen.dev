import { NextResponse } from "next/server"
import { expensePeriodService } from "@/lib/expense-periods"

export async function GET() {
    try {
        console.log("Testing period data sync...");
        
        // Force sync
        const syncResult = await expensePeriodService.syncAllExpensesToPeriods();
        console.log("Sync result:", syncResult);
        
        // Get analytics
        const analytics = await expensePeriodService.getAllPeriodAnalytics();
        console.log("Analytics result:", {
            weekly: analytics.weekly.length,
            monthly: analytics.monthly.length,
            yearly: analytics.yearly.length,
            totalExpenses: analytics.totalExpenses,
            totalAmount: analytics.totalAmount
        });
        
        return NextResponse.json({ 
            success: true,
            syncResult,
            analytics: {
                weekly: analytics.weekly.length,
                monthly: analytics.monthly.length,
                yearly: analytics.yearly.length,
                totalExpenses: analytics.totalExpenses,
                totalAmount: analytics.totalAmount
            }
        });
    } catch (error) {
        console.error("Test error:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Test operation failed"
        }, { status: 500 });
    }
}

