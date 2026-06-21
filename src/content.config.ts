import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './contents/posts' }),
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
