export function matchesSearch(text, query) {
  const normalized = text.normalize("NFC").toLocaleLowerCase();
  return query
    .normalize("NFC")
    .toLocaleLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => normalized.includes(term));
}
