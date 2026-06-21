import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { isVisible, sortByDate } from '../lib/posts';

export async function GET(context) {
  const all = await getCollection('posts');
  const posts = sortByDate(all.filter((p) => isVisible(p.data, import.meta.env.PROD)));
  return rss({
    title: 'jisung-02',
    description: '학습 정리 노트',
    site: context.site,
    items: posts.map((p) => ({
      title: p.data.title,
      description: p.data.description ?? '',
      pubDate: p.data.date,
      link: `/posts/${p.id}/`,
    })),
  });
}
