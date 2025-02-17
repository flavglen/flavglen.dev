import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from 'uuid';

type Log = {
    message: string;
    error?: unknown
    date?: string;
    data?: unknown
}

export async function saveLog(log: Log, success: boolean = true) {
  try{
    const logToStore = {
        ...log,
        success,
        date: new Date().toISOString(),
    }
    // generate radom firebase doc id
    await db.collection("ai_expenses_logs").doc(uuidv4()).set({ ...logToStore });
    console.log("Log has been saved:");
    return true;
  }catch(e){
    console.log("failed to save log", e);
    return false;
  }
}