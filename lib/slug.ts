export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function uniqueSlug(base: string, attempt = 0): string {
  if (attempt === 0) return base;
  return `${base}-${attempt}`;
}
