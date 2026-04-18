import type { VaultFolderNode, VaultPageSummary } from "./types.js";

export function buildVaultTree(entries: readonly VaultPageSummary[]): VaultFolderNode {
  const root: VaultFolderNode = createFolderNode("", []);

  for (const entry of entries) {
    const folderSegments = entry.pathSegments.slice(0, -1);
    const folder = ensureFolder(root, folderSegments);

    if (entry.isIndex) {
      folder.indexPage = entry;
      continue;
    }

    folder.pages.push(entry);
  }

  return root;
}

function createFolderNode(name: string, pathSegments: string[]): VaultFolderNode {
  return {
    name,
    pathSegments,
    folders: [],
    pages: [],
  };
}

function ensureFolder(root: VaultFolderNode, pathSegments: string[]): VaultFolderNode {
  let current = root;

  for (const segment of pathSegments) {
    let next = current.folders.find((folder) => folder.name === segment);
    if (!next) {
      next = createFolderNode(segment, [...current.pathSegments, segment]);
      current.folders.push(next);
    }

    current = next;
  }

  return current;
}
