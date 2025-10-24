import { db } from "@/lib/firebase";
import { saveLog } from "./common-server";
import { categorizeExpense } from "./categories";
import { expensePeriodService } from "./expense-periods";
import { serverFirebaseCache, CACHE_TTL } from "./firebase-cache-server";

export async function getExpense(from: string, to: string) {
    // fetch all docs from ai_expenses with caching
    try {
      const docs = await serverFirebaseCache.getCollectionQuery(
        "ai_expenses",
        (query) => query
          .where('internalDate', '>=', from)
          .where('internalDate', '<=', to),
        {
          ttl: CACHE_TTL.EXPENSES,
          key: `expenses:${from}:${to}`
        }
      );

      const docsWithId = docs.map((doc: any) => {
        return {...doc, docId: doc.id};
      });
      
      // map category to each expense if not present
      const expenseFormatted = docsWithId.map((doc: any) => {
        return  {...doc,...(!doc.category && {category: categorizeExpense(doc.place)}) };
      });
      return expenseFormatted;  
    } catch (error) {
      console.error("Error getting expenses:", error);
      saveLog({ message: "failed to get expenses" ,error, data: {from, to}}, false);
      return null;
    }
}

export async function deleteExpense(docId: string) {
  try {
    const docRef = db.collection("ai_expenses").doc(docId);
    await docRef.delete();
    
    // Invalidate cache for expenses
    serverFirebaseCache.invalidate("expenses");
    
    // Update period data after deletion
    await expensePeriodService.deleteExpenseFromPeriods(docId, docId);
    
    console.log("Document successfully deleted.");
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    return false;
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
          category: categorizeExpense(expense.place),
        });
      });
  
      // Store the latest internalDate in metadata (assuming emails are sorted)
      const latestInternalDate = expenses[0].internalDate;
    
      const metadataRef = db.collection("ai_expense_metadata").doc("last_sync_time");
      batch.set(metadataRef, { internalDate: latestInternalDate });
      await batch.commit();
      
      // Store period data after successful expense storage
      const formattedExpenses = expenses.map(expense => ({
        ...expense,
        docId: expense.id,
        category: categorizeExpense(expense.place)
      }));
      await expensePeriodService.storePeriodData(formattedExpenses);
      
      // Invalidate cache for expenses after storing new data
      serverFirebaseCache.invalidate("expenses");
      
      saveLog({ message: "Expenses stored successfully",  data: { latestInternalDate, expenseLength: expenses?.length } }, true);
      return true;
    } catch (error) {
      saveLog({ message: "Error storing Expenses:", error }, false);
      return false;
    }
}  