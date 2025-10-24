import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { serverFirebaseCache, CACHE_TTL } from "@/lib/firebase-cache-server"

export async function GET() {
    try {
        // Check sample expenses to see their category data (with cache)
        const expenses = await serverFirebaseCache.getCollectionQuery(
            'ai_expenses',
            (query) => query.limit(5),
            {
                ttl: CACHE_TTL.DEBUG_DATA,
                key: 'categories:expenses:sample'
            }
        );

        // Check period data categories (with cache)
        const [weekly, monthly] = await Promise.all([
            serverFirebaseCache.getCollectionQuery(
                'expense_periods_weekly',
                (query) => query.limit(1),
                { ttl: CACHE_TTL.DEBUG_DATA, key: 'categories:periods:weekly' }
            ),
            serverFirebaseCache.getCollectionQuery(
                'expense_periods_monthly',
                (query) => query.limit(1),
                { ttl: CACHE_TTL.DEBUG_DATA, key: 'categories:periods:monthly' }
            )
        ]);
        
        const samplePeriod = (weekly[0] || monthly[0]) as any;

        return NextResponse.json({
            success: true,
            data: {
                sampleExpenses: expenses.map((exp: any) => ({
                    id: exp.id,
                    category: exp.category,
                    place: exp.place,
                    amount: exp.amount
                })),
                samplePeriod: samplePeriod ? {
                    period: samplePeriod.metadata?.periodDisplay,
                    categories: samplePeriod.categories,
                    topPlaces: samplePeriod.topPlaces
                } : null
            }
        });
    } catch (error) {
        console.error("Categories debug error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

