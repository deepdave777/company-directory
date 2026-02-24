/**
 * Slug utilities for SEO-friendly URLs
 * Handles company name to slug conversion with conflict resolution
 */

export function generateSlug(companyName: string): string {
  return encodeURIComponent(
    companyName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters except letters, numbers, spaces, hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim()
  );
}

export function generateUniqueSlug(companyName: string, existingSlugs: string[]): string {
  let baseSlug = generateSlug(companyName);
  let uniqueSlug = baseSlug;
  let counter = 1;

  // Check for conflicts and append number if needed
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

export function slugToName(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, ' ');
}

/**
 * Validates if a slug is properly formatted
 */
export function isValidSlug(slug: string): boolean {
  try {
    const decoded = decodeURIComponent(slug);
    // Check if it contains only valid characters
    return /^[a-z0-9-]+$/.test(decoded);
  } catch {
    return false;
  }
}

/**
 * Creates a slug that's both SEO-friendly and safe for URLs
 */
export function createSafeSlug(companyName: string): string {
  // Handle edge cases
  if (!companyName || companyName.trim().length === 0) {
    return 'unknown-company';
  }

  // Clean and normalize
  const cleaned = companyName
    .trim()
    .replace(/[^\w\s&.-]/g, '') // Keep letters, numbers, spaces, ampersand, dots, hyphens
    .replace(/\s+/g, '-') // Spaces to hyphens
    .replace(/-+/g, '-') // Multiple hyphens to single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .toLowerCase();

  // Handle empty result after cleaning
  if (!cleaned || cleaned.length === 0) {
    return 'unknown-company';
  }

  return encodeURIComponent(cleaned);
}
