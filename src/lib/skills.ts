import { db } from "@/lib/firebase";
import { saveLog } from "./common";

export const addSkills = async (skills: any) => {
    try {
      const docRef = await db.collection("skills").add(skills);
      return docRef.id;
    } catch (error) {
      throw new Error("Error adding Skills: " + error);
    }
};

export async function getSkills() {
    try {
      const snapshot = await db.collection("skills")
                               .get();
  
      const docs = snapshot.docs.map(doc => doc.data());
      const expenseFormatted = docs.map((doc: any) => {
        return  {...doc };
      });
      return expenseFormatted;
    } catch (error) {
      console.error("Error getting expenses:", error);
      saveLog({ message: "Error getting expenses:" ,error, data: {}}, false);
      return null;
    }
}