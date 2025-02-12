import { db } from "./firebase";
//TODO: Add types
export async function getLastInternalDate() {
  const doc = await db.collection("ai_expense_metadata").doc("last_sync_time").get();
  console.log("getLastInternalDate...", doc.data());
  return doc.exists ? doc.data()?.internalDate : null;
}

export async function saveRefreshToken(userId: string, refreshToken: string) {
  try{
    await db.collection("ai_expenses_tokens").doc(userId).set({ refreshToken });
    console.log("Refresh token has been saved:");
    return true;
  }catch(e){
    console.error("Error saving refresh token:", e);
    return false;
  }
}

export async function getExpense(from: string, to: string) {
  //fetch all docs from ai_expenses
  try {
    const snapshot = await db.collection("ai_expenses")
                             .where('internalDate', '>=', from)
                             .where('internalDate', '<=', to)
                             .get();

    const docs = snapshot.docs.map(doc => doc.data());
    console.log("Expenses Have been retrieved");
    return docs;
  } catch (error) {
    console.error("failed to get expenses", error);
    return null;
  }
  
}
