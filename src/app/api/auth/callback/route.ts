import { saveRefreshToken } from "@/lib/getLastInternalDate";
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

    // return NextResponse.json({
    //   access_token: tokens.access_token,
    //   refresh_token: tokens.refresh_token, // Store this in your database!
    //   expires_in: tokens.expiry_date,
    // });
    saveRefreshToken("flavglen", tokens?.refresh_token || '');
    return  NextResponse.json({ data: 'refresh token as been saved to DB' });
  } catch (error) {
    console.error("Error getting tokens:", error);
    return NextResponse.json({ error: "Failed to get tokens" }, { status: 500 });
  }
}

