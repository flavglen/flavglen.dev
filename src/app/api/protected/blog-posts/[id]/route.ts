import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-server";
import { getToken } from "next-auth/jwt";

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

// GET - Fetch a single blog post by ID (for admin)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const doc = await db.collection('blog_posts').doc(id).get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const post = {
      id: doc.id,
      ...doc.data()
    };

    return NextResponse.json({ data: post });
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT - Update a blog post
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await req.json();
    const { title, content, excerpt, imageUrl, published } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Get existing post to preserve slug and createdAt
    const docRef = db.collection('blog_posts').doc(id);
    const existingDoc = await docRef.get();

    if (!existingDoc.exists) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    const existingData = existingDoc.data() as BlogPost;

    // Update the post
    const updateData = {
      title: title.trim(),
      content,
      excerpt: excerpt?.trim() || '',
      imageUrl: imageUrl || '',
      published: Boolean(published),
      updatedAt: new Date().toISOString(),
      // Preserve existing values
      slug: existingData.slug,
      createdAt: existingData.createdAt,
      author: existingData.author || token.email
    };

    await docRef.update(updateData);

    return NextResponse.json({
      data: { id, ...updateData },
      message: "Blog post updated successfully"
    });
  } catch (error) {
    console.error("Failed to update blog post:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to update blog post: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// DELETE - Delete a blog post
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const docRef = db.collection('blog_posts').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    await docRef.delete();

    return NextResponse.json({
      message: "Blog post deleted successfully"
    });
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to delete blog post: ${errorMessage}` },
      { status: 500 }
    );
  }
}

