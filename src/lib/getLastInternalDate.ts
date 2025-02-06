import { db } from "./firebase";

export async function getLastInternalDate() {
  const doc = await db.collection("ai_expense_metadata").doc("last_sync_time").get();
  console.log("getLastInternalDate...", doc.data());
  return doc.exists ? doc.data()?.internalDate : null;
}

export async function saveRefreshToken(userId: string, refreshToken: string) {
  await db.collection("ai_expenses_tokens").doc(userId).set({ refreshToken });
}