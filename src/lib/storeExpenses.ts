import { db } from "./firebase";

export async function storeEmails(filteredEmails: any[]) {
  if (filteredEmails.length === 0) return;

  const batch = db.batch();
  // Store each email
  filteredEmails.forEach((email) => {
    const emailRef = db.collection("ai_expenses").doc(email.id);
    batch.set(emailRef, {
      id: email.id,
      amount: email.amount,
      place: email.place,
      time: email.time,
      internalDate: email.internalDate,
    });
  });

  // Store the latest internalDate in metadata (assuming emails are sorted)
  const latestInternalDate = filteredEmails[0].internalDate;
 
  const metadataRef = db.collection("ai_expense_metadata").doc("last_sync_time");
  batch.set(metadataRef, { internalDate: latestInternalDate });

  await batch.commit();
}