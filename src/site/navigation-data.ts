import { buildVaultTree } from "./navigation.js";
import type { ParsedMarkdown, VaultFolderNode, VaultTreeEntry } from "./types.js";

export interface NavigationRecentNote {
  title: string;
  urlPath: string;
  date?: string;
  summary: string;
  folder: string;
}

export interface NavigationData {
  generatedAt: string;
  topLevelFolders: VaultFolderNode[];
  recentNotes: NavigationRecentNote[];
}

export function buildNavigationData(entries: ParsedMarkdown[]): NavigationData {
  const publicEntries = entries.filter((entry) => entry.frontMatter.draft !== true);
  const tree = buildVaultTree(publicEntries.map(toTreeEntry));

  return {
    generatedAt: new Date().toISOString(),
    topLevelFolders: tree.children,
    recentNotes: publicEntries
      .filter((entry) => !entry.isIndex)
      .sort(compareRecentEntries)
      .map((entry) => ({
        title: entry.title,
        urlPath: entry.urlPath,
        date: entry.date,
        summary: entry.summary,
        folder: entry.pathSegments.join("/") || "root",
      })),
  };
}

function toTreeEntry(entry: ParsedMarkdown): VaultTreeEntry {
  return {
    kind: "page",
    title: entry.title,
    vaultPath: entry.vaultPath,
    pathSegments: entry.pathSegments,
    isIndex: entry.isIndex,
    urlPath: entry.urlPath,
    summary: entry.summary,
    date: entry.date,
    tags: entry.tags,
  };
}

function compareRecentEntries(left: ParsedMarkdown, right: ParsedMarkdown): number {
  const leftDate = left.date ?? "";
  const rightDate = right.date ?? "";

  if (leftDate !== rightDate) {
    return rightDate.localeCompare(leftDate);
  }

  const titleOrder = left.title.localeCompare(right.title);
  if (titleOrder !== 0) {
    return titleOrder;
  }

  return left.vaultPath.localeCompare(right.vaultPath);
}
