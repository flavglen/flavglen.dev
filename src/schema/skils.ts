import { z } from "zod";

// Define validation schema
export const SkillSchema = z.object({
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Icon Class is required"),
  technology: z.string().min(1, "Technology is required"),
  vote: z.number().int().nonnegative(),
  years: z.string().min(1, "Years is required"),
});

// TypeScript type inferred from the schema
export type Skills = z.infer<typeof SkillSchema>;