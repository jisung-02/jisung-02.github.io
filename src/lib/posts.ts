export function isVisible(data: { publish: boolean }, isProd: boolean): boolean {
  return isProd ? data.publish === true : true;
}

export function sortByDate<T extends { data: { date: Date } }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

// 카테고리는 다계층 경로("개인공부/클라우드·인프라/OpenStack"). 이름에 '/'는 쓰지 않는다(구분자).
// 형제 정렬 우선순위(드러난 순서). 목록에 없으면 한글 정렬로 뒤에 붙는다.
const CATEGORY_ORDER = [
  '개인공부', '학교수업',
  '컴퓨터공학 기초', '시스템·네트워크', '클라우드·인프라', '프로그래밍 언어·런타임',
  '개발도구·생산성', '프로젝트 회고·배운 점', '기술 트렌드·리서치', '글쓰기·커뮤니케이션',
  '객체지향', '소프트웨어공학', '의존성·설계 원칙', 'SWEBOK 정리',
  'OpenStack', 'Cloudflare', 'Ansible', 'UTM·가상화',
  'Go', 'Python', 'JavaScript·Node', '런타임 내부',
];

export function categoryPath(cat?: string): string[] {
  if (!cat) return [];
  return cat.split('/').map((s) => s.trim()).filter(Boolean);
}

export interface CatNode {
  name: string;
  path: string[]; // 루트부터의 경로 세그먼트
  count: number; // 이 노드 서브트리의 글 수
  children: CatNode[];
}

function sortNodes(nodes: CatNode[]): void {
  nodes.sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a.name);
    const ib = CATEGORY_ORDER.indexOf(b.name);
    if (ia !== -1 || ib !== -1) {
      return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib);
    }
    return a.name.localeCompare(b.name, 'ko');
  });
  for (const n of nodes) sortNodes(n.children);
}

// 글이 있는 가지만으로 다계층 트리를 만든다(빈 카테고리는 글이 생기면 자동 등장).
export function buildCategoryTree<T extends { data: { category?: string } }>(
  posts: T[],
): CatNode[] {
  const roots: CatNode[] = [];
  for (const p of posts) {
    const segs = categoryPath(p.data.category);
    if (segs.length === 0) continue;
    let level = roots;
    const acc: string[] = [];
    for (const seg of segs) {
      acc.push(seg);
      let node = level.find((n) => n.name === seg);
      if (!node) {
        node = { name: seg, path: [...acc], count: 0, children: [] };
        level.push(node);
      }
      node.count++;
      level = node.children;
    }
  }
  sortNodes(roots);
  return roots;
}

// 트리의 모든 노드를 평탄화(getStaticPaths용).
export function flattenCategoryNodes(nodes: CatNode[]): CatNode[] {
  const out: CatNode[] = [];
  const walk = (ns: CatNode[]) => {
    for (const n of ns) {
      out.push(n);
      walk(n.children);
    }
  };
  walk(nodes);
  return out;
}

// 주어진 경로(및 그 하위)에 속하는 글.
export function postsUnder<T extends { data: { category?: string } }>(
  posts: T[],
  path: string[],
): T[] {
  return posts.filter((p) => {
    const segs = categoryPath(p.data.category);
    return path.every((s, i) => segs[i] === s);
  });
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
