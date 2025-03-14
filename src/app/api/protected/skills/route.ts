import { NextResponse } from "next/server"
import { ZodError } from "zod";
import { addSkills } from "@/lib/skills";
import { Skills, SkillSchema } from "@/schema/skils";

export async function POST(req: Request) {
    // fetch data
    try {
        const body = await req.json();
        const validatedData: Skills = SkillSchema.parse(body);
        await addSkills(validatedData);
        return  NextResponse.json({ message: "Skills added successfully!" });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ message: "Invalid data", error: error.errors });
        }

        return NextResponse.json({ message: "Server error", error });
    }
}


export async function PUT(req: Request) {
    // fetch data
}