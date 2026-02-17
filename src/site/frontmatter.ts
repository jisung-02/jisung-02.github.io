import type { FrontMatter } from "./types.js";

export interface MarkdownDocument {
  frontMatter: FrontMatter;
  body: string;
}

const FRONT_MATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?/;

export function parseMarkdownDocument(markdown: string): MarkdownDocument {
  const match = markdown.match(FRONT_MATTER_PATTERN);
  if (!match) {
    return {
      frontMatter: {},
      body: markdown.trim(),
    };
  }

  const frontMatterBlock = match[1];
  const body = markdown.slice(match[0].length).trim();

  return {
    frontMatter: parseSimpleYaml(frontMatterBlock),
    body,
  };
}

function parseSimpleYaml(yamlText: string): FrontMatter {
  const result: FrontMatter = {};
  const lines = yamlText.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trimEnd();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyMatch) {
      continue;
    }

    const key = keyMatch[1];
    const value = keyMatch[2];

    if (!value) {
      const listValues: string[] = [];
      let cursor = index + 1;
      while (cursor < lines.length) {
        const listLine = lines[cursor];
        const listMatch = listLine.match(/^\s*-\s*(.+)$/);
        if (!listMatch) {
          break;
        }

        listValues.push(stripWrappingQuotes(listMatch[1].trim()));
        cursor += 1;
      }

      result[key] = listValues;
      index = cursor - 1;
      continue;
    }

    result[key] = parseScalarValue(value);
  }

  return result;
}

function parseScalarValue(rawValue: string): string | boolean | string[] {
  const value = rawValue.trim();

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    const inside = value.slice(1, -1).trim();
    if (!inside) {
      return [];
    }

    return inside
      .split(",")
      .map((item) => stripWrappingQuotes(item.trim()))
      .filter(Boolean);
  }

  return stripWrappingQuotes(value);
}

function stripWrappingQuotes(value: string): string {
  if (value.length >= 2) {
    const startsWithSingle = value.startsWith("'") && value.endsWith("'");
    const startsWithDouble = value.startsWith('"') && value.endsWith('"');
    if (startsWithSingle || startsWithDouble) {
      return value.slice(1, -1);
    }
  }

  return value;
}
