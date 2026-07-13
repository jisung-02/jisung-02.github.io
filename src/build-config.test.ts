import { globSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import astroConfig from '../astro.config.mjs';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));

describe('build configuration', () => {
  test('post filenames do not contain URL query or fragment delimiters', () => {
    const postPaths = globSync('**/*.md', {
      cwd: new URL('../contents/posts/', import.meta.url),
    });

    expect(postPaths.filter((path) => /[?#]/.test(path))).toEqual([]);
  });

  test('math plugins are configured through the Astro unified processor', () => {
    expect(astroConfig.markdown).not.toHaveProperty('remarkPlugins');
    expect(astroConfig.markdown).not.toHaveProperty('rehypePlugins');
    expect(astroConfig.markdown?.processor?.name).toBe('unified');
    expect(astroConfig.markdown?.processor?.options.remarkPlugins).toContain(remarkMath);
    expect(astroConfig.markdown?.processor?.options.rehypePlugins).toContain(rehypeKatex);
  });

  test('declares the configured Markdown processor as a direct dependency', () => {
    const packageJson = JSON.parse(readFileSync(`${projectRoot}/package.json`, 'utf8'));

    expect(packageJson.dependencies).toHaveProperty('@astrojs/markdown-remark');
  });
});
