import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-server";
import { DEFAULT_ITEMS } from "@/lib/grocery-constants";

// Get current week ID (YYYY-WW format)
function getCurrentWeekId(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

// POST - Initialize default grocery items for the current week
export async function POST(req: NextRequest) {
  try {
    const weekId = getCurrentWeekId();
    const now = new Date().toISOString();

    // Check if items already exist for this week
    const existingItems = await db.collection('grocery_items')
      .where('weekId', '==', weekId)
      .get();

    if (!existingItems.empty) {
      return NextResponse.json(
        { error: "Items already exist for this week. Use reset endpoint to clear and reinitialize." },
        { status: 400 }
      );
    }

    // Create default items
    const batch = db.batch();
    const createdItems = [];

    for (const item of DEFAULT_ITEMS) {
      const docRef = db.collection('grocery_items').doc();
      const newItem = {
        ...item,
        purchased: false,
        quantity: 1,
        notes: "",
        weekId,
        createdAt: now,
        updatedAt: now,
      };
      batch.set(docRef, newItem);
      createdItems.push({ id: docRef.id, ...newItem });
    }

    await batch.commit();

    return NextResponse.json({
      data: createdItems,
      message: `Initialized ${createdItems.length} default grocery items for week ${weekId}`,
      weekId
    });
  } catch (error) {
    console.error("Failed to initialize grocery items:", error);
    return NextResponse.json(
      { error: "Failed to initialize grocery items" },
      { status: 500 }
    );
  }
}

// DELETE - Reset weekly grocery list (clear purchased items or all items)
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const weekId = searchParams.get('weekId') || getCurrentWeekId();
    const clearAll = searchParams.get('clearAll') === 'true';

    // Fetch all items for the week, then filter in memory
    const query = db.collection('grocery_items').where('weekId', '==', weekId);
    const snapshot = await query.get();

    if (snapshot.empty) {
      return NextResponse.json({
        message: "No items to reset",
        weekId
      });
    }

    // Filter purchased items in memory if not clearing all
    const docsToProcess = clearAll
      ? snapshot.docs
      : snapshot.docs.filter(doc => doc.data().purchased === true);

    if (docsToProcess.length === 0) {
      return NextResponse.json({
        message: "No purchased items to reset",
        weekId
      });
    }

    const batch = db.batch();
    docsToProcess.forEach(doc => {
      if (clearAll) {
        batch.delete(doc.ref);
      } else {
        // Reset purchased status
        batch.update(doc.ref, {
          purchased: false,
          updatedAt: new Date().toISOString()
        });
      }
    });

    await batch.commit();

    return NextResponse.json({
      message: clearAll
        ? `Cleared all items for week ${weekId}`
        : `Reset ${docsToProcess.length} purchased items for week ${weekId}`,
      weekId,
      clearedCount: docsToProcess.length
    });
  } catch (error) {
    console.error("Failed to reset grocery items:", error);
    return NextResponse.json(
      { error: "Failed to reset grocery items" },
      { status: 500 }
    );
  }
}

