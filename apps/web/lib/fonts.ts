import { Jua } from 'next/font/google'

/**
 * 제목 글꼴 하나 — Jua.
 *
 * **제목에만 쓴다.** 한글 글꼴이라 글자 수만큼 무거워서, 본문까지 이것으로 칠하면 첫
 * 화면이 글꼴을 기다린다. 본문은 운영체제 글꼴(Apple SD Gothic Neo · 맑은 고딕)이다.
 *
 * `next/font` 는 빌드할 때 구글에서 받아 **우리 도메인에서** 내보낸다. 그래서 CSP 에
 * 구글 주소를 열 일은 없고, 대신 `font-src 'self'` 가 있어야 한다(`middleware.ts`) —
 * `default-src 'none'` 아래에서 그 한 줄이 빠지면 글꼴이 **오류 없이** 막히고 제목만
 * 조용히 운영체제 글꼴로 떨어진다.
 *
 * 구글이 알려 주는 부분집합은 `latin` 하나뿐이지만 한글 조각도 함께 딸려 온다
 * (`unicode-range` 로 쪼개져 있어서 화면에 쓰인 글자의 조각만 받는다). `preload` 를
 * 끄는 이유는 그 latin 조각 하나만 미리 받아 봐야 한글 제목에는 쓸모가 없어서다.
 */
export const displayFont = Jua({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-display',
  fallback: ['Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
})
