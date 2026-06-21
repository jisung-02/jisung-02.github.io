export function isVisible(data: { publish: boolean }, isProd: boolean): boolean {
  return isProd ? data.publish === true : true;
}

export function sortByDate<T extends { data: { date: Date } }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// 카테고리는 최대 2계층("상위/하위"). 더 깊은 단계는 무시한다.
export function parseCategory(
  cat?: string,
): { parent: string; child?: string } | null {
  if (!cat) return null;
  const parts = cat.split('/').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return null;
  return { parent: parts[0], child: parts[1] };
}

export function postInCategory(
  data: { category?: string },
  parent: string,
  child?: string,
): boolean {
  const c = parseCategory(data.category);
  if (!c || c.parent !== parent) return false;
  return child ? c.child === child : true;
}

export function collectCategories<T extends { data: { category?: string } }>(
  posts: T[],
): { parent: string; count: number; children: { child: string; count: number }[] }[] {
  const tree = new Map<string, Map<string, number>>();
  for (const p of posts) {
    const c = parseCategory(p.data.category);
    if (!c) continue;
    if (!tree.has(c.parent)) tree.set(c.parent, new Map());
    const kids = tree.get(c.parent)!;
    const key = c.child ?? '';
    kids.set(key, (kids.get(key) ?? 0) + 1);
  }
  return [...tree.entries()]
    .map(([parent, kids]) => ({
      parent,
      count: [...kids.values()].reduce((s, n) => s + n, 0),
      children: [...kids.entries()]
        .filter(([k]) => k !== '')
        .map(([child, count]) => ({ child, count }))
        .sort((a, b) => a.child.localeCompare(b.child, 'ko')),
    }))
    .sort((a, b) => a.parent.localeCompare(b.parent, 'ko'));
}

export function collectTags<T extends { data: { tags: string[] } }>(
  posts: T[],
): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.data.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.tag.localeCompare(b.tag, 'ko'));
}
