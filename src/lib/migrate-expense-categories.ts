import { db } from "@/lib/firebase-server";
import { categorizeExpense } from "./categories";
import { expensePeriodService } from "./expense-periods";
import { saveLog } from "./common-server";
import { serverFirebaseCache } from "./firebase-cache-server";
import { Expense } from "@/components/expense.component";

export interface MigrationResult {
  success: boolean;
  totalExpenses: number;
  updatedExpenses: number;
  unchangedExpenses: number;
  errors: number;
  updatedExpensesDetails: Array<{
    docId: string;
    place: string;
    oldCategory: string;
    newCategory: string;
    date?: string;
    amount?: number;
  }>;
  errorsDetails: Array<{
    docId: string;
    error: string;
  }>;
}

/**
 * Migrate expense categories based on updated category patterns
 * This function will:
 * 1. Fetch all expenses from Firebase
 * 2. Recategorize each expense using the current category patterns
 * 3. Update expenses where the category has changed
 * 4. Optionally sync period data for updated expenses
 */
export async function migrateExpenseCategories(
  options: {
    dryRun?: boolean;
    syncPeriodData?: boolean;
    batchSize?: number;
    fromDate?: string; // ISO date string for start date
    toDate?: string;   // ISO date string for end date
    collectionName?: string; // Collection name to migrate (default: "ai_expenses")
  } = {}
): Promise<MigrationResult> {
  const {
    dryRun = false,
    syncPeriodData = true,
    batchSize = 500, // Firestore batch limit is 500
    fromDate,
    toDate,
    collectionName = "ai_expenses", // Default to production collection
  } = options;

  const result: MigrationResult = {
    success: false,
    totalExpenses: 0,
    updatedExpenses: 0,
    unchangedExpenses: 0,
    errors: 0,
    updatedExpensesDetails: [],
    errorsDetails: [],
  };

  try {
    console.log("Starting expense category migration...");
    console.log(`Collection: ${collectionName}`);
    console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
    console.log(`Sync Period Data: ${syncPeriodData}`);
    if (fromDate || toDate) {
      console.log(`Date Range: ${fromDate || "start"} to ${toDate || "end"}`);
    }

    // Fetch expenses from Firebase with optional date filtering
    console.log(`Fetching expenses from ${collectionName} collection...`);
    let expensesQuery: FirebaseFirestore.Query = db.collection(collectionName);
    
    // Apply date filters if provided
    if (fromDate) {
      expensesQuery = expensesQuery.where('internalDate', '>=', fromDate);
    }
    if (toDate) {
      // Add one day to include the entire end date
      const endDate = new Date(toDate);
      endDate.setDate(endDate.getDate() + 1);
      expensesQuery = expensesQuery.where('internalDate', '<=', endDate.toISOString());
    }
    
    const expensesSnapshot = await expensesQuery.get();
    result.totalExpenses = expensesSnapshot.docs.length;
    console.log(`Found ${result.totalExpenses} expenses${fromDate || toDate ? " in date range" : ""}`);

    if (result.totalExpenses === 0) {
      console.log("No expenses found. Migration complete.");
      result.success = true;
      return result;
    }

    // Process expenses in batches
    const expensesToUpdate: Array<{
      docRef: FirebaseFirestore.DocumentReference;
      oldCategory: string;
      newCategory: string;
      expense: any;
    }> = [];

    const updatedExpensesData: Expense[] = [];

    // Analyze expenses
    for (const doc of expensesSnapshot.docs) {
      try {
        const data = doc.data();
        const place = data.place || "";
        
        // Read the actual category from the database
        const existingCategory = data.category;
        
        // Determine the old category for display/comparison
        // If category exists and is a non-empty string, use it
        // Otherwise, treat blank/empty/null as "Others" for display purposes
        let oldCategoryForDisplay: string;
        if (existingCategory && typeof existingCategory === 'string' && existingCategory.trim() !== "") {
          oldCategoryForDisplay = existingCategory.trim();
        } else {
          oldCategoryForDisplay = "Others"; // Blank/empty/null is displayed as "Others"
        }
        
        // Categorize the expense based on place/merchant name
        // categorizeExpense will return "Others" if no regex pattern matches
        // All places that don't match any pattern will be categorized as "Others"
        const newCategory = categorizeExpense(place);
        
        // Check if we need to update: either category changed OR database has blank/null category that needs to be set
        const hasBlankCategory = !existingCategory || (typeof existingCategory === 'string' && existingCategory.trim() === "");
        const needsUpdate = hasBlankCategory || (oldCategoryForDisplay !== newCategory);
        
        const expense = {
          ...data,
          docId: doc.id,
          id: data.id || doc.id,
          amount: typeof data.amount === "string" ? parseFloat(data.amount) : data.amount,
          place: place,
          category: hasBlankCategory ? "Others" : oldCategoryForDisplay, // Use actual value or "Others" if blank
          time: data.time || "",
          internalDate: data.internalDate || "",
          manual: data.manual || false,
          googleScript: data.googleScript || false,
        } as Expense;

        if (needsUpdate) {
          // Use the display category for logging, but show actual blank status if applicable
          const oldCategoryDisplay = hasBlankCategory ? "(blank)" : oldCategoryForDisplay;
          console.log(
            `[${doc.id}] "${place}" - Category change: ${oldCategoryDisplay} -> ${newCategory}`
          );
          expensesToUpdate.push({
            docRef: doc.ref,
            oldCategory: oldCategoryForDisplay,
            newCategory,
            expense: {
              ...expense,
              category: newCategory,
            },
          });
          result.updatedExpensesDetails.push({
            docId: doc.id,
            place,
            oldCategory: oldCategoryDisplay,
            newCategory,
            date: expense.internalDate || expense.time || "",
            amount: expense.amount,
          });

          updatedExpensesData.push({
            ...expense,
            category: newCategory,
          });
        } else {
          result.unchangedExpenses++;
        }
      } catch (error: any) {
        console.error(`Error processing expense ${doc.id}:`, error);
        result.errors++;
        result.errorsDetails.push({
          docId: doc.id,
          error: error.message || String(error),
        });
      }
    }

    result.updatedExpenses = expensesToUpdate.length;
    console.log(`\nMigration Analysis:`);
    console.log(`- Total expenses: ${result.totalExpenses}`);
    console.log(`- Expenses to update: ${result.updatedExpenses}`);
    console.log(`- Unchanged expenses: ${result.unchangedExpenses}`);
    console.log(`- Errors: ${result.errors}`);

    if (dryRun) {
      console.log("\n[DRY RUN] No changes made to database.");
      result.success = true;
      return result;
    }

    // Update expenses in batches
    if (expensesToUpdate.length > 0) {
      console.log(`\nUpdating ${expensesToUpdate.length} expenses in batches of ${batchSize}...`);

      for (let i = 0; i < expensesToUpdate.length; i += batchSize) {
        const batch = db.batch();
        const batchExpenses = expensesToUpdate.slice(i, i + batchSize);

        batchExpenses.forEach(({ docRef, expense }) => {
          batch.update(docRef, {
            category: expense.category,
          });
        });

        try {
          await batch.commit();
          console.log(
            `Batch ${Math.floor(i / batchSize) + 1} completed: Updated ${batchExpenses.length} expenses`
          );
        } catch (error: any) {
          console.error(`Error committing batch ${Math.floor(i / batchSize) + 1}:`, error);
          result.errors += batchExpenses.length;
          batchExpenses.forEach(({ docRef }) => {
            result.errorsDetails.push({
              docId: docRef.id,
              error: `Batch commit failed: ${error.message || String(error)}`,
            });
          });
        }
      }

      // Invalidate cache
      console.log("Invalidating cache...");
      serverFirebaseCache.invalidate("expenses");

      // Sync period data if requested
      if (syncPeriodData && updatedExpensesData.length > 0) {
        console.log("Syncing period data for updated expenses...");
        try {
          await expensePeriodService.storePeriodData(updatedExpensesData as any);
          console.log("Period data sync completed.");
        } catch (error) {
          console.error("Error syncing period data:", error);
          saveLog(
            {
              message: "Error syncing period data during migration",
              error,
              data: { updatedCount: updatedExpensesData.length },
            },
            false
          );
        }
      }

      console.log("\nMigration completed successfully!");
      saveLog(
        {
          message: "Expense category migration completed",
          data: {
            totalExpenses: result.totalExpenses,
            updatedExpenses: result.updatedExpenses,
            unchangedExpenses: result.unchangedExpenses,
            errors: result.errors,
          },
        },
        true
      );
    } else {
      console.log("\nNo expenses need updating. Migration complete.");
    }

    result.success = true;
    return result;
  } catch (error: any) {
    console.error("Migration failed:", error);
    result.success = false;
    result.errors++;
    result.errorsDetails.push({
      docId: "migration",
      error: error.message || String(error),
    });

    saveLog(
      {
        message: "Expense category migration failed",
        error,
        data: {
          totalExpenses: result.totalExpenses,
          updatedExpenses: result.updatedExpenses,
        },
      },
      false
    );

    return result;
  }
}

