/**
 * SimSim Friends 로고 — "빼꼼" 마크.
 *
 * 모니터 화면 오른쪽 아래에서 고양이가 귀와 눈만 내밀고 있다. 앱 아이콘 · macOS 다크 모드
 * 아이콘 · 메뉴바(트레이) 아이콘 · 랜딩 파비콘이 전부 여기서 나온다 (`scripts/make-app-icon.js`). 모양을 고칠 일이
 * 생기면 이 파일만 고치고 `npm run app-icon` 을 다시 돌린다.
 *
 * Three.js 도 DOM 도 부르지 않는 순수 함수라 `test/logo.test.ts` 가 브라우저 없이 지킨다.
 *
 * 좌표는 마크 하나를 100 칸 안에 그린 것이다.
 */

/** 색 한 벌. 테두리 · 받침대(`ink`)와 고양이(`cat`) */
export interface MarkColors {
  ink: string
  cat: string
}

/** 아이콘 한 벌 — 둥근 판의 색과 그 위의 마크 색 */
export interface IconTheme {
  plate: string
  mark: MarkColors
}

/**
 * 밝은 판 — 랜딩 디자인 시스템의 노란 포인트 색(`--accent`) 위에 짙은 갈색 테두리와
 * 꿀색 고양이. 기본 아이콘이고, 다크 모드를 모르는 곳(Windows · Linux · 옛 macOS ·
 * 파비콘을 SVG 로 못 읽는 브라우저)은 전부 이것을 쓴다.
 */
export const LIGHT: IconTheme = {
  plate: '#ffc83d',
  mark: { ink: '#4a3223', cat: '#8c5410' },
}

/** 어두운 판 — 다크 모드일 때. 검정에 가까운 갈색 위에 크림 테두리와 노란 고양이 */
export const DARK: IconTheme = {
  plate: '#1b1612',
  mark: { ink: '#f6ead6', cat: '#ffcf5e' },
}

/**
 * 고양이 머리. 예전 시안은 원 하나에 삼각형 귀 둘을 겹쳐 그려서, 귀와 얼굴이 만나는
 * 자리마다 꺾인 홈이 생겼다. 그래서 볼 · 귀 · 정수리를 **끊기지 않는 윤곽 하나**로 그린다.
 * 이음매마다 앞뒤 곡선의 방향을 맞춰(조절점을 같은 직선 위에 두어) 꺾임이 없고, 두 귀
 * 사이는 V 자 홈이 아니라 완만한 오목 곡선이며, 볼은 바깥으로 둥글게 부푼다.
 * x=62 를 축으로 좌우 대칭이다 (`test/logo.test.ts` 가 지킨다).
 */
export const CAT_PATH =
  'M44 86 C38.6 76 41.2 64.4 46.5 58.5 L48.6 51.3 C49.3 48.9 50 48.45 51.8 50.2 L56.5 54.8 ' +
  'C59.5 57.8 64.5 57.8 67.5 54.8 L72.2 50.2 C74 48.45 74.7 48.9 75.4 51.3 L77.5 58.5 ' +
  'C82.8 64.4 85.4 76 80 86 Z'

/** 고양이의 좌우 대칭축 */
export const CAT_AXIS = 62

/** 눈 둘. 머리에 구멍을 뚫어 바탕이 비쳐 보이게 한다 (색을 하나 더 쓰지 않으려고) */
export const EYES = [
  { cx: 56, cy: 66, r: 2.7 },
  { cx: 68, cy: 66, r: 2.7 },
]

/** 마크가 실제로 그려지는 범위(100 칸 기준). 판 위에 올릴 때 이 가운데를 판 가운데에 맞춘다 */
export const MARK_BOUNDS = { x: 7, y: 11, width: 86, height: 81 }

/**
 * 마크 본체(SVG 조각). `id` 는 한 문서에 마크가 여럿일 때 클립 · 마스크 이름이 겹치지
 * 않게 붙인다.
 *
 * 고양이는 화면 안쪽 가장자리(테두리 선 6 의 안쪽)를 따라 잘라 테두리 밖으로 새지 않는다.
 */
export function markBody(colors: MarkColors, id: string, { stroke = 6, eye = 2.7 } = {}) {
  const eyes = EYES.map(({ cx, cy }) => `<circle cx="${cx}" cy="${cy}" r="${eye}" fill="#000"/>`).join('')
  return (
    `<defs><clipPath id="screen-${id}"><rect x="13" y="17" width="74" height="56" rx="13"/></clipPath>` +
    `<mask id="eyes-${id}"><rect width="100" height="100" fill="#fff"/>${eyes}</mask></defs>` +
    `<rect x="10" y="14" width="80" height="62" rx="16" fill="none" stroke="${colors.ink}" stroke-width="${stroke}"/>` +
    `<path d="M38 89 H62" stroke="${colors.ink}" stroke-width="${stroke}" stroke-linecap="round"/>` +
    `<g clip-path="url(#screen-${id})"><path d="${CAT_PATH}" fill="${colors.cat}" mask="url(#eyes-${id})"/></g>`
  )
}

/**
 * 초타원(superellipse) 경로. |x|^n + |y|^n = 1.
 * n=4 는 모서리가 둥근 사각형, n 이 커질수록 사각형에 가까워진다. 애플의 연속 곡률
 * 아이콘 모양에 가까운 것은 5 안팎이다.
 */
export function squirclePath(size: number, exponent: number, offset: number) {
  const radius = size / 2
  const STEPS = 360
  const points: string[] = []
  for (let index = 0; index <= STEPS; index += 1) {
    const theta = (index / STEPS) * Math.PI * 2
    const cos = Math.cos(theta)
    const sin = Math.sin(theta)
    const x = Math.sign(cos) * Math.abs(cos) ** (2 / exponent) * radius + radius + offset
    const y = Math.sign(sin) * Math.abs(sin) ** (2 / exponent) * radius + radius + offset
    points.push(`${x.toFixed(2)} ${y.toFixed(2)}`)
  }
  return `M${points.join('L')}Z`
}

/** 1024 캔버스 */
export const CANVAS = 1024

/**
 * 판 크기.
 *
 *   mac   1024 안에 824 판 — 애플 아이콘 규격의 여백. 도크에서 다른 아이콘과 크기가 맞는다
 *   full  판이 캔버스를 꽉 채운다 — Windows 와 파비콘. 작은 크기에서 또렷하다
 */
export const PLATES = {
  mac: { size: 824, exponent: 5 },
  full: { size: 1024, exponent: 4.6 },
} as const

/**
 * 판이 아니라 꽉 찬 정사각형. 아이폰 홈 화면용(apple-touch-icon)이다 — iOS 가 모서리를
 * 알아서 깎는데, 우리가 미리 깎아 두면 그 투명한 모서리를 검정으로 채운다.
 */
export function squareIconSvg(theme: IconTheme, id = 'square') {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}" width="${CANVAS}" height="${CANVAS}">` +
    `<rect width="${CANVAS}" height="${CANVAS}" fill="${theme.plate}"/>` +
    `<g transform="${placeMark(CANVAS * 0.86, CANVAS * 0.07)}">${markBody(theme.mark, id)}</g>` +
    `</svg>`
  )
}

/** 판 위에서 마크가 차지하는 비율(판 한 변 대비) */
const MARK_ON_PLATE = 0.75

/** 마크를 `size` 크기 정사각형 판의 가운데에 올리는 변환 */
function placeMark(size: number, offset: number) {
  const scale = (size * MARK_ON_PLATE) / MARK_BOUNDS.width
  const cx = MARK_BOUNDS.x + MARK_BOUNDS.width / 2
  const cy = MARK_BOUNDS.y + MARK_BOUNDS.height / 2
  const tx = offset + size / 2 - cx * scale
  const ty = offset + size / 2 - cy * scale
  return `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${scale.toFixed(4)})`
}

/** 판까지 그린 앱 아이콘 한 장(1024) */
export function appIconSvg(theme: IconTheme, plate: keyof typeof PLATES, id = 'app') {
  const { size, exponent } = PLATES[plate]
  const offset = (CANVAS - size) / 2
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}" width="${CANVAS}" height="${CANVAS}">` +
    `<path d="${squirclePath(size, exponent, offset)}" fill="${theme.plate}"/>` +
    `<g transform="${placeMark(size, offset)}">${markBody(theme.mark, id)}</g>` +
    `</svg>`
  )
}

/**
 * Icon Composer(`.icon`) 의 그림 한 겹. 판은 Icon Composer 가 채우므로(`icon.json` 의 fill)
 * 여기에는 마크만 둔다. 그 캔버스는 판 자체라 판 크기를 1024 로 보고 올린다.
 */
export function composerLayerSvg(theme: IconTheme, id: string) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}" width="${CANVAS}" height="${CANVAS}">` +
    `<g transform="${placeMark(CANVAS, 0)}">${markBody(theme.mark, id)}</g>` +
    `</svg>`
  )
}

/**
 * 웹 파비콘(SVG). 브라우저 탭이 다크 모드면 SVG 안의 미디어 쿼리가 어두운 판으로 바꾼다
 * (크롬 · 파이어폭스 · 엣지. 사파리는 SVG 파비콘을 쓰지 않아 PNG 로 떨어진다).
 */
export function faviconSvg() {
  const { size, exponent } = PLATES.full
  const paint = (theme: IconTheme) =>
    `.plate{fill:${theme.plate}}.ink{stroke:${theme.mark.ink}}.cat{fill:${theme.mark.cat}}`
  // 색을 속성이 아니라 클래스로 칠해야 미디어 쿼리가 바꿀 수 있다
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}">` +
    `<style>${paint(LIGHT)}@media (prefers-color-scheme: dark){${paint(DARK)}}</style>` +
    `<path class="plate" d="${squirclePath(size, exponent, 0)}"/>` +
    `<g transform="${placeMark(size, 0)}">` +
    markBody({ ink: 'currentColor', cat: 'currentColor' }, 'favicon')
      .replace(/stroke="currentColor"/g, 'class="ink"')
      .replace(/fill="currentColor"/g, 'class="cat"') +
    `</g></svg>`
  )
}

/** 메뉴바 아이콘의 캔버스(포인트). 맥 메뉴바 아이콘의 관례 크기다 */
export const TRAY = 22

/**
 * 메뉴바(트레이) 아이콘 — 마크를 22 칸에 한 가지 색으로 줄인 것.
 *
 * 앱 아이콘과 같은 그림이지만 **선을 굵히고(6 → 7.5) 눈을 키운다(2.7 → 3.4).** 22px 로
 * 줄이면 원래 굵기의 테두리는 1.3px 이 되어 흐려지고, 눈 구멍은 메워져 고양이가 덩어리로
 * 보였다. 색은 하나뿐이다 — 맥은 이것을 템플릿으로 써서 메뉴바 색에 맞춰 스스로 뒤집고,
 * 윈도우 · 리눅스는 검정과 흰색 두 벌을 시스템 테마에 따라 고른다 (`main/tray-icon.ts`).
 */
export function trayMarkSvg(color: string, id = 'tray') {
  const scale = 0.226
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TRAY} ${TRAY}" width="${TRAY}" height="${TRAY}">` +
    `<g transform="translate(-0.3 -0.6) scale(${scale})">` +
    markBody({ ink: color, cat: color }, id, { stroke: 7.5, eye: 3.4 }) +
    `</g></svg>`
  )
}
