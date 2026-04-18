import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { parseMarkdownDocument } from "./frontmatter.js";
import type { ContentSection, ParsedMarkdown } from "./types.js";

export async function collectMarkdownFiles(rootDirectory: string): Promise<string[]> {
  const entries = await readdir(rootDirectory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(rootDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function loadMarkdownFile(
  filePath: string,
  contentRoot: string,
): Promise<ParsedMarkdown> {
  const raw = await readFile(filePath, "utf8");
  const { frontMatter, body } = parseMarkdownDocument(raw);

  const relativePath = path.relative(contentRoot, filePath);
  const vaultPath = normalizeVaultPath(relativePath);
  const pathSegments = vaultPath.split("/").slice(0, -1);
  const relativePathWithoutExtension = relativePath.replace(/\.md$/, "");
  const isIndex = isIndexFile(relativePath);
  const title = resolveTitle(frontMatter.title, relativePathWithoutExtension);
  const tags = resolveTags(frontMatter.tags);

  const section = resolveSection(relativePathWithoutExtension);
  const slug = resolveSlug(relativePathWithoutExtension);
  const urlPath = resolveUrlPath(relativePathWithoutExtension);

  const summary = resolveSummary(frontMatter.description, body);
  const date = typeof frontMatter.date === "string" ? frontMatter.date : undefined;

  return {
    title,
    vaultPath,
    pathSegments,
    isIndex,
    tags,
    frontMatter,
    body,
    summary,
    slug,
    section,
    sourcePath: filePath,
    urlPath,
    date,
  };
}

export async function loadAllMarkdown(contentRoot: string): Promise<ParsedMarkdown[]> {
  const files = await collectMarkdownFiles(contentRoot);
  const loaded = await Promise.all(files.map((file) => loadMarkdownFile(file, contentRoot)));

  return loaded.sort((left, right) => {
    const leftDate = left.date ?? "";
    const rightDate = right.date ?? "";

    return rightDate.localeCompare(leftDate);
  });
}

function resolveSection(relativePathWithoutExtension: string): ContentSection {
  const [section] = relativePathWithoutExtension.split(path.sep);

  if (section === "about" || section === "posts" || section === "profile" || section === "projects") {
    return section;
  }

  return "unknown";
}

function resolveSlug(relativePathWithoutExtension: string): string {
  if (isIndexPath(relativePathWithoutExtension)) {
    const parentDirectory = path.dirname(relativePathWithoutExtension);
    return parentDirectory === "." ? "index" : path.basename(parentDirectory);
  }

  return path.basename(relativePathWithoutExtension);
}

function resolveUrlPath(relativePathWithoutExtension: string): string {
  const normalized = relativePathWithoutExtension.split(path.sep).join("/");

  if (normalized.endsWith("/index")) {
    return `/${normalized.slice(0, -"/index".length)}/`;
  }

  if (normalized.endsWith("/_index")) {
    return `/${normalized.slice(0, -"/_index".length)}/`;
  }

  if (normalized === "index" || normalized === "_index") {
    return "/";
  }

  return `/${normalized}/`;
}

function normalizeVaultPath(relativePath: string): string {
  return relativePath.split(path.sep).join("/");
}

function resolveTitle(title: unknown, relativePathWithoutExtension: string): string {
  if (typeof title === "string" && title.trim().length > 0) {
    return title.trim();
  }

  return resolveSlug(relativePathWithoutExtension);
}

function resolveSummary(description: unknown, body: string): string {
  if (typeof description === "string" && description.trim()) {
    return description.trim();
  }

  const plain = stripMarkdown(body);
  return plain.slice(0, 160).trim();
}

function resolveTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags.filter((tag): tag is string => typeof tag === "string");
}

function isIndexFile(relativePath: string): boolean {
  return isIndexPath(relativePath.replace(/\.md$/, ""));
}

function isIndexPath(relativePathWithoutExtension: string): boolean {
  const baseName = path.basename(relativePathWithoutExtension);
  return baseName === "index" || baseName === "_index";
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
