import { db } from "@/lib/firebase";
import { saveLog } from "./common";

export async function getExpense(from: string, to: string) {
    // fetch all docs from ai_expenses
    try {
      const snapshot = await db.collection("ai_expenses")
                               .where('internalDate', '>=', from)
                               .where('internalDate', '<=', to)
                               .get();
  
      const docs = snapshot.docs.map(doc => doc.data());
      return docs;
    } catch (error) {
      console.error("Error getting expenses:", error);
      saveLog({ message: "failed to get expenses" ,error, data: {from, to}}, false);
      return null;
    }
}

export async function storeExpenses(expenses: any[]) {
    if (!expenses?.length ) {
        saveLog({ message: "No expenses to store"}, false);
        return;
    }
  
    try {
      const batch = db.batch();
      // Store each email
      expenses.forEach((expense) => {
        const emailRef = db.collection("ai_expenses").doc(expense.id);
        batch.set(emailRef, {
          id: expense.id,
          amount: expense.amount,
          place: expense.place,
          time: expense.time,
          internalDate: expense.internalDate,
        });
      });
  
      // Store the latest internalDate in metadata (assuming emails are sorted)
      const latestInternalDate = expenses[0].internalDate;
    
      const metadataRef = db.collection("ai_expense_metadata").doc("last_sync_time");
      batch.set(metadataRef, { internalDate: latestInternalDate });
      await batch.commit();
      saveLog({ message: "Expenses stored successfully",  data: { latestInternalDate, expenseLength: expenses?.length } }, true);
      return true;
    } catch (error) {
      saveLog({ message: "Error storing Expenses:", error }, false);
      return false;
    }
}  