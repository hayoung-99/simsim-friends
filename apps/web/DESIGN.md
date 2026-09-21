---
name: SimSim Friends Web
description: 베이지 방 — 꿀색 판 위에 앉은 동물 친구들, 노란 단추 하나.
colors:
  ground: "#f6eddc"
  surface: "#fff9ef"
  ink: "#4a3223"
  ink-soft: "#735843"
  line: "#e4d3b8"
  accent: "#ffc83d"
  accent-ink: "#3f2a1c"
  accent-text: "#8c5410"
  accent-soft: "#ffedb5"
  honey: "#f7d898"
  honey-deep: "#f0c77c"
  caramel: "#eec393"
  latte: "#ead6ba"
  peach: "#f5d3bb"
  ground-dark: "#231a13"
  surface-dark: "#30251c"
  ink-dark: "#f6ead6"
  ink-soft-dark: "#cdb89d"
  line-dark: "#4a3a2c"
  accent-text-dark: "#ffcf5e"
  honey-dark: "#4d3b1f"
typography:
  display:
    fontFamily: "Jua (next/font), 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: "clamp(2.5rem, 5.4vw, 4.2rem)"
    fontWeight: 400
    lineHeight: 1.18
  headline:
    fontFamily: "Jua"
    fontSize: "clamp(1.85rem, 3.6vw, 2.75rem)"
    fontWeight: 400
  title:
    fontFamily: "Jua"
    fontSize: "1.45rem"
    fontWeight: 400
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Pretendard', 'Segoe UI', 'Malgun Gothic', sans-serif"
    fontSize: "17px"
    lineHeight: 1.65
  small:
    fontSize: "0.9rem"
rounded:
  pill: "999px"
  panel: "28px"
  inner: "18px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  width: "min(1180px, 100% - 2 * gutter)"
  panel-padding: "28px"
components:
  button-primary: "노란 알약, 고동색 글자, 아래로 5px 두께"
  button-ghost: "투명, 2px 선"
  demo: "두 화면 — 누르면 친구 화면에서 춤춘다 (CSS 만)"
  signal-picker: "라디오 다섯 + 그림판 (CSS 만)"
---

# Design System: SimSim Friends Web

## Overview

랜딩(`/` · `/en/`)과 받기 화면(`/download/`)의 디자인. 2026-09 에 "창 한 장이 벽지 위에
떠 있는" 보라 회색 디자인에서 **베이지 방**으로 통째로 옮겼다. 어드민(`/admin`)은 옮기지
않았고 자기 스타일시트(`app/(admin)/admin.css`)로 옛 모양을 그대로 지킨다.

무드는 **포근하고 장난스러운 것**. 제품이 "답장할 필요 없는 가벼운 신호" 라서, 페이지도
설명하기보다 **해 보게 한다** — 히어로 오른쪽의 두 화면은 누르면 실제로 친구 화면의
강아지가 춤춘다. 기획서가 정한 톤("해 보라고 부르는 쪽")을 화면으로 옮긴 것이다.

코드는 `app/globals.css` 한 벌, 마크업은 `components/Landing.tsx` · `DownloadPage.tsx` ·
`SiteHeader.tsx` · `SiteFooter.tsx`. 색은 전부 `:root` 토큰이고 어두운 화면은
`prefers-color-scheme: dark` 에서 토큰만 바꾼다.

## Colors

### Primary

- **노랑 `accent` `#ffc83d`** — 강조색은 이것 하나. **단추의 바탕으로만** 쓴다. 글자는
  `accent-ink` `#3f2a1c` (8.7:1).
- **짙은 꿀색 `accent-text` `#8c5410`** — 글자로 강조할 때(제목의 "춤춰요", 링크, 고른 몸짓
  이름). 베이지 위의 노란 글자는 읽히지 않아서 따로 둔 값이다. 바탕 위 5.3:1.

### Neutral

| 토큰 | 값 | 쓰임 | 명도비 |
|---|---|---|---|
| `ground` | `#f6eddc` | 페이지 바탕 | — |
| `surface` | `#fff9ef` | 카드 · 질문 · 설치 안내 | — |
| `ink` | `#4a3223` | 본문 · 제목 | 바탕 위 10.2:1 |
| `ink-soft` | `#735843` | 딸린 설명 | 바탕 5.6 · 카드 6.3 · 꿀색 4.8 · 라테 4.6 · 복숭아 4.7 |
| `line` | `#e4d3b8` | 구분선 · 유령 단추 테두리 | — |

### 캐릭터가 서는 판

`honey` `#f7d898` · `honey-deep` `#f0c77c` · `caramel` `#eec393` · `latte` `#ead6ba` ·
`peach` `#f5d3bb`, 그리고 내 화면 벽지 `wall-a1→a2`, 친구 화면 벽지 `wall-b1→b2`.

### Named Rules

- **캐릭터를 맨 베이지 위에 세우지 않는다.** 흰 고양이의 밝은 면(화소 상위 10% 평균
  `rgb(248 239 226)`)과 판 사이의 ΔE2000 을 쟀다:

  | 뒤 | ΔE2000 | |
  |---|---|---|
  | `ground` (맨 바탕) | **1.6** | 같은 색으로 보인다 — 세우지 않는다 |
  | `surface` | 2.6 | 세우지 않는다 |
  | `latte` | 7.8 | 판다·토끼만 |
  | `wall-a1` · `honey` · `caramel` · `wall-a2` | 13.4 · 14.9 · 15.8 · 16.9 | 고양이도 된다 |

  예전 크림색 바탕에서 같은 고양이가 1.1 이었다. 윗줄 로고의 고양이가 꿀색 동그라미에
  앉아 있는 것도 이 규칙 때문이다.
- **`ink-soft` 는 캐러멜 위에 쓰지 않는다** (4.0:1). 마지막 받기 칸의 안내 문장이 그래서
  `ink` 다.
- **어두운 화면은 짙은 코코아.** 판은 전부 짙은 갈색으로 내려가고 노란 단추는 그대로다.
  어두우면 고양이와 판의 ΔE 가 49 로 벌어져 걱정할 것이 없다.

## Typography

- **제목 — Jua.** `next/font/google` 로 빌드 때 받아 우리 도메인에서 낸다(`lib/fonts.ts`).
  CSP 에 `font-src 'self'` 가 있어야 한다. 굵기는 400 하나뿐이라 강조는 굵기가 아니라
  **색**(`accent-text`)으로 한다.
- **본문 — 운영체제 글꼴.** Apple SD Gothic Neo · 맑은 고딕. Jua 는 한글 조각이라 무겁다 —
  한국어 페이지는 끝까지 내리면 조각 15개 · 259KB 를 받는다(영어는 1개 · 13KB).
  **본문까지 Jua 로 칠하지 않는다.**
- `word-break: keep-all` — 한국어가 낱말 가운데서 끊기지 않게.

### Hierarchy

| 쓰임 | 크기 |
|---|---|
| 히어로 제목 | `clamp(2.5rem, 5.4vw, 4.2rem)` |
| 섹션 제목 | `clamp(1.85rem, 3.6vw, 2.75rem)` |
| 칸 제목 · 몸짓 이름 | 1.45rem 안팎 |
| 큰 숫자 (5명 · 3개) | `clamp(4rem, 8vw, 6.5rem)` |
| 본문 | 17px |
| 딸린 설명 | 0.95rem |
| 꼬리표성 글자 (경고 한 줄 · 코드 설명) | 0.82~0.9rem |

## Layout

폭은 `min(1180px, 100% - 2 × gutter)`, 좌우 여백은 `clamp(16px, 4vw, 40px)`.

위에서 아래로: 윗줄 → 히어로(글 + 두 화면 데모) → 말 걸기엔 시시하고(가운데 정렬 한 번) →
몸짓 다섯(목록 + 그림판) → 다섯 친구(꿀색 판 위 한 줄) → 시작하기(세 칸, 가운데가 넓다) →
방 규칙(크기가 다른 네 칸) → 처음 열 때(두 카드) → 궁금한 것(접힌 질문) → 마지막 받기 칸.
같은 짜임이 두 번 나오지 않게 두었다.

### 화면 폭이 바꾸는 것

- **900px 아래** — 히어로가 한 줄로 쌓인다(글 먼저, 데모 아래).
- **860px 아래** — 몸짓 · 시작하기 · 마지막 칸이 한 줄로.
- **760px 아래** — 윗줄의 섹션 링크를 걷고 언어 · 받기만 남긴다. 다섯 친구는 옆으로 넘겨 본다.
- **520px 아래** — 방 규칙이 한 줄로.

### Named Rules

- **가로 스크롤은 없다.** `html { overflow-x: clip }` 에 더해, 데모 칸이 스스로 넘친 것을
  자른다(신호 점이 끝난 자리에 남기 때문).

## Elevation & Depth

그림자는 갈색으로 물들인다 — `0 18px 40px -18px rgba(110 72 36 / .38)`. 캐릭터 발밑은
`drop-shadow(0 10px 8px rgba(90 58 30 / .22))`. 검은 그림자는 쓰지 않는다.

그림자를 받는 것은 데모의 두 화면, 고른 몸짓 줄, 데모의 "눌러 보세요" 말풍선뿐이다. 나머지
판은 그림자 없이 **색 면**으로만 나뉜다.

## Shapes

| 무엇 | 모서리 |
|---|---|
| 누르는 것 (단추 · 몸짓 줄 · 이름표 · 질문의 더하기) | 알약 999px |
| 판 (화면 · 칸 · 카드 · 질문) | 28px |
| 판 안의 작은 판 (초대코드 표 · 받기 화면의 OS 묶음) | 18px |

## Components

### Buttons

노란 알약에 아래로 5px 두께(`box-shadow: 0 5px 0 -1px #d99a16`). 누르면 3px 꺼진다. 유령
단추는 투명 바탕에 2px 선. 단추 글자도 Jua 다.

히어로의 받기 단추는 `DownloadButtons` 가 방문자의 OS 에 맞춰 글자와 주소를 바꾼다
(`data-hero-download`). 윗줄과 마지막 칸의 "다운로드" 는 `/download` 로 간다.

### 데모 — 누르면 친구 화면에서 춤춘다 (시그니처)

스크립트 없이 숨긴 체크박스 하나로 돈다. 켜짐 · 꺼짐에 **이름만 다른 같은 애니메이션**
(`-a` · `-b`)을 걸어, 어느 쪽으로 바뀌든 처음부터 다시 돈다. 한 바퀴 2.4초:
고양이 움찔 → 노란 점이 포물선으로 건너감 → 강아지가 음표 사이에서 춤 + 발밑 이름표.
페이지가 열리면 1.2초 뒤 한 번 저절로 돈다. 움직임을 줄인 사람에게는 누르면 춤추는 그림과
이름표가 멈춘 채로 켜진다.

### 몸짓 고르기

라디오 다섯이 칸의 맨 앞 형제이고, `:checked ~` 로 목록의 줄과 그림판의 그림을 고른다.
그림판 바탕은 몸짓마다 다르다(꿀 · 캐러멜 · 라테 · 복숭아 · 짙은 꿀).

### 방 규칙 네 칸

크기가 다른 네 칸 — 5명(세로로 긴 꿀색, 다섯 친구가 모여 선다) · 3개 · 재우기(Z 가 떠오른다) ·
바탕화면을 가리지 않아요(가로로 긴 복숭아, 판다).

### 받기 화면

같은 윗줄(섹션 링크 없이 로고 · 언어)과 크림색 카드 한 장. OS 묶음은 바탕색 작은 판,
받기 화살표는 노란 동그라미.

## Do's and Don'ts

### Do

- 캐릭터는 꿀색 · 캐러멜 · 벽지 판 위에, 발밑 그림자와 함께.
- 손에 반응하는 것은 CSS(`:checked`, `:hover`, `<details>`)로.
- 움직임마다 `prefers-reduced-motion` 을 걸고, 줄였을 때는 **상태만** 보여 준다.
- 문장 강조는 `accent-text` 색으로.
- 캐릭터 그림은 촬영장에서 찍고 `--webp-only` 로 옮긴다(`CLAUDE.md` 랜딩 관례).

### Don't

- 노란 글자를 베이지 위에 쓰지 않는다.
- 캐릭터를 `ground` · `surface` 위에 바로 세우지 않는다.
- 랜딩 본문에 `'use client'` 를 들이지 않는다.
- 본문을 Jua 로 칠하지 않는다.
- Linux 받기를 앞세우지 않는다 — 기획서가 확인 전에는 약속하지 않기로 했다.
