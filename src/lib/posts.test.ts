import { describe, it, expect } from 'vitest';
import {
  isVisible,
  sortByDate,
  collectTags,
  categoryPath,
  buildCategoryTree,
  flattenCategoryNodes,
  postsUnder,
  withFullCategory,
} from './posts';

describe('withFullCategory', () => {
  it('1차·2차 디렉터리 경로 전체를 카테고리로 쓴다', () => {
    const [p] = withFullCategory([
      { filePath: 'contents/posts/학교공부/AI네트워킹/ain-f01.md', data: {} },
    ]);
    expect(p.data.category).toBe('학교공부/AI네트워킹');
  });
  it('1차만 있으면 그 디렉터리명', () => {
    const [p] = withFullCategory([
      { filePath: 'contents/posts/개발도구·생산성/cli.md', data: {} },
    ]);
    expect(p.data.category).toBe('개발도구·생산성');
  });
  it('프런트매터 category는 무시하고 경로로 덮어쓴다', () => {
    const [p] = withFullCategory([
      { filePath: 'contents/posts/학교공부/운영체제/os.md', data: { category: '엉뚱' } },
    ]);
    expect(p.data.category).toBe('학교공부/운영체제');
  });
  it('루트 글은 카테고리 없음', () => {
    const [p] = withFullCategory([
      { filePath: 'contents/posts/foo.md', data: {} },
    ]);
    expect(p.data.category).toBeUndefined();
  });
});

describe('isVisible', () => {
  it('hides unpublished in prod', () => {
    expect(isVisible({ publish: false }, true)).toBe(false);
    expect(isVisible({ publish: true }, true)).toBe(true);
  });
  it('shows everything in dev', () => {
    expect(isVisible({ publish: false }, false)).toBe(true);
  });
});

describe('sortByDate', () => {
  it('orders newest first', () => {
    const a = { data: { date: new Date('2026-01-01') } };
    const b = { data: { date: new Date('2026-06-01') } };
    expect(sortByDate([a, b])).toEqual([b, a]);
  });
});

describe('categoryPath', () => {
  it('splits a multi-level path, trims, handles empty', () => {
    expect(categoryPath('개인공부/클라우드·인프라/OpenStack')).toEqual([
      '개인공부',
      '클라우드·인프라',
      'OpenStack',
    ]);
    expect(categoryPath('개인공부')).toEqual(['개인공부']);
    expect(categoryPath(undefined)).toEqual([]);
  });
});

describe('buildCategoryTree', () => {
  const posts = [
    { data: { category: '개인공부/클라우드·인프라/OpenStack' } },
    { data: { category: '개인공부/클라우드·인프라/Cloudflare' } },
    { data: { category: '개인공부/시스템·네트워크' } },
    { data: { category: undefined } },
  ];

  it('nests by path with subtree counts, only populated branches', () => {
    const tree = buildCategoryTree(posts);
    expect(tree).toHaveLength(1); // 개인공부
    const root = tree[0];
    expect(root.name).toBe('개인공부');
    expect(root.count).toBe(3);
    // CATEGORY_ORDER: 시스템·네트워크 before 클라우드·인프라
    expect(root.children.map((c) => c.name)).toEqual(['시스템·네트워크', '클라우드·인프라']);
    const cloud = root.children[1];
    expect(cloud.count).toBe(2);
    expect(cloud.path).toEqual(['개인공부', '클라우드·인프라']);
    expect(cloud.children.map((c) => c.name)).toEqual(['OpenStack', 'Cloudflare']);
  });

  it('flattenCategoryNodes yields every node', () => {
    const flat = flattenCategoryNodes(buildCategoryTree(posts));
    expect(flat.map((n) => n.path.join('/'))).toEqual([
      '개인공부',
      '개인공부/시스템·네트워크',
      '개인공부/클라우드·인프라',
      '개인공부/클라우드·인프라/OpenStack',
      '개인공부/클라우드·인프라/Cloudflare',
    ]);
  });

  it('postsUnder matches a node and its whole subtree', () => {
    expect(postsUnder(posts, ['개인공부']).length).toBe(3);
    expect(postsUnder(posts, ['개인공부', '클라우드·인프라']).length).toBe(2);
    expect(postsUnder(posts, ['개인공부', '클라우드·인프라', 'OpenStack']).length).toBe(1);
  });
});

describe('collectTags', () => {
  it('counts unique tags, sorted by name (Korean collation: 한글 우선)', () => {
    const posts = [
      { data: { tags: ['cs', '자료구조'] } },
      { data: { tags: ['cs'] } },
    ];
    expect(collectTags(posts)).toEqual([
      { tag: '자료구조', count: 1 },
      { tag: 'cs', count: 2 },
    ]);
  });
});
