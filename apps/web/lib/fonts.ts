import localFont from 'next/font/local'

/**
 * 제목 · 강조 글꼴 — 학교안심 둥근미소 Bold. 데스크톱 앱 화면이 쓰는 글꼴이라, 랜딩의 제목과
 * 로고가 앱과 같은 얼굴로 보인다. 본문은 Pretendard 다(`app/pretendard.css`).
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
export const displayFont = localFont({
  src: './fonts/hakgyoansim-dunggeunmiso-bold.woff2',
  weight: '700',
  display: 'swap',
  preload: false,
  variable: '--font-display',
  fallback: ['Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
})
