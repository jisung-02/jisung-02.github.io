export type ContentSection = "about" | "posts" | "profile" | "projects" | "unknown";

export interface FrontMatter {
  title?: string;
  date?: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
  [key: string]: string | string[] | boolean | undefined;
}

export interface VaultTreePageEntry {
  kind: "page";
  title: string;
  vaultPath: string;
  pathSegments: string[];
  isIndex: boolean;
  urlPath: string;
  summary: string;
  date?: string;
  tags: string[];
}

export interface VaultTreeAssetEntry {
  kind: "asset";
  vaultPath: string;
  pathSegments: string[];
}

export type VaultTreeEntry = VaultTreePageEntry | VaultTreeAssetEntry;

export interface VaultPageSummary {
  title: string;
  urlPath: string;
  vaultPath: string;
  summary: string;
  date?: string;
  tags: string[];
}

export interface VaultFolderNode {
  path: string;
  depth: number;
  children: VaultFolderNode[];
  pages: VaultPageSummary[];
  indexPage?: VaultPageSummary;
  assetCount: number;
}

export interface ParsedMarkdown {
  title: string;
  vaultPath: string;
  pathSegments: string[];
  isIndex: boolean;
  tags: string[];
  frontMatter: FrontMatter;
  body: string;
  summary: string;
  slug: string;
  section: ContentSection;
  sourcePath: string;
  urlPath: string;
  date?: string;
}

export interface SearchIndexEntry {
  title: string;
  description: string;
  section: ContentSection;
  tags: string[];
  date?: string;
  url: string;
}
