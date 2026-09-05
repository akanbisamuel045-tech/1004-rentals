import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names, resolving conflicts.
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Nigerian Naira currency.
 * Example: 2500000 → "₦2,500,000"
 */
export function formatPrice(
  amount: number | string,
  compact = false
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;

  if (compact) {
    if (num >= 1_000_000) {
      return `₦${(num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1)}M`;
    }
    if (num >= 1_000) {
      return `₦${(num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 0)}k`;
    }
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Formats a rental period for display.
 * Example: "ANNUALLY" → "/ year"
 */
export function formatRentalPeriod(period: string): string {
  const map: Record<string, string> = {
    MONTHLY: "/ month",
    QUARTERLY: "/ quarter",
    BI_ANNUALLY: "/ 6 months",
    ANNUALLY: "/ year",
  };
  return map[period] ?? `/ ${period.toLowerCase()}`;
}

/**
 * Converts a string to a URL-friendly slug.
 * Example: "Lekki Phase 1" → "lekki-phase-1"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncates a string to a maximum length with an ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}…`;
}

/**
 * Returns a relative time string.
 * Example: "2 days ago"
 */
export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];

  for (const [interval, label] of intervals) {
    const count = Math.floor(seconds / interval);
    if (count >= 1) {
      return `${count} ${label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

/**
 * Formats a date for display.
 * Example: "September 4, 2026"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generates a placeholder image URL for properties without images.
 */
export function getPropertyPlaceholder(): string {
  return "/images/property-placeholder.jpg";
}

/**
 * Validates a Nigerian phone number format.
 * Accepts: 08012345678, +2348012345678, 2348012345678
 */
export function isValidNigerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, "");
  return /^(\+?234|0)[789][01]\d{8}$/.test(cleaned);
}

/**
 * Formats property size for display.
 */
export function formatSize(sizeSqm: number | string | null): string {
  if (!sizeSqm) return "N/A";
  const num = typeof sizeSqm === "string" ? parseFloat(sizeSqm) : sizeSqm;
  return `${num.toLocaleString()} sqm`;
}
