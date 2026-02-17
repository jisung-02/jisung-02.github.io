import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { collectMarkdownFiles } from "../src/site/content.js";
import { parseMarkdownDocument } from "../src/site/frontmatter.js";

const rootDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDirectory = path.join(rootDirectory, "content");
const requiredSections = ["profile", "posts", "projects"];

async function main(): Promise<void> {
  const failures: string[] = [];

  for (const section of requiredSections) {
    const sectionDirectory = path.join(contentDirectory, section);
    try {
      const stats = await stat(sectionDirectory);
      if (!stats.isDirectory()) {
        failures.push(`content/${section} must be a directory`);
      }
    } catch {
      failures.push(`content/${section} is missing`);
    }
  }

  const markdownFiles = await collectMarkdownFiles(contentDirectory);
  const domains = new Set<string>();

  for (const filePath of markdownFiles) {
    const raw = await readFile(filePath, "utf8");
    const relativeFilePath = path.relative(rootDirectory, filePath);

    const { frontMatter } = parseMarkdownDocument(raw);
    if (typeof frontMatter.title !== "string" || frontMatter.title.trim().length === 0) {
      failures.push(`${relativeFilePath}: title frontmatter is required`);
    }

    const hasDescription = typeof frontMatter.description === "string" && frontMatter.description.trim().length > 0;
    if ((relativeFilePath.includes("/posts/") || relativeFilePath.includes("/projects/")) && !hasDescription) {
      failures.push(`${relativeFilePath}: description frontmatter is required for posts/projects`);
    }

    const urls = extractUrls(raw);
    for (const candidate of urls) {
      try {
        const parsed = new URL(candidate);
        if (parsed.protocol !== "https:") {
          failures.push(`${relativeFilePath}: non-HTTPS URL -> ${candidate}`);
          continue;
        }

        if (!parsed.hostname.includes(".")) {
          failures.push(`${relativeFilePath}: invalid domain -> ${candidate}`);
          continue;
        }

        domains.add(parsed.hostname);
      } catch {
        failures.push(`${relativeFilePath}: malformed URL -> ${candidate}`);
      }
    }

    const markdownDestinations = extractMarkdownLinkDestinations(raw);
    for (const destination of markdownDestinations) {
      const normalized = normalizeMarkdownDestination(destination);
      if (!normalized) {
        continue;
      }

      if (/^(javascript|data|vbscript):/i.test(normalized)) {
        failures.push(`${relativeFilePath}: unsafe link protocol -> ${destination}`);
        continue;
      }

      if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(normalized) && !normalized.startsWith("https://")) {
        failures.push(`${relativeFilePath}: absolute link must use HTTPS -> ${destination}`);
      }
    }
  }

  if (failures.length > 0) {
    console.error("\nContent check failed:\n");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  const sortedDomains = [...domains].sort();
  console.log(`content ok: ${markdownFiles.length} markdown files checked`);
  console.log(`verified domains (${sortedDomains.length}): ${sortedDomains.join(", ") || "none"}`);
}

function extractUrls(text: string): string[] {
  const urls = text.match(/https?:\/\/[^\s)\]}>"']+/g);
  if (!urls) {
    return [];
  }

  return [...new Set(urls.map((url) => url.replace(/[.,;!?]+$/, "")))];
}

function extractMarkdownLinkDestinations(text: string): string[] {
  const destinations: string[] = [];
  const pattern = /\[[^\]]+\]\(([^)]+)\)/g;

  for (const match of text.matchAll(pattern)) {
    const destination = match[1]?.trim();
    if (destination) {
      destinations.push(destination);
    }
  }

  return [...new Set(destinations)];
}

function normalizeMarkdownDestination(destination: string): string {
  const withoutTitle = destination.split(/\s+\"/)[0];
  const trimmed = withoutTitle.trim();
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("#") || trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
    return "";
  }

  return trimmed.replace(/^<|>$/g, "");
}

void main();
