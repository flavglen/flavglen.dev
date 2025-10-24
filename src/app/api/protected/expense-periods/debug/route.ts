import { NextResponse } from "next/server"
import { db } from "@/lib/firebase"
import { serverFirebaseCache, CACHE_TTL } from "@/lib/firebase-cache-server"

export async function GET() {
    try {
        // Check if ai_expenses collection exists and has data (with cache)
        const expenses = await serverFirebaseCache.getCollectionQuery(
            'ai_expenses',
            (query) => query.limit(5),
            {
                ttl: CACHE_TTL.DEBUG_DATA,
                key: 'debug:expenses:sample'
            }
        );

        // Check if period collections exist (with cache)
        const [weekly, monthly, yearly] = await Promise.all([
            serverFirebaseCache.getCollectionQuery(
                'expense_periods_weekly',
                (query) => query.limit(1),
                { ttl: CACHE_TTL.DEBUG_DATA, key: 'debug:periods:weekly' }
            ),
            serverFirebaseCache.getCollectionQuery(
                'expense_periods_monthly',
                (query) => query.limit(1),
                { ttl: CACHE_TTL.DEBUG_DATA, key: 'debug:periods:monthly' }
            ),
            serverFirebaseCache.getCollectionQuery(
                'expense_periods_yearly',
                (query) => query.limit(1),
                { ttl: CACHE_TTL.DEBUG_DATA, key: 'debug:periods:yearly' }
            )
        ]);

        return NextResponse.json({
            success: true,
            data: {
                aiExpensesCount: expenses.length,
                sampleExpenses: expenses,
                periodCollections: {
                    weekly: weekly.length,
                    monthly: monthly.length,
                    yearly: yearly.length
                }
            }
        });
    } catch (error) {
        console.error("Debug error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}

