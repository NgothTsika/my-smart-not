/**
 * Normalizes a potentially null/undefined image URL
 * into a value that is always string | undefined.
 */
export function safeImageUrl(
  url: string | null | undefined
): string | undefined {
  return url ?? undefined;
}
