import localFont from 'next/font/local'

/**
 * 학교안심 둥근미소 Bold — 데스크톱 앱 창 제목의 글꼴. 2026-10 부터 랜딩의 제목 글꼴이었고,
 * 2026-11 미니룸 랜딩부터는 아래 픽셀 서체(`pixelFont`)에 그 자리를 넘기고 되돌릴 때를 위해
 * 정의만 남겨 둔다. 본문은 Pretendard 다(`app/pretendard.css`).
 *
 * **제목에만 쓴다.** 한글이 다 든 한 벌이라 217KB 다. 본문까지 이것으로 칠하면 첫 화면이
 * 글꼴을 기다린다. (예전 제목 글꼴 Jua 도 한국어 페이지에서 250KB 안팎을 받았으니 무게는
 * 비슷하다. 다만 Jua 는 구글이 글자 구간별로 쪼개 줘서 영어 페이지가 13KB 였는데, 이 글꼴은
 * 한 벌이라 영어 페이지도 217KB 를 받는다.)
 *
 * `next/font/local` 이 빌드할 때 우리 도메인으로 내보낸다. CSP 에 `font-src 'self'` 가
 * 있어야 한다(`middleware.ts`) — `default-src 'none'` 아래에서 그 한 줄이 빠지면 글꼴이
 * **오류 없이** 막히고 제목만 조용히 운영체제 글꼴로 떨어진다. 미리 받지 않는 것은 무거워서다.
 *
 * 굵기는 Bold 한 벌뿐이다. CSS 가 `font-weight: 400` 을 달라고 해도 브라우저는 이 한 벌을
 * 그대로 쓰고 굵게 흉내 내지 않는다. SIL OFL 1.1 (같은 폴더의 LICENSE).
 */
/*
 * 2026-11 미니룸 랜딩에서는 제목 · 탭 · 단추를 아래 픽셀 서체로 칠하고, 이 글꼴은 정의만 남겨
 * 둔다. 픽셀 서체를 끝까지 쓸지는 화면에 올려 보며 정하기로 했고, 되돌릴 때는
 * `globals.css` 의 `--font-head` 한 줄만 `var(--font-display)` 로 바꾸면 된다. 쓰지 않는 동안은
 * 브라우저가 받지 않는다 — `@font-face` 는 그 글꼴로 칠한 글자가 있을 때만 내려받는다.
 */
export const displayFont = localFont({
  src: './fonts/hakgyoansim-dunggeunmiso-bold.woff2',
  weight: '700',
  display: 'swap',
  preload: false,
  variable: '--font-display',
  fallback: ['Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
})

/**
 * 미니룸 픽셀 서체 — 갈무리 11 Bold (SIL OFL 1.1, 같은 폴더의 `LICENSE-Galmuri.txt`).
 *
 * 2000년대 미니홈피의 비트맵 글씨를 오늘 화면에서 다시 읽히게 만든 서체라, 미니룸 틀과 같은
 * 시대의 얼굴이다. **제목 · 탭 · 단추 · 라벨에만 쓴다.** 긴 설명과 FAQ 는 Pretendard 로 둔다 —
 * 픽셀 글씨로 문단을 읽게 하면 눈이 금방 지친다.
 *
 * 한글 11,172자가 다 든 한 벌이 167KB 다(앞의 둥근미소 217KB 보다 가볍다). 그래서 쪼개지 않고
 * 첫 화면 제목이 바로 쓰도록 미리 받는다.
 *
 * **12px 의 배수(12 · 24 · 36 · 48)로만 쓴다.** 11px 격자로 그린 글씨라, 배수가 아닌 크기에서는
 * 픽셀이 반 칸씩 걸쳐 흐려진다. 크기는 `globals.css` 의 `--px-*` 눈금으로만 부른다.
 */
export const pixelFont = localFont({
  src: './fonts/galmuri11-bold.woff2',
  weight: '700',
  display: 'swap',
  preload: true,
  variable: '--font-pixel',
  fallback: ['Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
})
