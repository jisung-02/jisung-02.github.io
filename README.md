# myblog

Obsidian vault(`contents/`)로 쓰고 GitHub Pages로 발행하는 개인 블로그. Astro + KaTeX.

## 글 쓰기
1. Obsidian에서 `contents/` 폴더를 vault로 연다.
2. **카테고리는 폴더 구조다.** `contents/posts/<1차>/<2차>/`에 글을 둔다.
   예) `posts/학교공부/운영체제/01-개요.md` → 카테고리 `학교공부 › 운영체제`. 2차가 없으면 `posts/<1차>/`에 바로 둔다.
3. frontmatter를 채운다 (`category`는 폴더가 대신하므로 적지 않는다):
   ```yaml
   ---
   title: 제목
   date: 2026-06-20
   publish: true        # true일 때만 발행
   tags: [태그1, 태그2]
   description: 한 줄 설명   # 선택
   updated: 2026-06-22     # 선택
   ---
   ```
   `contents/notes/포스트-템플릿.md`를 옵시디언 템플릿으로 쓰면 편하다.
4. 이미지는 붙여넣으면 `contents/attachments/`에 저장되고 마크다운 링크로 삽입된다.
5. 초안은 `publish: false` → 로컬에서만 보이고 배포 안 됨.

## URL
글 URL은 폴더 경로를 슬러그화한 값. `posts/학교공부/운영체제/01-개요.md` → `/posts/학교공부/운영체제/01-개요/`
(소문자화, 공백·중점`·` → `-`). 파일명을 바꾸면 URL이 바뀌니 글 사이 `/posts/...` 링크도 함께 고쳐야 한다.

## 발행
`git commit && git push` (main) → GitHub Actions가 빌드·배포 → https://jisung-02.github.io

## 로컬
```bash
npm install
npm run dev     # 초안 포함 미리보기
npm run build   # 프로덕션 빌드(publish:true만)
npm test        # src/lib/posts 헬퍼 테스트(vitest)
```

## 폴더
- `contents/posts/` 발행 대상(폴더=카테고리) · `contents/notes/` 비공개 메모·템플릿 · `contents/attachments/` 이미지
- `src/` Astro 코드 (`lib/posts.ts` 카테고리·정렬 로직) · `DESIGN.md` 디자인 단일 출처 · `AGENTS.md` 기여/에이전트 가이드
