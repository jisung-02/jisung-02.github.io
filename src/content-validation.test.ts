import { describe, it, expect } from 'vitest';
import { validateNote } from '../scripts/check-content.mjs';
import { matchesSearch } from '../public/search.mjs';
const note = (metadata = '', body = '본문') => `---\ntitle: 테스트\ndate: 2026-09-05\npublish: true\n${metadata}\n---\n${body}`;
describe('Obsidian publishing format', () => {
  it('accepts standard Markdown and a valid leap day', () => {
    expect(validateNote(note('tags: [운영체제, 메모]').replace('2026-09-05', '2024-02-29'))).toEqual([]);
  });
  it('rejects impossible dates, string booleans and scalar tags', () => {
    expect(validateNote(note('tags: 메모').replace('2026-09-05', '2026-02-30').replace('publish: true', 'publish: "true"'))).toHaveLength(3);
  });
  it('ignores wiki syntax in code but flags unsupported links in prose', () => {
    expect(validateNote(note('', '```text\n[[example]]\n```'))).toEqual([]);
    expect(validateNote(note('', '[[연결된 노트]]'))).toHaveLength(1);
  });
  it('allows an empty draft but refuses an empty published post', () => {
    expect(validateNote(note('', ''))).toHaveLength(1);
    expect(validateNote(note('', '').replace('publish: true', 'publish: false'))).toEqual([]);
  });
});
describe('archive search', () => {
  it('matches decomposed Korean and multiple case-insensitive terms', () => {
    expect(matchesSearch('운영체제 TCP'.normalize('NFD'), 'tcp 운영')).toBe(true);
    expect(matchesSearch('운영체제 TCP', '운영 UDP')).toBe(false);
    expect(matchesSearch('운영체제 TCP', '  ')).toBe(true);
  });
});
