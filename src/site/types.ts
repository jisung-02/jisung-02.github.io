export type ContentSection = "about" | "posts" | "profile" | "projects" | "unknown";

export interface FrontMatter {
  title?: string;
  date?: string;
  description?: string;
  tags?: string[];
  draft?: boolean;
  [key: string]: string | string[] | boolean | undefined;
}

export interface ParsedMarkdown {
  frontMatter: FrontMatter;
  body: string;
  summary: string;
  slug: string;
  section: ContentSection;
  sourcePath: string;
  urlPath: string;
}

export interface SearchIndexEntry {
  title: string;
  description: string;
  section: ContentSection;
  tags: string[];
  date?: string;
  url: string;
}
