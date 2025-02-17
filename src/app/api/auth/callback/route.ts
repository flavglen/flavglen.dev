import { saveRefreshToken } from "@/lib/security";
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALL_BACK_URL
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    const res = await saveRefreshToken('admin', tokens?.refresh_token || '');
    return NextResponse.json(
      { 
      message: res ? 'refresh token has been saved to DB' : 'failed to save', 
      tokens: { 
        access_token: tokens.access_token, 
        expiry_date: tokens.expiry_date
       } 
    });
  } catch (error) {
    console.error("Error getting tokens:", error);
    return NextResponse.json({ error: "Failed to get tokens" }, { status: 500 });
  }
}
