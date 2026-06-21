import { describe, it, expect } from 'vitest';
import {
  isVisible,
  sortByDate,
  collectTags,
  categoryPath,
  buildCategoryTree,
  flattenCategoryNodes,
  postsUnder,
} from './posts';

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
