import type { Copy } from '../lib/copy'
import { BRAND } from '../lib/site'
import { PeekMark } from './PeekMark'

/**
 * 윗줄 — 랜딩과 `/download` 가 함께 쓴다.
 *
 * 미니룸 랜딩(2026-11)에서는 홈피 틀 **위 한 줄**이다 — 처음으로 돌아가기, TODAY · TOTAL
 * 카운터(랜딩에서만), 언어 바꾸기, 받기. 섹션으로 건너뛰는 메뉴는 틀 오른쪽 탭이 맡아서
 * 랜딩은 `sections` 를 넘기지 않는다.
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
  counter,
}: {
  copy: Copy
  homeHref: string
  other: Copy['other']
  /** 랜딩에서만 넘긴다 — 같은 페이지 안의 섹션으로 가는 링크 */
  sections?: { href: string; label: string }[]
  /** 랜딩에서만 넘긴다 — `/download` 에서는 이미 그 화면이라 두지 않는다 */
  downloadHref?: string
  /**
   * 랜딩에서만 넘긴다 — 미니홈피의 TODAY · TOTAL 칸. 숫자는 0 으로 그려 두고
   * 데모를 누를 때 `MiniroomDemo` 가 고친다. **방문자가 누른 횟수뿐**이라 지어낸 숫자가 아니다.
   */
  counter?: Pick<Copy['demo'], 'today' | 'total' | 'counterNote'>
}) {
  return (
    <header className="site-header">
      <a className="logo" href={homeHref} aria-label={sections ? undefined : copy.download.backHome}>
        <PeekMark />
        <span>{BRAND}</span>
      </a>
      {counter && (
        <p className="counter" title={counter.counterNote}>
          {counter.today} <b data-count-today>0</b>
          <span aria-hidden="true"> | </span>
          {counter.total} <b data-count-total>0</b>
          <span className="counter-note"> · {counter.counterNote}</span>
        </p>
      )}
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
