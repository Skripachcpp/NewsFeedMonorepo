export function parseTags(tagsString: string): string[] {
  if (!tagsString || !tagsString.trim()) {
    return [];
  }
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}
