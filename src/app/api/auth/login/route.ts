import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALL_BACK_URL
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline", // Required for refresh token
      scope: ["https://www.googleapis.com/auth/gmail.readonly"],
      prompt: "consent", // Ensures getting a refresh token
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {

    // Return a proper error response
    return NextResponse.json({ error: "Failed to generate auth URL" }, { status: 500 });
  }
}
