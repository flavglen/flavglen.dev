import { NextResponse } from "next/server"
import { expensePeriodService } from "@/lib/expense-periods"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ periodType: string }> }
) {
    try {
        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        
        const { periodType } = await params;
        const typedPeriodType = periodType as 'weekly' | 'monthly' | 'yearly';
        
        if (!['weekly', 'monthly', 'yearly'].includes(typedPeriodType)) {
            return NextResponse.json({ error: "Invalid period type" }, { status: 400 });
        }
        
        const periodData = await expensePeriodService.getPeriodData(
            typedPeriodType,
            startDate || '2020-01-01',
            endDate || new Date().toISOString()
        );
        
        return NextResponse.json({ data: periodData });
    } catch (error) {
        console.error("Error fetching period data:", error);
        return NextResponse.json({ error: "Failed to fetch period data" }, { status: 500 });
    }
}

