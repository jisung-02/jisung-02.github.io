import { getCollection } from 'astro:content';
import { isVisible, sortByDate, categoryPath, withFullCategory } from '../lib/posts';

// llms.txt — 생성형 엔진(LLM)이 사이트 구조를 이해하도록 돕는 마크다운 인덱스 (GEO)
export async function GET(context) {
  const site = context.site?.href?.replace(/\/$/, '') ?? '';
  const all = withFullCategory(await getCollection('posts'));
  const posts = sortByDate(all.filter((p) => isVisible(p.data, import.meta.env.PROD)));

  const groups = new Map<string, typeof posts>();
  for (const p of posts) {
    const top = categoryPath(p.data.category)[0] ?? '기타';
    if (!groups.has(top)) groups.set(top, []);
    groups.get(top)!.push(p);
  }

  const lines: string[] = [
    '# jisung-02',
    '',
    '> 학부생의 CS 학습 정리 노트. 기계학습·운영체제·네트워크·클라우드 인프라, 그리고 학교 강의 정리를 담고 있다.',
    '',
    'Obsidian으로 작성해 그대로 발행하는 정적 블로그다. 각 글은 개념 정의 → 핵심 요약 → 상세 순으로 정리되어 있다.',
    '',
  ];
  for (const [cat, ps] of groups) {
    lines.push(`## ${cat}`, '');
    for (const p of ps) {
      const d = p.data.description ? `: ${p.data.description}` : '';
      lines.push(`- [${p.data.title}](${site}/posts/${p.id}/)${d}`);
    }
    lines.push('');
  }
  lines.push('## 기타', '', `- [RSS 피드](${site}/rss.xml)`, `- [사이트맵](${site}/sitemap-index.xml)`, '');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
