import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { loadAllMarkdown } from "./content.js";
import type { ParsedMarkdown, SearchIndexEntry } from "./types.js";

export interface GenerateSearchIndexOptions {
  contentDirectory: string;
  outputFilePath: string;
}

export async function generateSearchIndex(options: GenerateSearchIndexOptions): Promise<SearchIndexEntry[]> {
  const entries = await loadAllMarkdown(options.contentDirectory);
  const index = buildSearchIndex(entries);

  await mkdir(path.dirname(options.outputFilePath), { recursive: true });
  await writeFile(options.outputFilePath, JSON.stringify(index, null, 2), "utf8");

  return index;
}

export function buildSearchIndex(entries: ParsedMarkdown[]): SearchIndexEntry[] {
  return entries
    .filter((entry) => entry.frontMatter.draft !== true)
    .map((entry) => {
      const tags = Array.isArray(entry.frontMatter.tags)
        ? entry.frontMatter.tags.filter((tag): tag is string => typeof tag === "string")
        : [];

      return {
        title: entry.frontMatter.title ?? entry.slug,
        description: entry.summary,
        section: entry.section,
        tags,
        date: entry.frontMatter.date,
        url: entry.urlPath,
      };
    })
    .filter((entry) => entry.title.trim().length > 0);
}
