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
   `contents/templates/post.md`를 옵시디언 템플릿으로 쓰면 편하다.
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
npm test        # 카테고리·검색·작성 형식 테스트(vitest)
```

## 폴더
- `contents/posts/` 발행 대상(폴더=카테고리) · `contents/notes/` 비공개 메모·템플릿 · `contents/attachments/` 이미지
- `src/` Astro 코드 (`lib/posts.ts` 카테고리·정렬 로직) · `DESIGN.md` 디자인 단일 출처 · `AGENTS.md` 기여/에이전트 가이드

## 검색과 대표 글
- Archive에서 제목·설명·본문·태그를 검색한다. 여러 단어를 입력하면 모두 포함한 글을 찾는다.
- 어느 페이지에서든 Cmd/Ctrl+K로 검색창에 접근한다.
- 홈에 올릴 글에는 `featured: true`를 추가한다. 날짜가 최신인 대표 글부터 최대 3개를 표시하며, 부족하면 최신 글로 채운다.

## Obsidian 작성 규칙과 검사
`npm run check`로 모든 글의 frontmatter를 검사한다. `npm run build`도 이 검사를 먼저 실행한다.

- `date`와 `updated`는 실제 날짜를 `YYYY-MM-DD`로 적는다.
- `publish`와 `featured`는 따옴표 없는 `true` 또는 `false`다.
- `tags`는 문자열 목록이다. `tags: [운영체제, Linux]`처럼 작성한다.
- Obsidian 설정의 **Use Markdown links**를 켠다. `[[위키 링크]]`와 `![[임베드]]` 대신 표준 Markdown 링크와 이미지를 사용한다.
- 이미지는 `contents/attachments/`에 두고 글의 위치에 맞는 상대 경로로 연결한다. 첨부 폴더를 이동하면 링크도 함께 수정한다.
- `$수식$`, `$$수식$$`, 코드 블록, 표를 지원한다. Obsidian 전용 플러그인의 렌더링이나 콜아웃·블록 참조는 동일하게 표시되지 않을 수 있다.
- `publish: false`인 글은 개발 서버에서만 보인다. 배포 결과는 `npm run build && npm run preview`로 확인한다.
- `contents/notes/`는 빌드 대상이 아니다. 다만 공개 GitHub 저장소에 커밋한 파일은 GitHub에서 볼 수 있으므로 비밀 정보는 커밋하지 않는다.
