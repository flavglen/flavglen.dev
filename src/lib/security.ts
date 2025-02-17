import { db } from "@/lib/firebase";
import { saveLog } from "./common";

// TODO: Add types
export async function getLastInternalDate() {
  const doc = await db.collection("ai_expense_metadata").doc("last_sync_time").get();
  return doc.exists ? doc.data()?.internalDate : null;
}

export async function saveRefreshToken(userId: string, refreshToken: string) {
  try{
    await db.collection("ai_expenses_tokens").doc(userId).set({ refreshToken });
    console.log("Refresh token has been saved:");
    return true;
  }catch(e){
    console.error("Error saving refresh token:", e);
    saveLog({ message: "failed to save refresh token" ,error: e, data: {userId}}, false);
    return false;
  }
}
