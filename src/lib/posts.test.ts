import { describe, it, expect } from 'vitest';
import { isVisible, sortByDate, collectTags } from './posts';

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
