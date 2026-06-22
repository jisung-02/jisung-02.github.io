import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  // id(=URL)는 contents/posts 아래 디렉터리 경로 전체. 세그먼트별로 슬러그화(공백·중점 → '-').
  loader: glob({
    pattern: '**/[^_]*.md',
    base: './contents/posts',
    generateId: ({ entry }) =>
      entry
        .replace(/\.md$/, '')
        .split('/')
        .map((s) => s.trim().toLowerCase().replace(/[\s·]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''))
        .join('/'),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    publish: z.boolean().default(false),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    description: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { posts };
