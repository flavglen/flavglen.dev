import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-server";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export interface BlogPost {
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

// GET - Fetch published blog posts with pagination (public route)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Fetch all blog posts and filter/sort in memory to avoid index requirement
    // This works well for blogs with reasonable number of posts
    const snapshot = await db.collection('blog_posts')
      .limit(1000) // Reasonable limit for a blog
      .get();

    // Filter for published posts and sort by createdAt
    const allPosts = (snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[])
      .filter(post => post.published === true)
      .sort((a, b) => {
        // Sort by createdAt descending (newest first)
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });

    const total = allPosts.length;

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch blog posts",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

