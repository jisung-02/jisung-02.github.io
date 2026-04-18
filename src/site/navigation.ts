import type {
  VaultFolderNode,
  VaultPageSummary,
  VaultTreeEntry,
  VaultTreePageEntry,
} from "./types.js";

export function buildVaultTree(entries: readonly VaultTreeEntry[]): VaultFolderNode {
  const root = createFolderNode("", "", -1);

  for (const entry of entries) {
    const folder = ensureFolder(root, entry.pathSegments);

    if (entry.kind === "asset") {
      folder.assetCount += 1;
      continue;
    }

    const page = toVaultPageSummary(entry);
    if (entry.isIndex) {
      folder.indexPage = page;
      continue;
    }

    folder.pages.push(page);
  }

  sortFolderTree(root);
  return root;
}

function createFolderNode(name: string, path: string, depth: number): VaultFolderNode {
  return {
    name,
    path,
    depth,
    children: [],
    pages: [],
    assetCount: 0,
  };
}

function ensureFolder(root: VaultFolderNode, pathSegments: readonly string[]): VaultFolderNode {
  let current = root;

  for (let index = 0; index < pathSegments.length; index += 1) {
    const segment = pathSegments[index];
    const nextPath = current.path ? `${current.path}/${segment}` : segment;
    let next = current.children.find((child) => child.path === nextPath);

    if (!next) {
      next = createFolderNode(segment, nextPath, current.depth + 1);
      current.children.push(next);
    }

    current = next;
  }

  return current;
}

function sortFolderTree(node: VaultFolderNode): void {
  node.children.sort((left, right) => left.name.localeCompare(right.name));
  node.pages.sort(comparePages);

  for (const child of node.children) {
    sortFolderTree(child);
  }
}

function comparePages(left: VaultPageSummary, right: VaultPageSummary): number {
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

function toVaultPageSummary(entry: VaultTreePageEntry): VaultPageSummary {
  return {
    title: entry.title,
    urlPath: entry.urlPath,
    vaultPath: entry.vaultPath,
    summary: entry.summary,
    date: entry.date,
    tags: entry.tags,
  };
}
