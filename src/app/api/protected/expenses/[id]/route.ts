import { deleteExpense } from "@/lib/expense";
import { NextResponse } from "next/server"
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    if(!id) {
        return NextResponse.json({ error: "Failed to delete expense" }, { status: 400 });
    }
    // delete data
    const expense = await deleteExpense(id);
    if(!expense) {
        return NextResponse.json({ error: "Failed to delete expense" }, { status: 400 });
    }
    return NextResponse.json('{ message: "Expense deleted successfully" }', { status: 200 }); 
}