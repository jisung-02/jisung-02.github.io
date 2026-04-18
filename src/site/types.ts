export type ContentSection = "about" | "posts" | "profile" | "projects" | "unknown";

export interface FrontMatter {
  title?: string;
  date?: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
  [key: string]: string | string[] | boolean | undefined;
}

export interface VaultPageSummary {
  title: string;
  vaultPath: string;
  pathSegments: string[];
  isIndex: boolean;
  section: ContentSection;
  summary: string;
  slug: string;
  urlPath: string;
  sourcePath: string;
  date?: string;
}

export interface VaultFolderNode {
  name: string;
  pathSegments: string[];
  folders: VaultFolderNode[];
  pages: VaultPageSummary[];
  indexPage?: VaultPageSummary;
}

export interface ParsedMarkdown {
  title: string;
  vaultPath: string;
  pathSegments: string[];
  isIndex: boolean;
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
