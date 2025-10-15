import { NextRequest, NextResponse } from "next/server";
import { firebaseServer } from "@/lib/firebase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    if (!body.eventType || !body.level || !body.path || !body.method) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Filter out undefined values before logging to Firebase
    const cleanBody = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => value !== undefined)
    );

    // Log the security event to Firebase
    const success = await firebaseServer.logSecurityEvent({
      ...cleanBody,
      timestamp: new Date().toISOString()
    });

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to log security event' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error logging security event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
