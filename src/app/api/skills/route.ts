import { getSkills } from "@/lib/skills";
import { NextResponse } from "next/server";

export async function GET() {
      // fetch data
    try {
        const data = await getSkills();
        if(!data) {
            return NextResponse.json({ error: "Failed to get skills" }, { status: 400 });
        }
        return NextResponse.json({ data: data }); 
    } catch (error) {
        return NextResponse.json({ message: "Server error", error });
    }
}