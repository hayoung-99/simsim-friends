import type { Copy } from '../lib/copy'
import { BRAND } from '../lib/site'
import { PeekMark } from './PeekMark'

/**
 * 윗줄 — 랜딩과 `/download` 가 함께 쓴다.
 *
 * 예전에는 페이지 전체가 창 한 장이었고 이 자리가 그 창의 제목줄(신호등 세 개)이었다.
 * 베이지 랜딩으로 옮기면서 창틀을 걷었고, 남은 일은 셋이다 — 처음으로 돌아가기,
 * 페이지 안의 섹션으로 건너뛰기(랜딩에서만), 언어 바꾸기.
 *
 * 로고는 앱 아이콘과 같은 "빼꼼" 마크다(`PeekMark`). 인라인 SVG 라 새로 받는 것이 없고,
 * 랜딩 토큰으로 칠해 다크 모드에서 저절로 바뀐다.
 */
export function SiteHeader({
  copy,
  homeHref,
  other,
  sections,
  downloadHref,
}: {
  copy: Copy
  homeHref: string
  other: Copy['other']
  /** 랜딩에서만 넘긴다 — 같은 페이지 안의 섹션으로 가는 링크 */
  sections?: { href: string; label: string }[]
  /** 랜딩에서만 넘긴다 — `/download` 에서는 이미 그 화면이라 두지 않는다 */
  downloadHref?: string
}) {
  return (
    <header className="site-header">
      <a className="logo" href={homeHref} aria-label={sections ? undefined : copy.download.backHome}>
        <PeekMark />
        <span>{BRAND}</span>
      </a>
      <nav>
        {sections?.map((section) => (
          <a className="section-link" key={section.href} href={section.href}>
            {section.label}
          </a>
        ))}
        <a className="lang" href={other.href} hrefLang={other.lang} lang={other.lang}>
          {other.short}
        </a>
        {downloadHref && (
          <a className="btn btn-small" href={downloadHref}>
            {copy.nav.download}
          </a>
        )}
      </nav>
    </header>
  )
}
