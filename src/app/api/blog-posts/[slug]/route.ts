import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-server";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// GET - Fetch a single published blog post by slug (public route)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Fetch by slug first (slug is unique, so this is efficient)
    const snapshot = await db.collection('blog_posts')
      .where('slug', '==', slug)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const post = {
      id: doc.id,
      ...doc.data()
    } as BlogPost;

    // Check if post is published
    if (!post.published) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch blog post",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

