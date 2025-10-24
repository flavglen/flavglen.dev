import { NextResponse } from "next/server"
import { expensePeriodService } from "@/lib/expense-periods"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        
        // Check if period data exists and sync if needed
        await expensePeriodService.checkAndSyncPeriodData();
        
        const analytics = await expensePeriodService.getAllPeriodAnalytics(
            startDate || undefined,
            endDate || undefined
        );
        
        return NextResponse.json({ data: analytics });
    } catch (error) {
        console.error("Error fetching period analytics:", error);
        return NextResponse.json({ error: "Failed to fetch period analytics" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { action } = await req.json();
        
        switch (action) {
            case 'sync':
                const result = await expensePeriodService.syncAllExpensesToPeriods();
                return NextResponse.json({ 
                    success: result, 
                    message: result ? "Period data synced successfully" : "Failed to sync period data" 
                });
            
            case 'store':
                const { expenses } = await req.json();
                const storeResult = await expensePeriodService.storePeriodData(expenses);
                return NextResponse.json({ 
                    success: storeResult, 
                    message: storeResult ? "Period data stored successfully" : "Failed to store period data" 
                });
            
            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error processing period data:", error);
        return NextResponse.json({ error: "Failed to process period data" }, { status: 500 });
    }
}
