import type { Copy, Step } from '../lib/copy'
import { DOWNLOAD_PATHS, RELEASES_LATEST } from '../lib/site'
import { DownloadButtons } from './DownloadButtons'
import { MiniroomDemo } from './MiniroomDemo'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

/**
 * 랜딩 한 장 — 미니룸 (2026-11). 마크업은 여기 한 벌뿐이고 나라말은 `copy` 로 들어온다.
 *
 * 페이지 전체가 **미니홈피 한 채**다. 하늘색 점선 틀 안에 왼쪽 프로필 칸과 오른쪽 쪽들이
 * 있고, 틀 오른쪽 끝에 붙은 탭이 메뉴다. 프로필 칸은 스크롤해도 따라와서, 어느 쪽을 읽고
 * 있든 받기 단추가 눈에 남는다.
 *
 * **여기는 서버 컴포넌트다.** 스크립트가 필요한 것은 둘뿐이다 — 받기 단추를 이 컴퓨터에
 * 맞춰 주는 `DownloadButtons`, 고양이를 누르면 친구 방에서 춤추는 `MiniroomDemo`.
 * 몸짓 고르기는 여전히 숨긴 라디오 단추와 CSS 로 돈다. 랜딩 본문에 `'use client'` 를
 * 들이면 지키고 있는 자바스크립트 예산(gzip 190KB)이 무너진다.
 *
 * 캐릭터 그림은 전부 Blender 원본에서 같은 키 · 같은 바닥선으로 렌더한 것이다
 * (`apps/web/DESIGN.md` 의 "그림" 절). 그래서 크기를 바꿀 때는 **폭만** 바꾸면 발이 같은
 * 줄에 선다.
 */

/** 조각을 마크업으로. 맨 문장이 필요한 곳(구조화 데이터)은 `stepText` 가 맡는다. */
function renderStep(step: Step) {
  return step.map((part, index) =>
    typeof part === 'string' ? part : <strong key={index}>{part.strong}</strong>,
  )
}

/** 모든 캐릭터 그림은 정사각형이다 — 렌더할 때 같은 틀로 찍었다 */
const CHAR_PX = 480
const SIGNAL_PX = 520

/** 재생 단추의 삼각형. 글자(▶)는 서체마다 크기와 자리가 달라 그림으로 둔다 */
function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M5 3.2v9.6L12.6 8z" fill="currentColor" />
    </svg>
  )
}

/** 잠든 친구 위의 z 셋 — 글자가 아니라 그림으로. 앱의 Z 말풍선과 같은 남색이다 */
function SleepZ() {
  return (
    <svg className="sleep-z" viewBox="0 0 40 36" aria-hidden="true" focusable="false">
      <path d="M22 4h12l-12 13h12" />
      <path d="M10 18h8l-8 9h8" />
      <path d="M2 29h5l-5 5h5" />
    </svg>
  )
}

export function Landing({ copy }: { copy: Copy }) {
  const downloadHref = copy.locale === 'en' ? DOWNLOAD_PATHS.en : DOWNLOAD_PATHS.ko
  const [firstStep, codeStep, lastStep] = copy.start.steps

  const tabs = [
    { href: '#room', label: copy.nav.home, tone: 'apricot' },
    { href: '#signals', label: copy.nav.signals, tone: 'sage' },
    { href: '#friends', label: copy.nav.friends, tone: 'rose' },
    { href: '#start', label: copy.nav.start, tone: 'butter' },
    { href: downloadHref, label: copy.nav.download, tone: 'sky' },
  ]

  return (
    <>
      <a className="skip" href="#main">
        {copy.skipToContent}
      </a>

      <SiteHeader
        copy={copy}
        homeHref={copy.locale === 'en' ? '/en/' : '/'}
        other={copy.other}
        downloadHref={downloadHref}
        counter={copy.demo}
      />

      <main id="main" className="home">
        <div className="frame">
          {/* ── 프로필 칸 ── 스크롤해도 따라온다. 받기 단추가 여기 산다 */}
          <aside className="profile">
            <div className="avatar">
              <img src="/assets/friend-cat.webp" alt="" width={CHAR_PX} height={CHAR_PX} decoding="async" />
            </div>
            <h1>
              <span className="lead-line">{copy.hero.lead}</span>
              <span className="tail-line">{copy.hero.tail}</span>
            </h1>
            <p className="intro">{copy.hero.sub}</p>
            <ul className="facts">
              {copy.hero.facts.map((fact) => (
                <li key={fact}>{fact}</li>
              ))}
            </ul>
            <div className="player">
              <p className="player-label">{copy.hero.playerLabel}</p>
              <a className="btn btn-play" href={RELEASES_LATEST} data-hero-download>
                <span className="play" aria-hidden="true">
                  <PlayIcon />
                </span>
                {/* 글자만 `DownloadButtons` 가 이 컴퓨터에 맞춰 바꾼다 */}
                <span data-hero-download-label>{copy.hero.download}</span>
              </a>
              {/*
                받기 버튼 **바로 아래**다. 경고 이야기가 한참 아래에만 있으면, 누르는 순간
                페이지를 떠나는 사람에게는 없는 것과 같다.
              */}
              <p className="warn">
                {copy.hero.warns} <a href="#install">{copy.hero.warnsLink}</a>
              </p>
            </div>
            <p className="note">{copy.hero.note}</p>
          </aside>

          <div className="pages">
            {/* ── 미니룸 ── 이 제품의 단 하나뿐인 마법을 글보다 먼저 눌러 보게 한다 */}
            <section className="page page-room" id="room" aria-labelledby="room-heading">
              <header className="page-head">
                <h2 id="room-heading">{copy.demo.heading}</h2>
                <a className="howto" href="#start">
                  {copy.hero.howTo}
                </a>
              </header>
              <MiniroomDemo strings={copy.demo} />
              <div className="lineup-strip">
                <p>{copy.demo.lineup}</p>
                <ul>
                  {copy.friends.items.map((friend) => (
                    <li key={friend.id}>
                      <span className="face">
                        <img src={`/assets/room-${friend.id}.webp`} alt="" width={CHAR_PX} height={CHAR_PX} loading="lazy" decoding="async" />
                      </span>
                      <span className="face-name">{friend.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── 말 걸기엔 시시하고 ── 메신저의 흔적을 줄 그어 지운다 */}
            <section className="page page-quiet" aria-labelledby="quiet-heading">
              <h2 id="quiet-heading">{copy.quiet.heading}</h2>
              <ul className="traces" aria-hidden="true">
                {copy.quiet.stickers.map((sticker) => (
                  <li key={sticker}>{sticker}</li>
                ))}
              </ul>
              <p className="quiet-body">
                <strong>{copy.quiet.bodyStrong}</strong> {copy.quiet.body}
              </p>
            </section>

            {/*
              ── 몸짓 다섯 가지 ──

              라디오 단추 다섯이 이 칸의 **맨 앞 형제**여야 한다. CSS 가 `:checked ~` 로 뒤에
              오는 목록과 무대를 함께 고르기 때문이다. 같은 `name` 이라 화살표 키로도 넘어간다.
            */}
            <section className="page page-signals" id="signals" aria-labelledby="signals-heading">
              {copy.signals.items.map((item, index) => (
                <input
                  key={item.id}
                  className="signal-input"
                  type="radio"
                  name="signal"
                  id={`signal-${item.id}`}
                  defaultChecked={index === 0}
                />
              ))}
              <div className="signals-copy">
                <h2 id="signals-heading">{copy.signals.heading}</h2>
                <p className="sub">{copy.signals.sub}</p>
                <div className="picker" role="group" aria-label={copy.signals.pickerLabel}>
                  {copy.signals.items.map((item) => (
                    <label key={item.id} htmlFor={`signal-${item.id}`} data-signal={item.id}>
                      <b>{item.name}</b>
                      <span>{item.meaning}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="stage">
                {copy.signals.items.map((item) => (
                  <figure key={item.id} data-signal={item.id}>
                    <img
                      src={`/assets/signal-${item.id}.webp`}
                      alt={item.alt}
                      width={SIGNAL_PX}
                      height={SIGNAL_PX}
                      loading="lazy"
                      decoding="async"
                    />
                    <figcaption>{item.motion}</figcaption>
                  </figure>
                ))}
              </div>
            </section>

            {/* ── 다섯 친구 ── 같은 키 · 같은 바닥선으로 한 줄에 선다 */}
            <section className="page page-friends" id="friends" aria-labelledby="friends-heading">
              <h2 id="friends-heading">{copy.friends.heading}</h2>
              <p className="sub">{copy.friends.sub}</p>
              <ul className="shelf">
                {copy.friends.items.map((friend) => (
                  <li key={friend.id} data-friend={friend.id}>
                    <img
                      src={`/assets/friend-${friend.id}.webp`}
                      alt=""
                      width={CHAR_PX}
                      height={CHAR_PX}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="name">
                      {friend.name}
                      <small>{friend.trait}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* ── 시작하기 ── 순서가 곧 내용이라 번호를 단다 */}
            <section className="page page-start" id="start" aria-labelledby="start-heading">
              <h2 id="start-heading">{copy.start.heading}</h2>
              <ol className="steps">
                <li className="step">
                  <h3>{firstStep.title}</h3>
                  <p>{firstStep.body}</p>
                </li>
                <li className="step step-code">
                  <h3>{codeStep.title}</h3>
                  <p>{codeStep.body}</p>
                  <div className="ticket">
                    <code>{copy.start.codeSample}</code>
                    <span>{copy.start.codeNote}</span>
                  </div>
                </li>
                <li className="step">
                  <h3>{lastStep.title}</h3>
                  <p>{lastStep.body}</p>
                </li>
              </ol>
            </section>

            {/*
              ── 방 규칙 ── 홈피의 "기본 정보" 표처럼 점선 줄 네 개. 숫자를 크게 띄운 카드로 두면
              흔한 지표 자랑처럼 읽혀서, 숫자는 줄 안의 한 낱말로만 둔다.
            */}
            <section className="page page-rules" aria-labelledby="rules-heading">
              <h2 id="rules-heading">{copy.room.heading}</h2>
              <dl className="rules">
                <div className="rule">
                  <dt>
                    <b className="num">{copy.room.members.big}</b>
                    {copy.room.members.title}
                  </dt>
                  <dd>{copy.room.members.body}</dd>
                </div>
                <div className="rule">
                  <dt>
                    <b className="num">{copy.room.rooms.big}</b>
                    {copy.room.rooms.title}
                  </dt>
                  <dd>{copy.room.rooms.body}</dd>
                </div>
                <div className="rule rule-sleep">
                  <dt>{copy.room.sleep.title}</dt>
                  <dd>
                    <span>{copy.room.sleep.body}</span>
                    <span className="sleeper" aria-hidden="true">
                      <img src="/assets/sleep-dog.webp" alt="" width={CHAR_PX} height={CHAR_PX} loading="lazy" decoding="async" />
                      <SleepZ />
                    </span>
                  </dd>
                </div>
                <div className="rule">
                  <dt>{copy.room.clear.title}</dt>
                  <dd>{copy.room.clear.body}</dd>
                </div>
              </dl>
            </section>

            {/* ── 처음 열 때 ── 프로필 칸의 "넘기는 법 보기" 가 여기로 온다 */}
            <section className="page page-install" id="install" aria-labelledby="install-heading">
              <h2 id="install-heading">{copy.install.heading}</h2>
              <p className="sub">{copy.install.sub}</p>
              <div className="guides">
                <div className="guide" id="guide-macos">
                  <h3>{copy.install.macos.title}</h3>
                  <ol>
                    {copy.install.macos.steps.map((step, index) => (
                      // 순서가 곧 내용이라 index 를 열쇠로 써도 흔들리지 않는다
                      <li key={index}>{renderStep(step)}</li>
                    ))}
                  </ol>
                </div>
                <div className="guide" id="guide-windows">
                  <h3>{copy.install.windows.title}</h3>
                  <ol>
                    {copy.install.windows.steps.map((step, index) => (
                      <li key={index}>{renderStep(step)}</li>
                    ))}
                  </ol>
                  <p className="hint">{copy.install.windows.hint}</p>
                </div>
              </div>
            </section>

            {/* ── 궁금한 것 ── 방명록처럼. 질문만 보이게 접어 둔다 */}
            <section className="page page-faq" id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading">{copy.faq.heading}</h2>
              <div className="guestbook">
                {copy.faq.items.map((item) => (
                  <details className="qa" key={item.id} id={item.id}>
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* ── 마지막 받기 칸 ── Linux 는 기획서대로 아직 앞세우지 않는다 */}
            <section className="page page-final" aria-labelledby="final-heading">
              <div className="final-copy">
                <h2 id="final-heading">
                  {copy.final.headingTop}
                  <br />
                  {copy.final.headingBottom}
                </h2>
                <a className="btn" href={downloadHref}>
                  {copy.nav.download}
                </a>
                <p className="note">{copy.final.note}</p>
              </div>
              <div className="final-floor" aria-hidden="true">
                <img src="/assets/signal-sulk.webp" alt="" width={SIGNAL_PX} height={SIGNAL_PX} loading="lazy" decoding="async" />
                <img src="/assets/signal-heart.webp" alt="" width={SIGNAL_PX} height={SIGNAL_PX} loading="lazy" decoding="async" />
                <img src="/assets/signal-hop.webp" alt="" width={SIGNAL_PX} height={SIGNAL_PX} loading="lazy" decoding="async" />
              </div>
            </section>
          </div>

          {/* ── 탭 ── 틀 오른쪽 끝에 붙어 스크롤을 따라온다. 좁은 화면에서는 틀 위 가로 줄이 된다 */}
          <div className="tab-rail">
            <nav className="tabs" aria-label={copy.nav.menuLabel}>
              {tabs.map((tab) => (
                <a key={tab.href} href={tab.href} data-tone={tab.tone}>
                  {tab.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </main>

      <SiteFooter copy={copy} />

      <DownloadButtons strings={copy.downloadStrings} />
    </>
  )
}
