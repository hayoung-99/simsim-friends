/**
 * "빼꼼" 로고 마크 — 모니터 오른쪽 아래에서 고양이가 귀와 눈만 내민다.
 *
 * 앱 아이콘과 같은 그림이다. 원본은 `apps/desktop/src/renderer/icon/logo.ts` 이고(그쪽에서
 * 앱 아이콘 · 파비콘을 뜬다), 여기는 그 선과 좌표를 그대로 옮긴 것이다. **모양을 고치면 두
 * 곳을 함께 고친다.**
 *
 * 색은 랜딩 토큰으로 칠한다 — 테두리 · 받침대는 `--ink`, 고양이는 `--accent-text`. 두 토큰의
 * 밝은 값이 앱 아이콘 노란 판의 마크 색과, 다크 모드 값이 검정 판의 마크 색과 같아서 다크
 * 모드에서 저절로 바뀐다. 그림 파일이 아니라 인라인 SVG 인 것도 그래서다.
 *
 * 눈은 머리에 뚫은 구멍이라 뒤의 바탕이 비친다. 한 페이지에 마크가 여럿일 수 있어
 * 클립 · 마스크 이름에 `useId` 를 붙인다.
 */
import { useId } from 'react'

const CAT_PATH =
  'M44 86 C38.6 76 41.2 64.4 46.5 58.5 L48.6 51.3 C49.3 48.9 50 48.45 51.8 50.2 L56.5 54.8 ' +
  'C59.5 57.8 64.5 57.8 67.5 54.8 L72.2 50.2 C74 48.45 74.7 48.9 75.4 51.3 L77.5 58.5 ' +
  'C82.8 64.4 85.4 76 80 86 Z'

export function PeekMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={className} viewBox="7 11 86 81" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`screen-${id}`}>
          <rect x="13" y="17" width="74" height="56" rx="13" />
        </clipPath>
        <mask id={`eyes-${id}`}>
          <rect width="100" height="100" fill="#fff" />
          <circle cx="56" cy="66" r="2.7" fill="#000" />
          <circle cx="68" cy="66" r="2.7" fill="#000" />
        </mask>
      </defs>
      <rect x="10" y="14" width="80" height="62" rx="16" fill="none" stroke="var(--ink)" strokeWidth="6" />
      <path d="M38 89 H62" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
      <g clipPath={`url(#screen-${id})`}>
        <path d={CAT_PATH} fill="var(--accent-text)" mask={`url(#eyes-${id})`} />
      </g>
    </svg>
  )
}
