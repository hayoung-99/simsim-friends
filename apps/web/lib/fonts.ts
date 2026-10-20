import { Jua } from 'next/font/google'
import localFont from 'next/font/local'

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

/**
 * 로고 글자 — 학교안심 둥근미소 Bold. 데스크톱 앱 화면이 쓰는 글꼴이라, 랜딩 윗줄의
 * 이름도 앱과 같은 얼굴로 보이게 한다.
 *
 * **"SimSim Friends" 에 쓰이는 글자만 잘라 넣었다** (1.2KB). 원본은 한글까지 들어 217KB 라
 * 이름 한 줄 때문에 받기에는 무겁다. 그래서 로고가 아닌 곳에 이 글꼴을 쓰면 글자가 빠진다 —
 * 다른 글자가 필요하면 원본(`apps/desktop/src/renderer/assets/fonts/`)에서 다시 자른다.
 *
 *   pyftsubset hakgyoansim-dunggeunmiso-bold.woff2 --text="SimSim Friends" \
 *     --flavor=woff2 --output-file=hakgyoansim-brand.woff2
 *
 * SIL OFL 1.1 이라 잘라 쓰고 함께 내보내도 된다 (같은 폴더의 LICENSE). 작아서 미리 받는다.
 */
export const brandFont = localFont({
  src: './fonts/hakgyoansim-brand.woff2',
  weight: '700',
  display: 'swap',
  variable: '--font-brand',
  fallback: ['var(--font-display)', 'Apple SD Gothic Neo', 'sans-serif'],
})
