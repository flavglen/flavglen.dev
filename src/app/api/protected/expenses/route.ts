import { NextResponse } from "next/server"
import { getExpense } from "@/lib/expense";

export async function GET(req: Request) {
    // query params
    const { searchParams } = new URL(req.url);
    const from = searchParams.get('from') || new Date().toISOString();
    const to = searchParams.get('to')  || new Date().toISOString();
    // fetch data
    const expense = await getExpense(from, to);
    if(!expense) {
        return NextResponse.json({ error: "Failed to get expense" }, { status: 400 });
    }

    return NextResponse.json({ data: expense }); 
}
