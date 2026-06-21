import { describe, it, expect } from 'vitest';
import {
  isVisible,
  sortByDate,
  collectTags,
  parseCategory,
  postInCategory,
  collectCategories,
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

describe('parseCategory', () => {
  it('parses 2 levels, ignores deeper, handles empty', () => {
    expect(parseCategory('학교수업/풀스택네트워킹')).toEqual({
      parent: '학교수업',
      child: '풀스택네트워킹',
    });
    expect(parseCategory('학교수업')).toEqual({ parent: '학교수업', child: undefined });
    expect(parseCategory('a/b/c')).toEqual({ parent: 'a', child: 'b' });
    expect(parseCategory(undefined)).toBeNull();
  });
});

describe('postInCategory', () => {
  it('matches parent (incl. children) and specific child', () => {
    const p = { category: '학교수업/풀스택네트워킹' };
    expect(postInCategory(p, '학교수업')).toBe(true);
    expect(postInCategory(p, '학교수업', '풀스택네트워킹')).toBe(true);
    expect(postInCategory(p, '학교수업', '소프트웨어공학')).toBe(false);
    expect(postInCategory(p, '개인공부')).toBe(false);
  });
});

describe('collectCategories', () => {
  it('builds a 2-level tree with counts, Korean collation', () => {
    const posts = [
      { data: { category: '학교수업/풀스택네트워킹' } },
      { data: { category: '학교수업/소프트웨어공학' } },
      { data: { category: '개인공부/Go' } },
      { data: { category: undefined } },
    ];
    expect(collectCategories(posts)).toEqual([
      {
        parent: '개인공부',
        count: 1,
        children: [{ child: 'Go', count: 1 }],
      },
      {
        parent: '학교수업',
        count: 2,
        children: [
          { child: '소프트웨어공학', count: 1 },
          { child: '풀스택네트워킹', count: 1 },
        ],
      },
    ]);
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
