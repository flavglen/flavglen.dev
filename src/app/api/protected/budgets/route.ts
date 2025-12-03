import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-server";

export interface BudgetSettings {
  [category: string]: number; // category -> budget amount
}

const BUDGET_DOC_ID = "default";

// GET - Fetch budget settings
export async function GET(req: NextRequest) {
  try {
    const docRef = db.collection('budget_settings').doc(BUDGET_DOC_ID);
    const doc = await docRef.get();

    if (!doc.exists) {
      // Return empty budgets if document doesn't exist
      return NextResponse.json({ data: {} });
    }

    const data = doc.data() as BudgetSettings;
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Failed to fetch budget settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch budget settings" },
      { status: 500 }
    );
  }
}

// PUT - Update budget settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { budgets } = body;

    console.log("Received budgets data:", budgets);

    if (!budgets || typeof budgets !== 'object') {
      console.error("Invalid budgets object:", budgets);
      return NextResponse.json(
        { error: "Budgets object is required" },
        { status: 400 }
      );
    }

    // Validate and clean budgets - only keep positive numbers
    const cleanedBudgets: Record<string, number> = {};
    for (const [category, amount] of Object.entries(budgets)) {
      const numAmount = typeof amount === 'number' ? amount : parseFloat(String(amount));
      
      if (isNaN(numAmount)) {
        console.warn(`Skipping invalid amount for category ${category}:`, amount);
        continue;
      }
      
      if (numAmount < 0) {
        return NextResponse.json(
          { error: `Invalid budget amount for category: ${category}. Amount cannot be negative.` },
          { status: 400 }
        );
      }
      
      // Only include positive values (0 values will be excluded)
      if (numAmount > 0) {
        cleanedBudgets[category] = numAmount;
      }
    }

    console.log("Cleaned budgets to save:", cleanedBudgets);

    const docRef = db.collection('budget_settings').doc(BUDGET_DOC_ID);
    
    // Use set with merge to update only the provided fields
    // This will remove fields that are not in cleanedBudgets if we want to clear them
    // But to preserve other fields, we'll merge
    const updateData = {
      ...cleanedBudgets,
      lastUpdated: new Date().toISOString(),
    };

    console.log("Updating Firestore with:", updateData);
    await docRef.set(updateData, { merge: true });

    // Fetch the updated document to return
    const updatedDoc = await docRef.get();
    
    if (!updatedDoc.exists) {
      console.error("Document does not exist after update");
      return NextResponse.json(
        { error: "Failed to verify budget settings update" },
        { status: 500 }
      );
    }

    const updatedData = updatedDoc.data() as BudgetSettings;
    // Remove lastUpdated from response data
    const { lastUpdated, ...budgetData } = updatedData;

    console.log("Successfully updated budgets:", budgetData);

    return NextResponse.json({
      data: budgetData,
      message: "Budget settings updated successfully"
    });
  } catch (error) {
    console.error("Failed to update budget settings:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to update budget settings: ${errorMessage}` },
      { status: 500 }
    );
  }
}

