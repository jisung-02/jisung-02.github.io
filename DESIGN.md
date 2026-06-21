# DESIGN.md — myblog 디자인 시스템

블로그 정체성: **학부생의 CS 학습 정리 노트**. 연구 노트/실험 노트의 여백 메모(marginalia) 감각을 미니멀하게.
이 문서가 모든 시각 결정의 단일 출처다. 컴포넌트는 여기 정의된 CSS 변수만 사용한다.

## 색 (light)
| 토큰 | 값 | 용도 |
|------|-----|------|
| `--paper`  | `#FCFCFA` | 배경(차분한 종이색, 크림 아님) |
| `--ink`    | `#1A1A1F` | 본문 텍스트 |
| `--muted`  | `#6B6B76` | 여백 메타(날짜·태그), 보조 텍스트 |
| `--rule`   | `#E6E6E1` | 얇은 구분선(절제 사용) |
| `--accent` | `#2F54EB` | 링크·강조(볼펜 잉크 블루) |
| `--marker` | `rgba(120,224,164,0.45)` | 형광펜 마커(시그니처) |

## 색 (dark, `[data-theme="dark"]`)
| 토큰 | 값 |
|------|-----|
| `--paper`  | `#16161A` |
| `--ink`    | `#ECECEF` |
| `--muted`  | `#9A9AA6` |
| `--rule`   | `#2A2A31` |
| `--accent` | `#6B8AFF` |
| `--marker` | `rgba(108,231,150,0.22)` |

## 타이포그래피
- 출처: Google Fonts 1곳(`@import` 1줄).
- **Display**(사이트 제목·글 제목): `"Gowun Batang", serif` — 국문 세리프, 절제해서 제목에만.
- **Body**(본문·UI): `"IBM Plex Sans KR", system-ui, sans-serif`.
- **Mono**(코드): `"JetBrains Mono", monospace`.
- 스케일(rem): h1 2.0 / h2 1.5 / h3 1.2 / body 1.0 / small 0.85.
- 본문 측정폭(measure): 최대 `68ch`. 행간 1.7.

## 레이아웃 & 시그니처
- **시그니처 = 좌측 여백 레일(marginalia)**: 글 페이지에서 ≥1024px일 때 본문 왼쪽 여백에 날짜·태그를 메모처럼 배치. <1024px에서는 본문 위로 접힘. 그리드: `[rail 14rem] [content 68ch]`, gap 2.5rem, 중앙 정렬.
- **하이라이터 마커**: 활성 태그와 링크 호버에 `--marker`로 밑줄형 배경(`background: linear-gradient(...) no-repeat bottom / 100% 0.4em`). 시그니처는 이 한 곳에만 쓴다(Chanel rule: 그 외 장식 제거).
- border-radius: 2px 이하(거의 각짐). 그림자 없음. 구분선은 헤어라인만.

## 모션
- 글 본문: 로드 시 8px 상승 + 페이드(150ms). 그 외 페이지 전환 애니메이션 없음.
- 태그/링크 호버: 마커 배경 120ms 확장.
- `prefers-reduced-motion: reduce`에서 모든 모션 제거.

## 접근성 바닥선
- 본문 대비 ≥ 7:1(`--ink`/`--paper` 충족). 모바일 1열 반응형.
- `:focus-visible` 아웃라인 `2px solid var(--accent)`.
- 다크/라이트 토글은 시스템 설정 기본값 + 수동 전환(localStorage 저장).
