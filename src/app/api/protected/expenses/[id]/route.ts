import { deleteExpense } from "@/lib/expense";
import { NextResponse } from "next/server"
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    if(!params.id) {
        return NextResponse.json({ error: "Failed to delete expense" }, { status: 400 });
    }
    // delete data
    const expense = await deleteExpense(params.id);
    if(!expense) {
        return NextResponse.json({ error: "Failed to delete expense" }, { status: 400 });
    }
    return NextResponse.json('{ message: "Expense deleted successfully" }', { status: 200 }); 
}