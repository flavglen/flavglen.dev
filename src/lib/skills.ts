import { db } from "@/lib/firebase";
import { saveLog } from "./common-server";
import { serverFirebaseCache, CACHE_TTL } from "./firebase-cache-server";

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
      const docs = await serverFirebaseCache.getCollection(
        "skills",
        {
          ttl: CACHE_TTL.SKILLS,
          key: "skills:all"
        }
      );
      
      const expenseFormatted = docs.map((doc: any) => {
        return  {...doc };
      });
      return expenseFormatted;
    } catch (error) {
      console.error("Error getting skills:", error);
      saveLog({ message: "Error getting skills:" ,error, data: {}}, false);
      return null;
    }
}