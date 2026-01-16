import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-server";
import { getToken } from "next-auth/jwt";

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

// GET - Fetch blog posts with pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    // Fetch all blog posts and filter/sort in memory to avoid index requirement
    const snapshot = await db.collection('blog_posts')
      .limit(1000) // Reasonable limit for a blog
      .get();

    // Process posts: filter if needed, then sort
    let allPosts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BlogPost[];

    // Filter by published status if requested
    if (publishedOnly) {
      allPosts = allPosts.filter(post => post.published === true);
    }

    // Sort by createdAt descending (newest first)
    allPosts.sort((a, b) => {
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

// POST - Create a new blog post
export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminEmails = process.env.ROLE_ADMIN_EMAIL?.split(',').map(email => 
      email.trim().toLowerCase()
    ) || [];

    if (!adminEmails.includes(token.email.toLowerCase())) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { title, content, excerpt, imageUrl, published = false } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Generate SEO-friendly slug
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // Check if slug already exists
    const existingPost = await db.collection('blog_posts')
      .where('slug', '==', slug)
      .get();

    let finalSlug = slug;
    if (!existingPost.empty) {
      // Append timestamp to make it unique
      finalSlug = `${slug}-${Date.now()}`;
    }

    const now = new Date().toISOString();
    const blogPost: Omit<BlogPost, 'id'> = {
      title: title.trim(),
      slug: finalSlug,
      content,
      excerpt: excerpt?.trim() || '',
      imageUrl: imageUrl || '',
      author: token.email,
      published: Boolean(published),
      createdAt: now,
      updatedAt: now
    };

    const docRef = await db.collection('blog_posts').add(blogPost);
    
    return NextResponse.json({
      data: { id: docRef.id, ...blogPost },
      message: "Blog post created successfully"
    });
  } catch (error) {
    console.error("Failed to create blog post:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create blog post: ${errorMessage}` },
      { status: 500 }
    );
  }
}

