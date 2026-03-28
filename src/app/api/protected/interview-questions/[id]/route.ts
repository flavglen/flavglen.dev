import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-server";
import { getToken } from "next-auth/jwt";

async function requireAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || !token.email) return null;

  const adminEmails =
    process.env.ROLE_ADMIN_EMAIL?.split(",").map((e) =>
      e.trim().toLowerCase()
    ) || [];

  if (!adminEmails.includes(token.email.toLowerCase())) return null;
  return token;
}

// PUT - update an interview question
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await requireAdmin(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const docRef = db.collection("interview_questions").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const {
      title,
      description,
      language,
      difficulty,
      tags,
      starterCode,
      solutionCode,
      notes,
      savedCode,
      savedAt,
    } = body;

    const validLanguages = ["javascript", "html", "css"];
    const validDifficulties = ["easy", "medium", "hard"];

    if (language && !validLanguages.includes(language)) {
      return NextResponse.json(
        { error: "language must be javascript, html, or css" },
        { status: 400 }
      );
    }

    if (difficulty && !validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: "difficulty must be easy, medium, or hard" },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (language !== undefined) updates.language = language;
    if (difficulty !== undefined) updates.difficulty = difficulty;
    if (tags !== undefined) updates.tags = Array.isArray(tags) ? tags : [];
    if (starterCode !== undefined) updates.starterCode = starterCode;
    if (solutionCode !== undefined) updates.solutionCode = solutionCode;
    if (notes !== undefined) updates.notes = notes;
    if (savedCode !== undefined) updates.savedCode = savedCode;
    if (savedAt !== undefined) updates.savedAt = savedAt;

    await docRef.update(updates);

    return NextResponse.json({
      data: { id, ...doc.data(), ...updates },
    });
  } catch (error) {
    console.error("Failed to update interview question:", error);
    return NextResponse.json(
      { error: "Failed to update interview question" },
      { status: 500 }
    );
  }
}

// DELETE - remove an interview question
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await requireAdmin(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const docRef = db.collection("interview_questions").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete interview question:", error);
    return NextResponse.json(
      { error: "Failed to delete interview question" },
      { status: 500 }
    );
  }
}
