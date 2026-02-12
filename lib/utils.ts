import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isPlaceholderImage(url: string | null | undefined): boolean {
  if (!url || !url.trim()) return true;

  const lower = url.toLowerCase().trim();

  // Common text placeholders
  if (["na", "n/a", "null", "undefined"].includes(lower)) return true;

  // Known placeholder URL patterns
  if (lower.includes("no-poster") ||
      lower.includes("no-image") ||
      lower.includes("default-movie") ||
      lower.includes("placeholder")) {
    return true;
  }

  // Legend Cinema specific placeholders
  // Note: Add specific Legend Cinema placeholder URL here if known
  // For now, we check for common "no image" filenames that might be served
  if (lower.includes("legend") && (lower.includes("default") || lower.includes("noposter"))) {
    return true;
  }

  return false;
}
