# PRD: 호수 우파루파 블로그 디자인 시스템

## Context

현재 Hugo + React + TypeScript 기반 블로그의 터미널 미학 디자인을 완전히 새로운 **픽셀아트 호수 컨셉**으로 전면 리디자인한다. 픽셀아트 우파루파(axolotl)가 호수를 헤엄치며 마우스 커서를 따라다니고, 게시물 카드가 수면 위에 떠있는 인터랙티브 UI를 구현한다.

---

## 1. 디자인 시스템

### 1.1 컬러 팔레트

```
[호수 수면]
--lake-deep:       #0a1628    // 호수 깊은 곳 (가장 어두운 배경)
--lake-mid:        #0f2038    // 호수 중간 깊이
--lake-surface:    #163050    // 수면 근처
--lake-highlight:  #1e4068    // 수면 빛 반사
--lake-shimmer:    #2a5a8a    // 수면 반짝임

[수초/식물]
--plant-dark:      #1a3a2a    // 어두운 수초
--plant-mid:       #2d5a3a    // 중간 수초
--plant-light:     #4a8a5a    // 밝은 수초/수련잎
--lily-white:      #e8e0d0    // 수련 꽃 (아이보리)
--lily-pink:       #d4a0a0    // 수련 꽃 (핑크)

[우파루파]
--axolotl-body:    #f0b8c8    // 우파루파 몸통 (핑크)
--axolotl-gill:    #c85070    // 우파루파 아가미 (진분홍)
--axolotl-eye:     #1a1a2e    // 우파루파 눈
--axolotl-belly:   #f8d8e0    // 우파루파 배 (밝은 핑크)
--axolotl-spot:    #d898a8    // 우파루파 점 무늬

[UI/텍스트]
--text-primary:    #e8e0d8    // 주 텍스트 (따뜻한 화이트)
--text-secondary:  #a0b0c0    // 부 텍스트
--text-muted:      #607080    // 비활성 텍스트
--accent:          #6ab0d8    // 강조색 (밝은 하늘)
--accent-hover:    #8ad0f0    // 강조색 호버
--card-bg:         rgba(10, 22, 40, 0.75)  // 카드 배경 (반투명)
--card-border:     rgba(42, 90, 138, 0.4)  // 카드 테두리
--card-glow:       rgba(106, 176, 216, 0.3) // 하이라이트 시 글로우
```

### 1.2 타이포그래피

```
[폰트 스택]
--font-display:    "Galmuri11", "DungGeunMo", monospace   // 픽셀 한글 폰트 (제목)
--font-body:       "Galmuri9", "DungGeunMo", monospace    // 픽셀 한글 폰트 (본문)
--font-code:       "Galmuri7", monospace                   // 코드 블록

[폰트 크기 - 픽셀 배수 유지]
--text-xs:    12px   // 메타 정보, 날짜
--text-sm:    14px   // 본문 작은 글씨
--text-base:  16px   // 본문
--text-lg:    20px   // 소제목
--text-xl:    24px   // 제목
--text-2xl:   32px   // 페이지 제목
--text-3xl:   40px   // 히어로 제목

[행간]
--leading-tight:   1.4
--leading-normal:  1.75
--leading-relaxed: 2.0
```

> **폰트 폴백**: Galmuri 폰트를 웹폰트로 로드. 로드 실패 시 "DungGeunMo" → 시스템 모노스페이스 순서로 폴백.
> Galmuri 폰트: https://galmuri.quiple.dev/ (오픈소스, SIL OFL 1.1)

### 1.3 간격 시스템 (4px 그리드)

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
```

### 1.4 픽셀아트 렌더링 규칙

```css
/* 모든 픽셀아트 이미지에 적용 */
image-rendering: pixelated;
image-rendering: crisp-edges;

/* Canvas에도 적용 */
canvas {
  image-rendering: pixelated;
}
context.imageSmoothingEnabled = false;
```

### 1.5 그림자 & 효과

```
/* 카드 그림자 - 수면 위 떠있는 느낌 */
--shadow-float:   0 4px 0 rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2);

/* 하이라이트 글로우 - 우파루파 근처 카드 */
--glow-highlight: 0 0 12px var(--card-glow), 0 0 24px rgba(106,176,216,0.15);

/* 물결 반사 효과 (CSS) */
--reflect-opacity: 0.15;
```

### 1.6 애니메이션 타이밍

```
--ease-swim:     cubic-bezier(0.4, 0.0, 0.2, 1)   // 우파루파 이동
--ease-float:    cubic-bezier(0.37, 0, 0.63, 1)    // 카드 둥둥 떠있기
--ease-ripple:   cubic-bezier(0.25, 0.46, 0.45, 0.94) // 물결

--duration-swim:     600ms   // 우파루파 이동
--duration-float:    3000ms  // 카드 부유 주기
--duration-ripple:   1500ms  // 물결 퍼짐
--duration-glow:     400ms   // 하이라이트 전환
```

### 1.7 반응형 브레이크포인트

```
--bp-mobile:   480px    // 모바일
--bp-tablet:   768px    // 태블릿
--bp-desktop:  1024px   // 데스크탑
--bp-wide:     1280px   // 와이드
```

### 1.8 z-index 레이어 시스템

```
--z-lake-bg:      0     // 호수 Canvas 배경
--z-decorations:  10    // 수초, 수련 (Canvas 위 또는 내부)
--z-axolotl:      20    // 우파루파
--z-cards:        30    // 게시물 카드
--z-card-hover:   35    // 호버/하이라이트된 카드
--z-header:       100   // 헤더
--z-search:       200   // 검색 오버레이
--z-modal:        300   // 모달
```

---

## 2. 전체 아키텍처

### 2.1 레이어 구조

```
┌─────────────────────────────────────────┐
│  z:100  픽셀 헤더 (position: fixed)     │
├─────────────────────────────────────────┤
│  z:0    Canvas (position: fixed, 전체)  │
│         - 호수 수면 파동 렌더링          │
│         - 수초/수련 장식 렌더링          │
│         - 우파루파 렌더링 (z:20 내부)    │
│         - 물결 파티클 효과               │
├─────────────────────────────────────────┤
│  z:30   HTML 콘텐츠 (position: relative)│
│         - 게시물 카드 (CSS 배치)         │
│         - 스크롤 가능                    │
└─────────────────────────────────────────┘
```

Canvas는 `position: fixed`로 뷰포트 전체를 채우고, HTML 콘텐츠가 그 위에 `position: relative`로 스크롤된다. 우파루파는 Canvas 내부에서 렌더링되며, HTML 카드의 DOM 위치를 읽어서 근접 판정을 수행한다.

### 2.2 기술 스택

| 영역 | 기술 | 비고 |
|------|------|------|
| SSG | Hugo | 기존 유지 |
| 호수/우파루파 렌더링 | Canvas 2D API | requestAnimationFrame 루프 |
| UI 인터랙션 | TypeScript (vanilla) | React 제거 또는 검색만 유지 |
| 스타일 | CSS Variables + CSS | 기존 구조 유지 |
| 스프라이트 | PNG sprite sheet | 픽셀아트 에셋 |
| 빌드 | esbuild | 기존 유지 |

### 2.3 파일 구조 (신규/수정)

```
src/
├── assets/
│   ├── app.tsx              # [수정] 메인 엔트리, Canvas 초기화
│   ├── styles.css           # [전면 수정] 새 디자인 시스템
│   ├── lake/
│   │   ├── LakeRenderer.ts  # [신규] 호수 수면 렌더링 엔진
│   │   ├── Axolotl.ts       # [신규] 우파루파 스프라이트 & AI
│   │   ├── Decorations.ts   # [신규] 수초/수련/기포 장식
│   │   ├── Ripple.ts        # [신규] 물결 파티클 시스템
│   │   └── constants.ts     # [신규] 호수 관련 상수
│   └── sprites/
│       ├── axolotl.png      # [신규] 우파루파 스프라이트 시트
│       └── decorations.png  # [신규] 장식 스프라이트 시트
layouts/
├── _default/
│   ├── baseof.html          # [수정] Canvas 컨테이너 추가
│   ├── list.html            # [전면 수정] 카드 그리드 레이아웃
│   ├── single.html          # [전면 수정] 읽기 모드
│   ├── taxonomy.html        # [수정] 태그 페이지
│   └── terms.html           # [수정] 태그 목록
├── index.html               # [전면 수정] 홈 페이지
└── partials/
    ├── head.html             # [수정] 폰트, 메타태그
    ├── header.html           # [전면 수정] 픽셀 헤더
    └── footer.html           # [수정] 푸터
```

---

## 3. 상세 컴포넌트 명세

### 3.1 호수 렌더링 엔진 (LakeRenderer.ts)

**Canvas 설정:**
- `position: fixed; inset: 0; width: 100vw; height: 100vh`
- 렌더링 해상도: 뷰포트의 1/2 또는 1/3 (성능 최적화 후 업스케일)
- `imageSmoothingEnabled = false` (픽셀 유지)

**수면 렌더링 알고리즘:**
1. **배경 그라디언트**: 상단(`--lake-surface`) → 하단(`--lake-deep`) 세로 그라디언트
2. **파동 효과**: 여러 사인파를 합성하여 수면 라인 생성
   - 주파: 3~5개의 다른 주파수/진폭 사인파 합성
   - 각 스캔라인마다 약간의 y-offset으로 깊이감
3. **빛 반사**: 상단 수면 근처에 `--lake-shimmer` 색상의 반짝임 픽셀을 랜덤 배치
4. **프레임 레이트**: 30fps 타겟 (requestAnimationFrame + 프레임 스킵)

**물결(Ripple) 시스템:**
- 우파루파 이동 시 원형 물결 생성
- 각 물결: 중심점, 반지름(시간에 따라 확장), 투명도(시간에 따라 감소)
- 최대 동시 물결 수: 8개
- 카드 hover 시에도 작은 물결 발생

### 3.2 우파루파 (Axolotl.ts)

**스프라이트 시트 구성:**
```
┌─────┬─────┬─────┬─────┐
│idle1│idle2│idle3│idle4│  대기 (4프레임, 루프)
├─────┼─────┼─────┼─────┤
│swmR1│swmR2│swmR3│swmR4│  오른쪽 헤엄 (4프레임)
├─────┼─────┼─────┼─────┤
│swmL1│swmL2│swmL3│swmL4│  왼쪽 헤엄 (4프레임, 또는 flipX)
├─────┼─────┼─────┼─────┤
│swmU1│swmU2│swmU3│swmU4│  위로 헤엄 (4프레임)
├─────┼─────┼─────┼─────┤
│swmD1│swmD2│swmD3│swmD4│  아래로 헤엄 (4프레임)
├─────┼─────┼─────┼─────┤
│hap1 │hap2 │hap3 │hap4 │  행복/반응 (4프레임)
└─────┴─────┴─────┴─────┘

프레임 크기: 32x32px (렌더링 시 2~3x 스케일)
애니메이션 속도: 150ms/프레임 (대기), 100ms/프레임 (헤엄)
```

**이동 로직:**
1. 마우스/터치 위치를 목표 좌표로 설정
2. 현재 위치에서 목표까지 보간 이동 (lerp, factor 0.05~0.08)
3. 이동 방향에 따라 스프라이트 방향 결정
4. 이동 속도가 임계값 이하면 idle 애니메이션
5. 이동 중 일정 간격으로 Ripple 생성

**근접 게시물 하이라이트:**
1. 매 프레임 모든 카드 DOM 요소의 `getBoundingClientRect()` 캐시 (스크롤/리사이즈 시 갱신)
2. 우파루파 위치에서 각 카드 중심까지 거리 계산
3. 거리 < 150px인 카드에 `.highlighted` 클래스 추가
4. 거리 비례로 글로우 강도 CSS variable 설정 (`--glow-intensity`)
5. 가장 가까운 카드 1개에는 `.nearest` 클래스 추가 (더 강한 효과)

**모바일 동작:**
- `touchmove` 이벤트로 터치 위치 추적
- 터치가 없을 때는 자동 순회 (idle wander) 모드
  - 랜덤하게 화면 내 포인트를 선택하여 천천히 이동
  - 카드 근처를 지나가면 잠시 머무르기

### 3.3 장식 요소 (Decorations.ts)

**수련 (Water Lily):**
- Canvas 하단/가장자리에 2~4개 배치
- 가만히 떠있으며 수면 파동에 맞춰 미세하게 흔들림
- 스프라이트: 16x16px 수련잎 + 꽃

**수초 (Water Plants):**
- Canvas 하단 좌/우에 배치
- 느린 좌우 흔들림 애니메이션 (사인파)
- 스프라이트: 8x32px 수초

**기포 (Bubbles):**
- 우파루파 주변에서 간헐적으로 작은 기포 생성
- 위로 떠오르며 점차 사라짐
- 1~3px 크기의 원형 픽셀

### 3.4 픽셀 헤더 (header.html)

```
┌──────────────────────────────────────────────────┐
│  🐟 기록    [홈] [포스트] [프로젝트] [프로필] [태그]  │
└──────────────────────────────────────────────────┘
```

**스타일:**
- `position: fixed; top: 0; width: 100%`
- 배경: `var(--lake-deep)` + 하단 2px 픽셀 보더 (`var(--lake-highlight)`)
- 높이: 48px
- 폰트: `var(--font-display)` 사용
- 현재 페이지: 텍스트에 `var(--accent)` 색상 + 밑에 2px 픽셀 언더라인
- 호버: 텍스트 색상 전환 + 작은 물결 효과 (CSS)
- 모바일(< 768px): 햄버거 메뉴 또는 아이콘만 표시

**사이트 로고:**
- "기록" 텍스트 옆에 작은 픽셀 물고기/우파루파 아이콘 (16x16)
- 또는 사이트명 자체를 픽셀 폰트로 표시

### 3.5 게시물 카드 (list.html)

**레이아웃:**
- CSS Grid: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- 간격: `var(--space-6)` (24px)
- 전체 컨테이너: `max-width: 1200px; margin: 0 auto; padding-top: 80px`
- 카드 위치에 약간의 랜덤 오프셋으로 자연스러움 (CSS transform 또는 data 속성)

**카드 구성:**
```
┌──────────────────────────┐
│  ░░ [태그1] [태그2]  ░░  │  ← 상단: 태그 (픽셀 뱃지)
│                          │
│  게시물 제목              │  ← 제목: --font-display, --text-lg
│                          │
│  게시물 설명 텍스트가     │  ← 설명: --font-body, --text-sm
│  여기에 들어감...         │     max 2줄, ellipsis
│                          │
│  ░ 2024.03.15  · 5분 ░   │  ← 하단: 날짜, 읽기시간
└──────────────────────────┘
```

**카드 스타일:**
- 배경: `var(--card-bg)` (반투명 어두운 블루)
- 테두리: `2px solid var(--card-border)` (픽셀 느낌의 직각 테두리)
- `border-radius: 0` (픽셀 스타일, 둥근 모서리 없음)
- `box-shadow: var(--shadow-float)` (떠있는 느낌)
- 미세한 위아래 floating 애니메이션 (각 카드마다 다른 delay)
  ```css
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
  }
  animation: float var(--duration-float) var(--ease-float) infinite;
  ```

**하이라이트 상태 (.highlighted):**
- `border-color: var(--accent)`
- `box-shadow: var(--glow-highlight)`
- 살짝 확대: `transform: scale(1.02)`
- 전환: `transition: all var(--duration-glow) ease`

**호버 상태:**
- `border-color: var(--accent-hover)`
- 카드 위에 작은 물결 CSS 효과

### 3.6 개별 게시물 읽기 모드 (single.html)

**레이아웃:**
- 호수 Canvas 배경 유지
- 글 내용은 중앙 정렬 카드 (max-width: 720px)
- 카드 배경: `var(--card-bg)` 살짝 더 불투명하게 (0.85)
- 상단에 제목, 날짜, 태그 정보
- Prose 스타일링:
  - 코드 블록: 픽셀 폰트, 어두운 배경
  - 인용: 좌측 2px 픽셀 보더 + 약간 밝은 배경
  - 이미지: 테두리 + 그림자
  - 링크: `var(--accent)` 색상, 호버 시 밑줄

**우파루파 동작 (읽기 모드):**
- 화면 하단이나 측면에서 천천히 헤엄
- 스크롤에 따라 함께 이동하거나 독자적으로 유영
- 글 읽기를 방해하지 않는 수준

### 3.7 홈페이지 (index.html)

**구성:**
```
┌─────────────────────────────────────┐
│  [픽셀 헤더]                        │
├─────────────────────────────────────┤
│                                     │
│  ~~~~~ 호수 수면 ~~~~~              │
│                                     │
│     기 록                           │  ← 사이트 제목 (큰 픽셀 폰트)
│     학습한 내용을 기록합니다         │  ← 서브타이틀
│                                     │
│        픽셀우파루파~                 │
│                                     │
│  ── 최근 글 ──────────────          │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Post1 │ │Post2 │ │Post3 │        │
│  └──────┘ └──────┘ └──────┘        │
│  ┌──────┐ ┌──────┐ ┌──────┐        │
│  │Post4 │ │Post5 │ │Post6 │        │
│  └──────┘ └──────┘ └──────┘        │
│                                     │
│  ~~~~~ 수초 장식 ~~~~~              │
└─────────────────────────────────────┘
```

**히어로 영역:**
- 스크롤 최상단: 제목 + 서브타이틀만 표시
- 우파루파가 제목 주변을 유영
- 아래로 스크롤하면 게시물 카드 영역 진입

### 3.8 태그 페이지 (terms.html, taxonomy.html)

**태그 목록 (terms):**
- 태그를 수면 위에 떠있는 작은 픽셀 뱃지로 표시
- 각 뱃지 크기는 게시물 수에 비례
- 클릭하면 해당 태그 페이지로 이동

**태그별 게시물 (taxonomy):**
- 상단에 현재 태그 표시 (큰 픽셀 뱃지)
- 해당 태그의 게시물만 카드로 표시
- 다른 태그 필터 가능

### 3.9 검색 기능

- 기존 Finder 검색 유지 (React 컴포넌트)
- 스타일만 새 디자인 시스템에 맞게 변경:
  - 검색창: 픽셀 보더, `var(--card-bg)` 배경
  - 결과 리스트: 카드 스타일과 일관된 디자인
  - 단축키 `/` 유지

---

## 4. 인터랙션 상세

### 4.1 우파루파 ↔ 커서 따라가기

```
[매 프레임]
1. mousePos = { clientX, clientY }  (mousemove 이벤트)
2. targetPos = mousePos
3. axolotlPos = lerp(axolotlPos, targetPos, 0.06)
4. direction = getDirection(axolotlPos, targetPos)
5. speed = distance(axolotlPos, targetPos)
6. if speed < 2px → idle 애니메이션
   else → swim 애니메이션 (direction 기반)
7. 일정 간격으로 ripple 생성 (speed > 5px일 때)
```

### 4.2 카드 하이라이트 로직

```
[매 프레임 또는 throttle 100ms]
1. cards = document.querySelectorAll('.post-card')
2. for each card:
   a. rect = card.getBoundingClientRect()  (캐시됨)
   b. center = { x: rect.x + rect.width/2, y: rect.y + rect.height/2 }
   c. dist = distance(axolotlPos, center)
   d. if dist < HIGHLIGHT_RADIUS (150px):
      - card.classList.add('highlighted')
      - card.style.setProperty('--glow-intensity', 1 - dist/HIGHLIGHT_RADIUS)
   e. else:
      - card.classList.remove('highlighted')
3. nearest card gets '.nearest' class
```

### 4.3 모바일 터치

```
[터치 모드]
- touchstart: 우파루파 목표 설정
- touchmove: 우파루파가 터치 위치를 따라감
- touchend: idle wander 모드로 전환 (3초 후)

[idle wander]
- 랜덤 목표점 선택 (화면 내)
- 천천히 이동 (lerp factor 0.02)
- 목표 도달 시 2~4초 대기 후 새 목표
- 카드 근처 지나가면 하이라이트 효과 동일
```

### 4.4 스크롤 동작

- Canvas는 fixed → 스크롤 영향 없이 항상 전체 화면
- 우파루파는 뷰포트 기준 좌표로 동작 → 스크롤과 무관
- 카드 getBoundingClientRect()는 뷰포트 기준 → 스크롤 시 자동으로 위치 갱신
- 즉, 스크롤하면 카드가 지나가고 우파루파는 뷰포트에 머물면서 지나가는 카드에 반응

---

## 5. 성능 최적화

### 5.1 Canvas 최적화
- 렌더링 해상도를 뷰포트의 1/2로 축소 후 CSS로 업스케일 (픽셀아트라 어색하지 않음)
- `requestAnimationFrame` + 프레임 스킵 (30fps 타겟)
- 오프스크린 요소는 렌더링 생략
- 스프라이트 시트를 `Image` 객체로 한 번만 로드

### 5.2 DOM 최적화
- 카드 위치 캐싱: scroll/resize 이벤트에서만 갱신 (throttle 100ms)
- `will-change: transform` on cards
- `.highlighted` 토글은 실제 상태 변경 시에만

### 5.3 모바일 최적화
- 모바일에서 Canvas 해상도 1/3로 추가 축소
- 장식 요소 수 감소 (수련 1~2개, 수초 축소)
- `prefers-reduced-motion` 존중: 파동 정적 이미지, 우파루파 정지

### 5.4 번들 크기
- 스프라이트 시트: < 20KB (PNG, 최적화)
- 추가 JS: Canvas 렌더링 코드 ~15-20KB (minified)
- 웹폰트: Galmuri ~50-100KB (woff2)
- **외부 의존성 추가 없음** (Canvas 2D API만 사용)

---

## 6. 접근성

- `prefers-reduced-motion: reduce` 시:
  - 우파루파 정지 (idle 1프레임만)
  - 파동 효과 비활성
  - 카드 floating 애니메이션 비활성
  - 하이라이트는 유지 (시각적 피드백)
- Canvas에 `role="img"` + `aria-label="호수를 헤엄치는 우파루파"`
- 카드는 일반 HTML → 스크린 리더 호환
- 키보드 네비게이션: Tab으로 카드 간 이동, Enter로 열기
- 색상 대비: WCAG AA 이상 유지 (텍스트/배경)

---

## 7. 구현 순서 (권장)

### Phase 1: 기반
1. 디자인 시스템 CSS 변수 설정 (styles.css)
2. Galmuri 폰트 로드
3. baseof.html에 Canvas 컨테이너 추가
4. 기본 LakeRenderer 구현 (배경 그라디언트 + 단순 파동)

### Phase 2: 우파루파
5. 스프라이트 시트 제작/준비
6. Axolotl.ts: 스프라이트 렌더링 + 마우스 따라가기
7. Ripple.ts: 물결 효과

### Phase 3: UI
8. 픽셀 헤더 구현
9. 게시물 카드 스타일 구현
10. 카드 하이라이트 로직 연결
11. 홈페이지 레이아웃

### Phase 4: 페이지별
12. 리스트 페이지 (list.html)
13. 싱글 페이지 (single.html)
14. 태그 페이지 (terms.html, taxonomy.html)

### Phase 5: 장식 & 폴리싱
15. Decorations.ts (수련, 수초, 기포)
16. 모바일 최적화 + 터치 동작
17. 접근성 검수
18. 성능 프로파일링 & 최적화

---

## 8. 검증 방법

1. `npm run build` → 빌드 성공 확인
2. `hugo server` → 로컬 개발 서버에서 시각 확인
3. 마우스 이동 시 우파루파 반응 확인
4. 카드 근처에서 하이라이트 효과 확인
5. 모바일 시뮬레이터에서 터치 동작 확인
6. Lighthouse 성능 점수 확인 (Performance > 80 타겟)
7. `prefers-reduced-motion` 시뮬레이션으로 접근성 확인

---

## 9. 수정 대상 파일 요약

| 파일 | 작업 | 설명 |
|------|------|------|
| `src/assets/styles.css` | 전면 수정 | 새 디자인 시스템 적용 |
| `src/assets/app.tsx` | 전면 수정 | Canvas 초기화, 기존 터미널 코드 제거 |
| `src/assets/lake/LakeRenderer.ts` | 신규 | 호수 렌더링 엔진 |
| `src/assets/lake/Axolotl.ts` | 신규 | 우파루파 로직 |
| `src/assets/lake/Decorations.ts` | 신규 | 장식 요소 |
| `src/assets/lake/Ripple.ts` | 신규 | 물결 시스템 |
| `src/assets/lake/constants.ts` | 신규 | 상수 정의 |
| `src/assets/sprites/*.png` | 신규 | 스프라이트 에셋 |
| `layouts/_default/baseof.html` | 수정 | Canvas 엘리먼트 추가 |
| `layouts/_default/list.html` | 전면 수정 | 카드 그리드 |
| `layouts/_default/single.html` | 전면 수정 | 읽기 모드 |
| `layouts/_default/taxonomy.html` | 수정 | 태그 필터 |
| `layouts/_default/terms.html` | 수정 | 태그 목록 |
| `layouts/index.html` | 전면 수정 | 홈 페이지 |
| `layouts/partials/head.html` | 수정 | 폰트 로드, CSP |
| `layouts/partials/header.html` | 전면 수정 | 픽셀 헤더 |
| `layouts/partials/footer.html` | 수정 | 검색 스타일 변경 |
| `hugo.toml` | 수정 | subtitle 등 파라미터 |
