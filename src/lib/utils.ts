import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the name/username from an email address.
 * If the input contains an @ symbol, returns the part before @.
 * Otherwise, returns the input as-is.
 */
export function getAuthorDisplayName(author: string | undefined | null): string {
  if (!author) return ""
  if (author.includes("@")) {
    return author.split("@")[0]
  }
  return author
}
