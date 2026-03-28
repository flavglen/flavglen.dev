import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-server";
import { getToken } from "next-auth/jwt";

export interface InterviewQuestion {
  id?: string;
  title: string;
  description: string;
  language: "javascript" | "html" | "css";
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  starterCode: string;
  solutionCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

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

// GET - list all interview questions
export async function GET(req: NextRequest) {
  try {
    const token = await requireAdmin(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language");
    const difficulty = searchParams.get("difficulty");

    let query = db
      .collection("interview_questions")
      .orderBy("createdAt", "desc")
      .limit(500);

    const snapshot = await query.get();

    let questions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as InterviewQuestion[];

    if (language) {
      questions = questions.filter((q) => q.language === language);
    }
    if (difficulty) {
      questions = questions.filter((q) => q.difficulty === difficulty);
    }

    return NextResponse.json({ data: questions });
  } catch (error) {
    console.error("Failed to fetch interview questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview questions" },
      { status: 500 }
    );
  }
}

// POST - create a new interview question
export async function POST(req: NextRequest) {
  try {
    const token = await requireAdmin(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      language,
      difficulty,
      tags,
      starterCode,
      solutionCode,
      notes,
    } = body;

    if (!title || !description || !language) {
      return NextResponse.json(
        { error: "title, description, and language are required" },
        { status: 400 }
      );
    }

    const validLanguages = ["javascript", "html", "css"];
    const validDifficulties = ["easy", "medium", "hard"];

    if (!validLanguages.includes(language)) {
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

    const now = new Date().toISOString();
    const question: Omit<InterviewQuestion, "id"> = {
      title: title.trim(),
      description: description.trim(),
      language,
      difficulty: difficulty || "medium",
      tags: Array.isArray(tags) ? tags : [],
      starterCode: starterCode || "",
      solutionCode: solutionCode || "",
      notes: notes || "",
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db.collection("interview_questions").add(question);

    return NextResponse.json(
      { data: { id: docRef.id, ...question } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create interview question:", error);
    return NextResponse.json(
      { error: "Failed to create interview question" },
      { status: 500 }
    );
  }
}
