import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { load, JSON_SCHEMA } from 'js-yaml';

export function validateNote(source) {
  const errors = [];
  const match = source.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) return ['파일 맨 위에 YAML frontmatter(---)가 필요합니다.'];
  let data;
  try { data = load(match[1], { schema: JSON_SCHEMA }); }
  catch (error) { return [`YAML 오류: ${error.message}`]; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return ['frontmatter는 속성 목록이어야 합니다.'];
  if (typeof data.title !== 'string' || !data.title.trim()) errors.push('title: 비어 있지 않은 제목이 필요합니다.');
  for (const key of ['date', 'updated']) {
    if (key === 'updated' && data[key] === undefined) continue;
    const date = data[key];
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date)
      errors.push(`${key}: 실제 날짜를 YYYY-MM-DD 형식으로 작성하세요.`);
  }
  for (const key of ['publish', 'featured']) {
    if (data[key] !== undefined && typeof data[key] !== 'boolean') errors.push(`${key}: 따옴표 없는 true 또는 false를 사용하세요.`);
  }
  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some(tag => typeof tag !== 'string' || !tag.trim()))) errors.push('tags: [태그1, 태그2] 형식의 문자열 목록을 사용하세요.');
  if (data.description !== undefined && typeof data.description !== 'string') errors.push('description: 문자열을 사용하세요.');
  if (data.publish === true && !match[2].trim()) errors.push('발행할 글의 본문이 비어 있습니다.');
  // Obsidian-only syntax is not part of this site's Markdown renderer.
  const prose = match[2].replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '').replace(/`[^`\n]*`/g, '');
  if (/!?\[\[[^\]\n]+\]\]/.test(prose)) errors.push('위키 링크 대신 표준 Markdown 링크 [제목](주소) / ![설명](이미지)를 사용하세요.');
  return errors;
}

async function main() {
  const root = resolve('contents/posts');
  const entries = await readdir(root, { recursive: true, withFileTypes: true });
  let count = 0, failures = 0;
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || entry.name.startsWith('_')) continue;
    const path = resolve(entry.parentPath, entry.name);
    const errors = validateNote(await readFile(path, 'utf8'));
    count++;
    for (const error of errors) { console.error(`${path}: ${error}`); failures++; }
  }
  console.log(`${count}개 글 검사 · 오류 ${failures}개`);
  if (failures) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
