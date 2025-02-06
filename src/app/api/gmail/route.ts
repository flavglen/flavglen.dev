import { getLastInternalDate } from "@/lib/getLastInternalDate";
import { storeEmails } from "@/lib/storeExpenses";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALL_BACK_URL
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const lastInternalDate = await getLastInternalDate();
    console.log("Last internal date:", lastInternalDate);
    const internalDateQuery = lastInternalDate
    ? `after:${Math.floor(new Date(lastInternalDate).getTime() / 1000)}`
    : "";
    console.log("internalDateQuery", internalDateQuery);
    const response = await gmail.users.messages.list({
      userId: "me",
      //q: `subject:"Authorization on your credit account" ${internalDateQuery}`,
      labelIds: ["Label_6433257826956248841"],
      q: `${internalDateQuery}`,
      maxResults: 150, // Fetch latest 5 emails
    });

    console.log("gmail_response", response);
    if (!response?.data?.messages) {
      return NextResponse.json({ message: "No matching emails found" });
    }

    const emails = await Promise.all(
      response.data.messages.map(async (message) => {

        if (!message.id) {
          throw new Error("Message ID is null or undefined");
        }

        const emailResponse = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });

        console.log("email_response_loop", emailResponse);

        const snippet = emailResponse.data.snippet || "";

        const receivedTimestamp = parseInt(emailResponse.data.internalDate || "0"); // Convert to UNIX timestamp

        if (lastInternalDate && receivedTimestamp <= new Date(lastInternalDate).getTime()) return null;


        const amountMatch = snippet.match(/\d+\.\d{2}/);
        const amount = amountMatch ? amountMatch[0] : "Not found";


        const placeMatch = snippet.match(/at (.*?) on account/);
        const place = placeMatch ? placeMatch[1] : "Not found";

        const timeMatch = snippet.match(/on account .* at (.*)/);
        const time = timeMatch ? timeMatch[1] : "Not found";

       return {
          id: message.id,
          amount,
          place,
          time,
          internalDate: new Date(parseInt(emailResponse.data.internalDate || "0")).toISOString(),
        };
      })
    );

    const filteredEmails = emails.filter(Boolean);
    if (filteredEmails.length > 0) {
      console.log("filteredEmails", filteredEmails);
      await storeEmails(filteredEmails);
      return NextResponse.json({ emails: filteredEmails});
    }

    return NextResponse.json({ error: 'There is nothing to store'+ filteredEmails.length }, { status: 500 });

  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
