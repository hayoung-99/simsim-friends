---
name: SimSim Friends Web
description: 미니룸 — 흰 점무늬 하늘 위 미니홈피 한 채, 내 방에서 누르면 친구 방에서 춤춘다.
colors:
  sky: "#d6ecf8"
  sky-dot: "#ffffff"
  frame: "#a8d6ef"
  frame-edge: "#6aa6cc"
  frame-dash: "#ffffff"
  page: "#ffffff"
  page-tint: "#f2f8fc"
  page-line: "#d3e4ef"
  dot-line: "#a9c6d8"
  ink: "#343849"
  ink-soft: "#5b6479"
  accent-text: "#a5532f"
  pastel-ink: "#343849"
  apricot: "#f3a77c"
  apricot-edge: "#d98558"
  sage: "#b3d5a5"
  rose: "#eeb0c3"
  butter: "#f4df96"
  sky-tab: "#9fcdea"
  wall-a: "#fbe6ec"
  wall-a-dot: "#f4cdda"
  wall-a-side: "#f6d6e0"
  floor-a: "#ddb184"
  floor-a-line: "#c99a6a"
  wall-b: "#e4f1d9"
  wall-b-line: "#cfe4bd"
  wall-b-side: "#d4e9c4"
  floor-b: "#f2e2bd"
  floor-b-check: "#e6cf9c"
  room-edge: "#b78a61"
  bubble: "#fffbe6"
  signal: "#ffd84d"
  sky-dark: "#151c29"
  frame-dark: "#2b4760"
  frame-edge-dark: "#4f7ea3"
  page-dark: "#1e2533"
  page-tint-dark: "#252e3f"
  page-line-dark: "#34415a"
  dot-line-dark: "#43546f"
  ink-dark: "#eaedf4"
  ink-soft-dark: "#aeb7ca"
  accent-text-dark: "#f2b08c"
  apricot-dark: "#e99a70"
  wall-a-dark: "#e9cfd8"
  floor-a-dark: "#b98d63"
  wall-b-dark: "#cddfc0"
typography:
  display:
    fontFamily: "Galmuri11 (next/font/local), 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0"
  headline:
    fontFamily: "Galmuri11"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0"
  headline-large:
    fontFamily: "Galmuri11"
    fontSize: "36px"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Galmuri11"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.5
  label:
    fontFamily: "Galmuri11"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1
  body:
    fontFamily: "Galmuri11, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.9
rounded:
  frame: "26px"
  panel: "16px"
  avatar: "12px"
  tab: "10px"
  inner: "10px"
  field: "8px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  tab-w: "40px"
  container: "min(1200px, 100% - 2 * gutter - tab-w)"
  profile-col: "340px"
  frame-padding: "18px"
  frame-gap: "16px"
  page-padding: "20px 26px 28px"
  px-s: "12px"
  px-m: "24px"
  px-l: "36px"
  px-xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.apricot}"
    textColor: "{colors.pastel-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.field}"
    padding: "14px 20px"
  button-small:
    backgroundColor: "{colors.apricot}"
    textColor: "{colors.pastel-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.field}"
    padding: "9px 14px"
  button-play:
    backgroundColor: "{colors.apricot}"
    textColor: "{colors.pastel-ink}"
    typography: "{typography.headline}"
    rounded: "{rounded.field}"
    padding: "12px 14px"
    width: "100%"
  page-panel:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "20px 26px 28px"
  tab-apricot:
    backgroundColor: "{colors.apricot}"
    textColor: "{colors.pastel-ink}"
    typography: "{typography.label}"
    padding: "14px 10px"
    width: "{spacing.tab-w}"
  tab-sage:
    backgroundColor: "{colors.sage}"
    textColor: "{colors.pastel-ink}"
  tab-rose:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.pastel-ink}"
  tab-butter:
    backgroundColor: "{colors.butter}"
    textColor: "{colors.pastel-ink}"
  tab-sky:
    backgroundColor: "{colors.sky-tab}"
    textColor: "{colors.pastel-ink}"
  room-tag:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  chip:
    backgroundColor: "{colors.pastel-ink}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "7px 12px"
  hint-bubble:
    backgroundColor: "{colors.bubble}"
    textColor: "{colors.pastel-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.inner}"
    padding: "7px 10px"
  ticket:
    backgroundColor: "{colors.page}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "12px 14px"
  guestbook-entry:
    backgroundColor: "{colors.page-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.inner}"
    padding: "12px 16px"
---

# Design System: SimSim Friends Web

## Overview

**Creative North Star: "두 사람의 미니룸"**

랜딩(`/` · `/en/`)과 받기 화면(`/download/`)의 디자인이다. 2026-11 에 "베이지 방"(꿀색 판 ·
Jua 제목 · 노란 단추)을 통째로 걷어 내고 **2000년대 미니홈피 한 채**로 옮겼다. 옛 문서와
섞지 않고 새로 쓴 것이므로, 베이지 · 꿀색 · Jua 에 관한 옛 규칙은 더 이상 기준이 아니다.
어드민(`/admin`)은 따라오지 않았고 자기 스타일시트(`app/(admin)/admin.css`)를 지킨다.

페이지 전체가 미니홈피다. 흰 점무늬 하늘 바탕 위에 하늘색 틀이 있고, 틀 안에 흰 쪽 패널이
놓인다 — 왼쪽은 프로필 칸, 오른쪽은 쪽들. 메뉴는 틀 오른쪽 끝에 붙은 세로 탭이다. 이 시대를
고른 이유는 제품의 성격과 같아서다. "답장할 필요 없는 가벼운 신호" 는 그 시절 일촌의 방에
들러 흔적만 남기던 감각과 같은 자리에 있다. 그래서 **그 시절의 문법(미니룸 · 방명록 · 기본
정보 표 · BGM 플레이어 · TODAY 카운터)만 빌리고, 남의 이름 · 로고 · 화폐는 쓰지 않는다.**

무드는 **귀엽게, 그러나 쨍하지 않게.** 시안을 고르면서 사용자가 "채도 높은 쨍한 색은 싫다"
고 못 박았다. 탭과 단추는 파스텔에 머물고 진한 색은 글자에만 쓴다. 그리고 페이지는 설명보다
먼저 **해 보게 한다** — 첫 화면의 미니룸에서 내 고양이를 누르면 친구 방의 강아지가 춤춘다.
이 한 번의 누름이 페이지에서 움직임이 시작되는 유일한 자리다.

코드는 `app/globals.css` 한 벌이다. 다섯 캐릭터 색 · 신호 노랑 · 모서리 눈금 · 움직임 곡선은
`packages/shared/src/design/tokens.css` 의 `--ss-*` 공통 층에서 오고, 랜딩은 그 위에 하늘 ·
틀 · 쪽 · 방의 표면 층을 얹는다. 마크업은 `components/Landing.tsx` · `MiniroomDemo.tsx` ·
`SiteHeader.tsx` · `SiteFooter.tsx` · `DownloadPage.tsx`.

**Key Characteristics:**
- 하늘색 점선 틀 + 흰 쪽 패널 + 오른쪽 세로 탭 — 페이지가 곧 홈피 한 채
- 파스텔은 면에만, 진한 색은 글자에만
- 제목 · 탭 · 단추 · 라벨은 갈무리 11 픽셀 서체, 12px 의 배수로만
- Blender 로 렌더한 3D 캐릭터가 같은 키 · 같은 바닥선으로 아이소메트릭 방에 선다
- 움직임은 방문자의 콕 한 번에서만 퍼진다

## Colors

하늘색 틀과 흰 쪽이 판을 깔고, 낮은 채도의 파스텔 다섯이 탭 · 단추에, 벽지와 바닥 파스텔이
방에 칠해진다. 글자 칸은 무채색으로 남긴다.

### Primary

- **살구 `apricot`** — 단추와 첫 탭의 바탕. 시안의 주황(#ff8a3d)을 한 단 낮춘 값이다.
  아래 두께는 그보다 짙은 **구운 살구 `apricot-edge`** 로 깐다. 살구 위 글자는 언제나
  `pastel-ink` 다 (6.4:1). 흰 글자는 2:1 남짓이라 쓰지 않는다.
- **벽돌 글자 `accent-text`** — 진한 색은 이 하나이고 **글자에만** 쓴다. 제목의 강조(`em`),
  TODAY · TOTAL 숫자, 방 규칙의 숫자, "어떻게 시작해요?" 링크, 경고 줄의 링크, FAQ 의 더하기
  막대. 흰 쪽 위 5.6:1.

### Secondary

- **세이지 `sage` · 장미 `rose` · 버터 `butter` · 하늘 탭 `sky-tab`** — 탭 넷과 작은 표지에
  나눠 쓴다. 세이지는 사실 목록의 네모 점, 버터는 고른 몸짓 줄 · 시작하기 번호 동그라미 ·
  글자 선택 색, 하늘 탭은 아바타 바탕 · 설치 단계 번호, 장미는 음표와 잠든 강아지의 방석.
  탭 다섯은 순서대로 살구 · 세이지 · 장미 · 버터 · 하늘이다.

### Tertiary — 방

- **분홍 벽지 `wall-a`**(점무늬 `wall-a-dot`, 옆벽 `wall-a-side`)와 **나무 바닥 `floor-a`**
  (결 `floor-a-line`) — 내 방. 몸짓 무대의 벽지도 이것이다.
- **초록 벽지 `wall-b`**(격자 `wall-b-line`, 옆벽 `wall-b-side`)와 **체크 바닥 `floor-b`**
  (칸 `floor-b-check`) — 친구 방. 다섯 친구 선반의 벽지와 라인업 얼굴 동그라미도 초록 벽지다.
- **방 모서리 `room-edge`** — 아이소메트릭 바닥 앞 테두리 3px.
- **신호 노랑 `signal`**(`--ss-signal`) — 방과 방 사이를 건너는 점 하나에만. 앱의 콕과 같은 색.
- **말풍선 `bubble`** — "내 고양이를 눌러 보세요" 말풍선.

### Neutral

- **하늘 `sky`** 바탕 위 **흰 점 `sky-dot`**(1.6px, 22px 간격) — 페이지 바탕.
- **틀 하늘 `frame`** · **흰 점선 `frame-dash`** · **짙은 하늘 외곽선 `frame-edge`** — 홈피 틀.
  `frame-edge` 는 초점 테두리와 스크롤바 색도 겸한다.
- **쪽 `page`** · **옅은 쪽 `page-tint`** · **쪽 테두리 `page-line`** — 흰 쪽 패널과 그 안의
  옅은 칸(플레이어 · 질문 줄 · 받기 묶음).
- **점선 `dot-line`** — 쪽 안의 모든 구분선(1px dotted)과 초대코드 표의 점선 테두리.
- **글자 `ink`** (흰 쪽 위 12.1:1) · **딸린 글자 `ink-soft`** (6.0:1).
- **파스텔 위 글자 `pastel-ink`** — 값은 `ink` 와 같은 #343849 지만 **다크 모드에서 뒤집히지
  않는 고정값**이다. 탭 · 단추 · 이름표 · 말풍선 · 선반 이름처럼 파스텔 위에 앉는 글자는
  모두 이것을 쓴다. 파스텔은 밤에도 밝게 남으므로 글자도 짙은 채로 남아야 한다.

### 밤의 미니홈피 (다크 모드)

`prefers-color-scheme: dark` 에서 토큰만 바꾼다. 하늘 · 틀 · 쪽은 남색으로 가라앉고
(`sky-dark` · `frame-dark` · `page-dark` …), 글자는 밝게 뒤집힌다(`ink-dark` ·
`accent-text-dark`). **방의 벽지 · 바닥과 탭 파스텔은 한 단만 낮춘다** — 방까지 어두우면
캐릭터가 묻히고, 탭이 어두우면 홈피의 장난기가 사라진다.

### Named Rules

**The 한 단 낮춘 색 Rule.** 면에 칠하는 색은 전부 파스텔이다. 채도 높은 쨍한 색은 바탕에도
단추에도 쓰지 않는다. 진한 색은 `accent-text` 하나이고 글자로만 나온다.

**The 무채색 글 칸 Rule.** 글을 읽는 칸(쪽 패널 · 프로필)은 흰 바탕 무채색이다. 색은 틀 ·
탭 · 방에만 칠한다. 여러 색이 문단 사이를 오가면 귀여움보다 어지러움이 먼저 온다.

**The 파스텔 위 글자 Rule.** 파스텔 위 글자는 언제나 `pastel-ink`(#343849)이다. 흰 글자도,
`ink` 토큰도(다크에서 밝아진다) 쓰지 않는다. 예외는 짙은 이름표(`chip`) 위의 흰 글자 하나.

**The 흰 바닥 금지 Rule.** 캐릭터를 흰 쪽 위에 바로 세우지 않는다. 흰 고양이의 밝은 면과
각 바탕 사이의 ΔE2000 을 쟀다.

| 바탕 | ΔE2000 | |
|---|---|---|
| `page` (흰 쪽) | **0** | 같은 색이다 — 세우지 않는다 |
| `wall-a` (분홍 벽지) | 10.4 | 선다 |
| `wall-b` (초록 벽지) | 12.5 | 선다 |
| `floor-b` (체크 바닥) | 15.0 | 선다 |
| `sky-tab` (아바타 하늘) | 19.5 | 선다 |
| `floor-a` (나무 바닥) | 24.6 | 선다 — 내 방의 고양이가 여기 선다 |

그래서 미니룸 아래 라인업의 얼굴들은 초록 벽지 동그라미 안에 앉고, 프로필 아바타는 하늘 탭
색 칸에, 선반 · 무대 · 마지막 칸의 캐릭터는 벽지와 바닥 위에 선다. 새 자리에 캐릭터를 놓을
때도 이 표의 판 위에 둔다.

## Typography

**Display Font:** 갈무리 11 Bold (Galmuri11, SIL OFL 1.1, `next/font/local` 로 자체 배포)
**Body Font:** 같은 갈무리 11 Bold — 랜딩의 글자는 이 한 벌뿐이다. 못 받으면 운영체제 글꼴

**Character:** 미니홈피 시절의 비트맵 글씨를 오늘 화면에서 다시 읽히게 만든 픽셀 서체가 제목부터
본문 · FAQ 까지 전부 맡는다. 시안을 세 벌(제목만 픽셀 + 본문 Pretendard · 제목 Pretendard + 본문
픽셀 · 전부 픽셀) 같은 화면에 나란히 놓고, 미니홈피 느낌이 가장 진한 "전부 픽셀" 로 정했다
(2026-11). 그 대가로 본문이 12px 로 작고 진하다 — 긴 글을 더할 때는 짧게 끊어 쓴다. 서체가 한
벌이라 본문 서체를 따로 받지 않아 페이지는 오히려 가벼워졌다(`app/pretendard.css` 는 더 부르지 않는다).

갈무리는 한글 11,172자가 다 든 한 벌이 167KB 라 쪼개지 않고 미리 받는다(`preload: true`).
CSP 의 `font-src 'self'` 가 빠지면 오류 없이 운영체제 글꼴로 떨어진다.

### Hierarchy

- **Display** (700, 48px `--px-xl`, 1.1): 프로필 칸 제목의 둘째 줄("톡 하면 톡") 하나.
- **Headline Large** (700, 36px `--px-l`, 1.25): 마지막 받기 칸 제목 · 받기 화면 제목.
- **Headline** (700, 24px `--px-m`, 1.25): 쪽 제목(`h2`) · 프로필 제목 첫 줄 · 몸짓 이름 ·
  설치 안내 칸 제목 · 받기 플레이어 단추 · 초대코드 · 시작하기 번호.
- **Title** (700, 12px `--px-s`, 1.5): 칸 안의 작은 제목(`h3`) · 기본 정보 표의 이름 칸.
- **Label** (700, 12px `--px-s`, 1): 탭 · 단추 · 로고 · 카운터 · 방 이름표 · 말풍선 · 이름표 ·
  선반 이름 · 흔적 스티커.
- **Body** (700, 12px `--px-s`, 1.9): 본문 · 설명 · 사실 목록 · 단계 설명 · FAQ 질문과 답(최대 68ch) ·
  경고 줄 · 꼬리말 · 초대코드 설명. 크기로 위계를 나누지 않고 색(`ink` · `ink-soft`)으로 나눈다.

`word-break: keep-all` — 한국어가 낱말 가운데서 끊기지 않게.

### Named Rules

**The 12의 배수 Rule.** 픽셀 서체는 `--px-s/m/l/xl`(12 · 24 · 36 · 48px)로만 부른다. 11px
격자로 그린 글씨라 배수가 아닌 크기에서는 픽셀이 반 칸씩 걸쳐 흐려진다. 새 크기가 필요하면
눈금을 고르지, 13px 이나 1.5rem 을 쓰지 않는다.

**The 본문도 12px Rule.** 본문은 15 · 16px 가 아니라 12px 다. 픽셀 서체의 12의 배수 규칙이
본문에도 그대로 걸리기 때문이다. 24px 로 키우면 한 줄에 들어가는 글이 너무 줄어든다. 읽기 부담은
글을 짧게 끊는 것으로 덜어 낸다.

**The 두 이름으로 부른다 Rule.** 제목 · 라벨은 `--font-head`, 본문은 `--body` 로 부르고
`--font-pixel` 을 직접 부르지 않는다. 지금은 둘 다 갈무리지만, 다시 갈라야 할 날에는 이 두 줄만
고치면 된다(제목을 앱의 둥근미소로 — `var(--font-display)`, 정의만 남겨 둠).

## Layout

틀 폭은 `min(1200px, 100% - 2 × gutter - tab-w)`, 좌우 여백은 `clamp(16px, 4vw, 40px)`.
랜딩은 탭이 틀 오른쪽 밖으로 붙으므로 윗줄 · 틀 · 꼬리말을 탭 폭의 절반(20px)만큼 왼쪽으로
비켜 세워야 가운데로 보인다. 탭이 없는 받기 화면은 비켜 서지 않는다.

틀은 두 칸 그리드다 — 프로필 칸 340px 과 쪽들(`minmax(0, 1fr)`), 틈 16px, 틀 안쪽 여백 18px.
쪽들은 16px 간격으로 세로로 쌓인다: 미니룸(+ 다섯 친구 라인업) → 말 걸기엔 시시하고 →
몸짓 다섯(목록 · 무대 두 단) → 다섯 친구(선반) → 시작하기(세 단, 가운데가 넓다) → 방 규칙
(기본 정보 표) → 처음 열 때(두 단) → 궁금한 것(방명록) → 마지막 받기 칸.

쪽 안의 구획은 **점선으로만** 나눈다. 쪽 제목 아래 1px 점선, 단과 단 사이 세로 점선,
표의 줄 사이 점선. 쪽 안에 판을 또 겹치지 않는다.

### 프로필 칸은 따라온다

폭 881px 이상이고 높이 780px 이상이면 프로필 칸이 `sticky`(위 16px)다 — 어느 쪽을 읽든
받기 단추가 보이게. 화면이 낮으면 칸이 다 들어가지 않아 아래가 잘리므로 붙이지 않는다.
`html` 은 `overflow-x: clip` 이다(`hidden` 이면 스크롤 컨테이너가 생겨 sticky 가 갇힌다).

### 화면 폭이 바꾸는 것

- **880px 아래** — 틀이 한 단으로 쌓이고(안쪽 여백 12px, 모서리 20px) 탭은 틀 맨 위의
  가로 줄이 된다. 한 줄로 두고 넘치면 옆으로 민다. **다운로드 탭은 걷는다** — 윗줄 받기
  단추와 같은 일이다. 몸짓 · 시작하기 · 설치 · 마지막 칸 · 방 규칙도 한 단으로. **두 방은
  끝까지 나란히 둔다** — "내 방에서 누르면 친구 방에서" 가 데모의 전부라서다.
- **760px 아래(또는 `pointer: coarse`)** — 윗줄과 꼬리말 링크의 누르는 높이를 44px 로.
- **640px 아래** — 카운터의 설명을 걷고, 라인업은 이름 없이 얼굴만, 말풍선은 방 아래로.
- **480px 아래** — 다섯 친구 선반이 옆으로 넘기는 줄이 된다(한 칸 40%, 넷째가 빼꼼 보인다).
  3 + 2 로 쌓으면 선반이 끊기고 두 마리만 커져 같은 키가 깨진다.

## Elevation & Depth

깊이는 세 겹이다. 하늘 바탕 → 틀(점선 + 외곽선으로 떠 있는 판) → 흰 쪽(옅은 테두리와 푸른
그림자). 그 위에서 캐릭터만 갈색 그림자를 받는다. 검은 그림자는 쓰지 않는다.

### Shadow Vocabulary

- **쪽 그림자** (`box-shadow: inset 0 0 0 1px var(--page-line), 0 14px 30px -18px rgba(40, 70, 100, 0.45)`):
  프로필 칸 · 쪽 · 받기 화면의 판. 다크에서는 `rgba(0, 0, 0, 0.7)`.
- **캐릭터 그림자** (`filter: drop-shadow(0 8px 6px rgba(60, 45, 30, 0.22))`): 모든 캐릭터
  그림. 투명 PNG 의 윤곽을 따라 떨어져야 하므로 `box-shadow` 가 아니라 `drop-shadow` 다.
- **단추 두께** (`box-shadow: 0 3px 0 var(--apricot-edge)`): 살구 단추와 받기 화살표 단추.
  누르면 `translateY(3px)` 로 꺼지며 두께가 0 이 된다 — 그 시절 홈피 단추의 눌림 문법이다.
- **탭 접힘** (`box-shadow: inset -2px 0 0 rgba(52, 56, 73, 0.12)`): 세로 탭의 오른쪽 끝을
  살짝 접혀 보이게.
- **옅은 칸 테두리** (`box-shadow: inset 0 0 0 1px var(--page-line)`): 쪽 안의 옅은 칸
  (플레이어 · 질문 · 흔적 스티커 · 받기 묶음 · 무대 · 선반). 그림자 없이 선만.

### Named Rules

**The 갈색 발밑 Rule.** 캐릭터는 언제나 갈색 drop-shadow 를 달고 선다. 그림자 없는 캐릭터는
판 위에 붙여 놓은 스티커처럼 뜬다.

**The 살구 두께만 Rule.** 단단한 아래 두께는 살구 단추의 눌림 문법이다. 다른 판이나 카드에
단단한 오프셋 그림자를 주지 않는다.

## Shapes

| 무엇 | 모서리 |
|---|---|
| 홈피 틀 | 26px (880px 아래 20px), 3px 흰 점선 + 3px 외곽선(5px 띄움) |
| 쪽 패널 (`--ss-radius-panel`) | 16px |
| 아바타 | 12px, 안쪽 2px 흰 테 + 바깥 1.5px 점선색 테 |
| 쪽 안의 칸 · 무대 · 선반 · 질문 · 말풍선 (`--ss-radius-inner`) | 10px |
| 세로 탭 | 오른쪽만 10px (`0 10px 10px 0`), 가로 줄일 때 네 귀 10px |
| 단추 · 초대코드 표 (`--ss-radius-field`) | 8px |
| 방 이름표 · 이름표 · 받기 화살표 (`--ss-radius-pill`) | 999px |
| 번호 · 신호 점 · 라인업 얼굴 | 원 |

방은 아이소메트릭 SVG(viewBox 430) — 벽 둘과 바닥 하나, 바닥 앞 모서리에 3px 테두리.
흔적 스티커는 홀짝으로 −2° · 1.5° 기울여 붙인다.

## Components

### Buttons

**살구색에 아래로 3px — 누르면 꺼지는 홈피 단추.**

- **Shape:** 8px 모서리.
- **Primary:** `apricot` 바탕, `pastel-ink` 글자, 픽셀 서체 12px, 14px 20px. 윗줄의 작은
  단추는 9px 14px, 마지막 칸의 단추는 24px 글자.
- **Hover / Active:** hover 는 `brightness(1.04)` 만. active 는 3px 내려앉고 두께가 사라진다
  (120ms, `--ss-ease-out`).
- **BGM 플레이어 받기 단추:** 프로필 칸 아래 "배경음악 플레이어" 칸(`page-tint` 판) 안의 꽉 찬
  단추. 24px 픽셀 글자 왼쪽에 흰 동그라미 재생 표시(그린 삼각형). 글자와 주소는
  `DownloadButtons` 가 방문자의 OS 에 맞춰 바꾼다(`data-hero-download-label`). 경고 한 줄을
  단추 **바로 아래** 둔다 — 누르는 순간 떠나는 사람에게 아래쪽 안내는 없는 것과 같다.
- **받기 화살표 단추:** 받기 화면의 줄마다 38px 살구 동그라미, 같은 3px 두께.

### Chips

- **방 이름표:** 흰 바탕 · 1.5px 글자색 테 · 알약. "내 방 · 친구 방".
- **이름표(`chip`):** `pastel-ink` 짙은 바탕 · 흰 글자 · 알약. 데모의 "방금 내가 콕!" 과 몸짓
  무대의 동작 이름. **지어낸 이름을 쓰지 않는다** — 누른 것은 방문자 자신이다.
- **흔적 스티커:** `page-tint` 칸에 `accent-text` 2px 취소선. 메신저의 흔적(읽음 1 · 답장 언제
  해?)을 지우는 장면.

### Cards / Containers

- **쪽 패널:** 흰 바탕, 16px 모서리, 쪽 그림자, 20px 26px 28px(640px 아래 18px 16px 22px).
  제목 아래 1px 점선.
- **안쪽 판은 두지 않는다.** 단은 점선 세로줄로만 나눈다. 쪽 안의 상자는 실물을 흉내 내는
  것들뿐이다 — 초대코드 표(흰 바탕 · 1.5px 점선 테 · 8px), BGM 플레이어, 받기 화면의 OS 묶음.

### Inputs / Fields

랜딩에는 글을 쓰는 칸이 없다. **몸짓 고르기**가 유일한 입력이다 — 숨긴 라디오 다섯이 그
쪽의 맨 앞 형제이고, `:checked ~` 로 목록의 줄(`butter` 바탕)과 무대의 그림을 고른다. 키보드
초점은 그 줄에 3px `frame-edge` 테두리로 보인다. 순서를 바꾸면 조용히 안 먹는다.

### Navigation

- **세로 탭:** 틀 오른쪽 밖 8px 에 40px 폭으로 붙고 스크롤을 따라온다(위 96px). 픽셀 12px,
  세로쓰기, 자간 0.12em, 오른쪽만 둥근 10px. 미니룸(살구) · 신호(세이지) · 친구들(장미) ·
  시작하기(버터) · 다운로드(하늘). 탭은 페이지의 실제 쪽으로 건너뛰므로 **쪽 이름과 같아야
  한다.** hover 에 3px 밀려 나온다.
- **880px 아래:** 틀 맨 위 가로 줄, 넘치면 옆으로 스크롤, 다운로드 탭 숨김.
- **윗줄:** 틀 위 한 줄 — 빼꼼 로고 · TODAY · TOTAL 카운터 · 언어 · 작은 받기 단추.
- **초점:** 누를 수 있는 모든 것에 3px `frame-edge` 테두리(2px 띄움, 6px 모서리).

### 미니룸 데모 (시그니처)

**내 방의 고양이를 누르면 친구 방의 강아지가 춤춘다.** 두 아이소메트릭 방이 나란히 있고,
그 위로 노란 점이 지나갈 점선 포물선이 누르기 전부터 옅게 그려져 있다. 고양이 발밑에는
점선 고리가 "여기를 누른다" 를 표시한다(hover 에 실선).

- **누를 때만 움직인다.** 저절로 돌지 않는다. 이 제품의 움직임은 언제나 누군가의 콕에서
  시작하므로 데모도 방문자의 콕 하나에서만 퍼진다.
- **순서는 CSS 지연 시간이 정한다.** 스크립트는 클래스(`is-playing`)를 갈아 끼우고 카운터를
  올릴 뿐이다.
  - 0s — 고양이 콕 스프라이트(6×6, 1.2s)
  - 0.35s — 노란 점이 포물선을 건넌다(0.7s)
  - 1.05s — 강아지 춤 스프라이트(5×5, 두 바퀴 1.67s), 음표 둘이 오르고 이름표가 뜬다
  - 3.25s 즈음 — 이름표가 사라진다
  - TODAY · TOTAL 이 1 오른다
- **합은 `MiniroomDemo.tsx` 의 `SCENE_MS`(3400ms)와 같아야 한다.** 한쪽을 고치면 다른 쪽도
  고친다. 짧으면 장면이 중간에 잘리고, 길면 다음 콕이 그만큼 늦게 받는다.
- **움직이는 WebP 가 아니라 스프라이트 시트다.** 브라우저는 같은 그림의 애니메이션을 한
  시계로 돌려서, 두 번째 콕에 강아지가 춤 중간부터 시작한다. 시트는 가로 칸을 빠르게, 세로
  줄을 느리게 넘기는 두 애니메이션을 겹쳐 프레임을 고른다.
- **움직임을 줄인 사람에게는 끝 장면만** — 춤추는 한 프레임과 이름표가 멈춘 채로 켜진다.
- **숫자는 지어내지 않는다.** TODAY 는 이번 방문에서 누른 횟수, TOTAL 은 이 브라우저의
  `localStorage` 에만 남는 횟수다. 서버로 보내지 않고, 카운터 옆에 "이 브라우저에서 누른
  횟수" 라고 적어 둔다.
- 음표는 글자(♪)가 아니라 그린 SVG 다.

### 기본 정보 표 (방 규칙)

홈피의 "기본 정보" 처럼 점선 줄 네 개(`dl`). 왼쪽 13em 은 픽셀 이름(숫자는 24px
`accent-text`), 오른쪽은 설명. 숫자를 크게 띄운 카드로 두면 흔한 지표 자랑처럼 읽혀서
숫자는 줄 안의 한 낱말로만 둔다. 재우기 줄에는 방석 위에 엎드려 자는 강아지와 그린 z 셋.

### 방명록 (FAQ)

`<details>` 한 줄씩 — `page-tint` 질문 줄, 흰 답. 더하기 · 빼기는 글자가 아니라 막대 두 개를
그려 만든다(`accent-text`, 14 × 2.5px). 받기 화면의 "옛 버전" 접기도 같은 막대다.

### 다섯 친구 선반

벽지 위에 서고 나무 바닥을 딛는 한 줄. 그림의 발이 폭의 90% 높이에 있으므로 벽지 칸을
가로세로 1 : 0.9 로 깔면 그 아래부터가 바닥이 되어 다섯이 같은 줄에 선다. 이름은 픽셀,
성격 한 줄도 같은 서체 12px.

### 그림

캐릭터 그림은 전부 Blender 원본(`<동물>_2.blend`, 저장소 밖)에서
`scripts/render-landing-mascots.py` 로 렌더한다 — 정사각형, 키의 1.7배 화면, 발은 아래에서
10% 자리, 투명 바탕. **다섯이 같은 키 · 같은 바닥선**이라 CSS 는 폭만 정하면 되고, 바닥은
폭의 90% 지점이다. 틀을 바꾸면 `globals.css` 의 캐릭터 자리 계산도 함께 고친다.

- **방 안의 캐릭터 자리:** 폭 62%, 위 14%. 방 그림의 바닥 한가운데가 위에서 69.8% 이므로
  69.8 − 0.9 × 62 ≈ 14.
- 시점은 정면(`front`, 선반 · 아바타), 아이소(`iso`, 미니룸), 그 밖에 요 · 피치를 직접 준다
  (잠든 강아지). 춤 · 콕은 `seq` 로 프레임마다 뽑아 360px 칸의 시트로 묶는다.
- 다시 뜨는 법: `blender -b <동물>_2.blend --python scripts/render-landing-mascots.py -- <출력 폴더> <작업들> [한 변 px]`
  (작업 문법은 스크립트 맨 위 주석). 모든 그림은 `*.webp.json` 에 출처를 남긴다.

### 받기 화면 (`/download`)

같은 윗줄(카운터 없이)과 같은 홈피 틀 안에 흰 쪽 한 장(`pane`). 탭이 없으므로 틀이 비켜
서지 않는다. 최신 버전 표지는 살구 알약, OS 묶음은 `page-tint` 판, 줄 사이는 점선, 받기는
살구 화살표 동그라미.

## Do's and Don'ts

### Do:
- **Do** 면에는 파스텔(살구 · 세이지 · 장미 · 버터 · 하늘)을, 진한 색은 `accent-text` 로 글자에만 쓴다.
- **Do** 파스텔 위 글자는 `pastel-ink`(#343849)로 쓴다 — 다크 모드에서도.
- **Do** 픽셀 서체는 `--font-head` 로 부르고 크기는 `--px-s/m/l/xl` 눈금에서만 고른다.
- **Do** 쪽 안의 구획은 1px `dot-line` 점선으로 나눈다.
- **Do** 캐릭터는 벽지 · 바닥 · 하늘 탭 칸 위에, 갈색 drop-shadow 와 함께 세운다.
- **Do** 새 캐릭터 그림은 `render-landing-mascots.py` 의 같은 틀로 뜨고 폭으로만 크기를 정한다.
- **Do** 움직임마다 `prefers-reduced-motion` 을 걸고, 줄였을 때는 끝 상태만 보여 준다.
- **Do** +/− · 재생 · 음표 · z 같은 표지는 막대나 SVG 로 그린다.
- **Do** 데모 지연 시간을 바꾸면 `SCENE_MS` 도 함께 바꾼다.

### Don't:
- **Don't** 채도 높은 쨍한 색(시안의 #ff8a3d 같은)을 면에 쓰지 않는다.
- **Don't** 글 칸(쪽 · 프로필)에 색 바탕을 깔지 않는다 — 흰 바탕 무채색이다.
- **Don't** 캐릭터를 흰 쪽 위에 바로 세우지 않는다 (ΔE2000 0).
- **Don't** 어떤 글자도 12px 의 배수가 아닌 크기(13 · 15 · 16px 같은)로 쓰지 않는다 — 본문도 12px 다.
- **Don't** 쪽 안에 카드를 겹치지 않는다. 상자는 초대코드 표처럼 실물을 흉내 내는 것만.
- **Don't** 숫자를 크게 띄운 지표 카드를 만들지 않는다 — 숫자는 기본 정보 표의 한 낱말이다.
- **Don't** 제목 위에 작은 머리말(kicker · eyebrow)을 달지 않는다.
- **Don't** 데모를 저절로 틀지 않는다. 움직임은 방문자의 콕에서만 시작한다.
- **Don't** 지어낸 숫자 · 지어낸 사람 이름을 쓰지 않는다. TOTAL 은 이 브라우저의 기록뿐이다.
- **Don't** 그 시절 서비스의 이름 · 로고 · 화폐를 쓰지 않는다. 문법만 빌린다.
- **Don't** 글리프(▶ ♪ + −)를 아이콘으로 쓰지 않는다 — 서체마다 굵기와 자리가 다르다.
- **Don't** 살구 단추 밖에서 단단한 오프셋 그림자를 쓰지 않는다.
- **Don't** 랜딩 본문에 `'use client'` 를 들이지 않는다 — 스크립트는 받기 단추와 미니룸 데모 둘뿐이다.
