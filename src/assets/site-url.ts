const ABSOLUTE_URL_PATTERN = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

export function normalizeSiteRoot(siteRoot: string): string {
  const trimmed = siteRoot.trim();

  if (!trimmed || trimmed === "/") {
    return "/";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function resolveSiteUrl(siteRoot: string, candidate: string): string {
  const trimmed = candidate.trim();
  if (!trimmed) {
    return normalizeSiteRoot(siteRoot);
  }

  if (trimmed.startsWith("#") || trimmed.startsWith("//") || ABSOLUTE_URL_PATTERN.test(trimmed)) {
    return trimmed;
  }

  const normalizedRoot = normalizeSiteRoot(siteRoot);
  if (normalizedRoot !== "/" && trimmed.startsWith(normalizedRoot)) {
    return trimmed;
  }

  if (normalizedRoot === "/") {
    return trimmed.startsWith("/") ? trimmed : `/${trimmed.replace(/^\.\//, "")}`;
  }

  if (trimmed.startsWith("/")) {
    return `${normalizedRoot.slice(0, -1)}${trimmed}`;
  }

  return `${normalizedRoot}${trimmed.replace(/^\.\//, "")}`;
}
