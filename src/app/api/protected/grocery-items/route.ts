import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-server";

export interface GroceryItem {
  id?: string;
  name: string;
  category: string;
  purchased: boolean;
  priority?: "low" | "medium" | "high";
  quantity?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  weekId?: string; // For weekly tracking
}

// Get current week ID (YYYY-WW format)
function getCurrentWeekId(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

// GET - Fetch all grocery items for current week
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const weekId = searchParams.get('weekId') || getCurrentWeekId();
    const category = searchParams.get('category');
    const purchased = searchParams.get('purchased');

    // Fetch all items for the week, then filter in memory to avoid composite index requirements
    let query = db.collection('grocery_items')
      .where('weekId', '==', weekId);

    const snapshot = await query.get();
    let items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GroceryItem[];

    // Apply filters in memory
    if (category && category !== 'all') {
      items = items.filter(item => item.category === category);
    }
    if (purchased !== null && purchased !== 'all') {
      items = items.filter(item => item.purchased === (purchased === 'true'));
    }

    // Sort by creation date (newest first)
    items.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return NextResponse.json({ data: items, weekId });
  } catch (error) {
    console.error("Failed to fetch grocery items:", error);
    return NextResponse.json(
      { error: "Failed to fetch grocery items" },
      { status: 500 }
    );
  }
}

// POST - Create a new grocery item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, priority, quantity, notes } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required" },
        { status: 400 }
      );
    }

    const weekId = getCurrentWeekId();
    const now = new Date().toISOString();

    const newItem: Omit<GroceryItem, 'id'> = {
      name: name.trim(),
      category,
      purchased: false,
      priority: priority || "medium",
      quantity: quantity || 1,
      notes: notes || "",
      weekId,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection('grocery_items').add(newItem);

    return NextResponse.json({
      data: { id: docRef.id, ...newItem },
      message: "Grocery item created successfully"
    });
  } catch (error) {
    console.error("Failed to create grocery item:", error);
    return NextResponse.json(
      { error: "Failed to create grocery item" },
      { status: 500 }
    );
  }
}

// PUT - Update a grocery item
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const updateData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await db.collection('grocery_items').doc(id).update(updateData);

    const updatedDoc = await db.collection('grocery_items').doc(id).get();
    const updatedItem = { id: updatedDoc.id, ...updatedDoc.data() };

    return NextResponse.json({
      data: updatedItem,
      message: "Grocery item updated successfully"
    });
  } catch (error) {
    console.error("Failed to update grocery item:", error);
    return NextResponse.json(
      { error: "Failed to update grocery item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a grocery item
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    await db.collection('grocery_items').doc(id).delete();

    return NextResponse.json({
      message: "Grocery item deleted successfully"
    });
  } catch (error) {
    console.error("Failed to delete grocery item:", error);
    return NextResponse.json(
      { error: "Failed to delete grocery item" },
      { status: 500 }
    );
  }
}


