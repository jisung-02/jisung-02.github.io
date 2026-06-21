# myblog

Obsidian vault(`contents/`)로 쓰고 GitHub Pages로 발행하는 개인 블로그.

## 글 쓰기
1. Obsidian에서 `contents/` 폴더를 vault로 연다.
2. `contents/posts/`에 `.md` 파일을 만들고 frontmatter를 채운다:
   ```yaml
   ---
   title: 제목
   date: 2026-06-20
   publish: true        # true일 때만 발행
   tags: [태그1, 태그2]
   description: 한 줄 설명   # 선택
   ---
   ```
3. 이미지는 그냥 붙여넣으면 `contents/attachments/`에 저장되고 표준 마크다운 링크로 삽입된다.
4. 초안은 `publish: false`로 두면 로컬에서만 보이고 배포되지 않는다.

## 발행
`git add -A && git commit && git push` → GitHub Actions가 자동 빌드·배포 → https://jisung-02.github.io

## 로컬 미리보기
`npm install` 후 `npm run dev` (초안 포함 미리보기). `npm test`로 헬퍼 테스트.

## 폴더
- `contents/posts/` 발행 대상 · `contents/notes/` 비공개 메모 · `contents/attachments/` 이미지
- `src/` Astro 코드 · `DESIGN.md` 디자인 단일 출처
