# AGENTS.md

개인 블로그. Obsidian vault(`contents/`)에 마크다운으로 쓰고 Astro로 빌드해 GitHub Pages에 발행한다.

## 스택
- Astro 6 (정적 빌드), 콘텐츠는 글로브 로더로 `contents/posts/`에서 수집
- 수식: `remark-math` + `rehype-katex`
- 테스트: vitest (`src/lib/posts.test.ts`)
- Node 24, 배포: push to `main` → GitHub Actions(`.github/workflows/deploy.yml`)

## 명령
```bash
npm run dev     # 초안 포함 미리보기
npm run build   # 프로덕션 빌드(publish:true만 노출)
npm test        # 헬퍼 단위 테스트
```
구조나 링크를 건드렸으면 **반드시 `npm run build`로 검증**한다.

## 핵심 규칙 (반드시 지킬 것)
1. **카테고리 = 디렉터리 경로.** 글의 카테고리는 `contents/posts/` 아래 폴더 경로 전체다(`src/lib/posts.ts`의 `categoryFromPath`). 프런트매터에 `category`를 쓰지 않는다. 폴더를 옮기면 카테고리가 바뀐다.
2. **URL = 슬러그화한 폴더 경로.** id 생성 규칙은 `src/content.config.ts`의 `generateId`: 세그먼트별 소문자화 + 공백·중점(`·`) → `-`. 예) `posts/학교공부/운영체제/01-개요.md` → `/posts/학교공부/운영체제/01-개요/`.
3. **파일명을 바꾸거나 옮기면 내부 링크가 깨진다.** 글 본문의 `/posts/...` 링크는 하드코딩된 문자열이라 자동 갱신되지 않는다. 이름/경로 변경 시 전 파일의 `/posts/<옛경로>`를 새 경로로 일괄 치환하고 빌드로 깨진 링크 0을 확인한다.
4. **첨부 상대경로.** 이미지는 `contents/attachments/`에 있고 글에서 `../../attachments/...`처럼 상대경로로 참조한다. 글을 한 단계 깊은 폴더로 옮기면 `../`를 하나 더 붙여야 한다(깊이마다 보정).
5. **발행 게이팅.** `publish: true`만 프로덕션에 노출(`isVisible`). 초안은 `false`.

## 작업 시 주의
- **한글·공백·중점 경로**가 흔하다. 셸 루프(`for f in $(...)`)는 공백 경로를 망가뜨리니, 일괄 변경은 Python으로 파일을 직접 순회하라(과거 셸 치환이 경로를 잘라먹은 사례 있음).
- macOS APFS는 git 인덱스와 워킹트리의 유니코드 정규화가 어긋날 수 있다. 디렉터리명이 잘려 보이면 git/디스크 양쪽을 대조하라.
- `src/lib/posts.ts`는 순수 함수만 둔다(astro 의존 X) — vitest로 테스트하므로. `getCollection` 호출부에서 `withFullCategory`로 카테고리를 주입한다.
- 콘텐츠 대량 수정 후에는 무엇을 바꿨는지(삭제 섹션/라인 수 등) 보고한다. 사용자가 커밋 전 검토한다.

## 폴더
- `contents/posts/` 발행 글(폴더=카테고리) · `contents/notes/` 비공개 메모·템플릿(빌드 제외) · `contents/attachments/` 이미지
- `src/lib/posts.ts` 카테고리 트리·정렬·태그 로직 · `src/pages/` 라우트 · `src/components/` UI
- `DESIGN.md` 디자인 단일 출처
