import { getLastInternalDate } from "@/lib/getLastInternalDate";
import { storeEmails } from "@/lib/storeExpenses";
import { google } from "googleapis";
import { NextResponse } from "next/server";

const isLocal = process.env.NODE_ENV === "development";

export async function GET(req: Request) {

  if (!isLocal && req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
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
    const response = await gmail.users.messages.list({
      userId: "me",
      labelIds: ["Label_6433257826956248841"],
      q: `${internalDateQuery}`,
      maxResults: 150, // Fetch latest 5 emails
    });

    if (!response?.data?.messages) {
      return NextResponse.json({ message: "No matching emails found" });
    }

    const emails = await Promise.all(
      response.data.messages.map(async (message) => {

        if (!message.id) {
          throw new Error("Message ID is null or undefined");
        }

        // Fetch the email details
        const emailResponse = await gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });

        const snippet = emailResponse.data.snippet || "";
        const receivedTimestamp = parseInt(emailResponse.data.internalDate || "0"); // Convert to UNIX timestamp
        // Skip if the email is older than the last internal date
        if (lastInternalDate && receivedTimestamp <= new Date(lastInternalDate).getTime()) return null;

        // Extract amount, place, and time from the email snippet
        const amountMatch = snippet.match(/\d+\.\d{2}/);
        const amount = amountMatch ? amountMatch[0] : "Not found";

        // Extract place from the email snippet
        const placeMatch = snippet.match(/at (.*?) on account/);
        const place = placeMatch ? placeMatch[1] : "Not found";

        // Extract time from the email snippet
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
      const res = await storeEmails(filteredEmails);
      if (!res) {
        console.log("Failed to Save Expense", filteredEmails.length);
        return NextResponse.json({ message: 'Failed to store expenses', count: filteredEmails.length }, { status: 500 });
      }
      console.log("Expenses stored successfully.", filteredEmails.length);
      return NextResponse.json({ message: 'Expenses have been saved', count: filteredEmails.length }, { status: 200 });
    }
    console.log("There is nothing to store", filteredEmails.length);
    return NextResponse.json({ message: 'There is nothing to store', count: filteredEmails.length }, { status: 200 });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
