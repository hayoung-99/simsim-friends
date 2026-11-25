import type { Copy, Step } from '../lib/copy'
import { DOWNLOAD_PATHS, RELEASES_LATEST } from '../lib/site'
import { DownloadButtons } from './DownloadButtons'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

/**
 * 랜딩 한 장. 마크업은 여기 한 벌뿐이고 나라말은 `copy` 로 들어온다.
 *
 * **여기는 서버 컴포넌트다.** 자바스크립트가 필요한 것은 받기 단추(`DownloadButtons`)
 * 하나뿐이다. 누르면 친구 화면에서 춤추는 데모와 몸짓 고르기도 손에 반응하지만
 * 스크립트가 아니라 **숨긴 체크박스 · 라디오 단추와 CSS** 로 돈다(`globals.css` 의
 * "데모" · "몸짓" 절). 랜딩 본문에 `'use client'` 를 들이면 지키고 있는 자바스크립트
 * 예산이 무너진다.
 */

/** 조각을 마크업으로. 맨 문장이 필요한 곳(구조화 데이터)은 `stepText` 가 맡는다. */
function renderStep(step: Step) {
  return step.map((part, index) =>
    typeof part === 'string' ? part : <strong key={index}>{part.strong}</strong>,
  )
}

/** 캐릭터 그림들의 실제 크기. 자리를 미리 잡아 두어 그림이 들어올 때 글이 밀리지 않게 한다 */
const FRIEND_SIZE = {
  cat: [434, 520],
  dog: [496, 520],
  panda: [517, 520],
  duck: [445, 520],
  bunny: [398, 520],
} as const

const SIGNAL_SIZE = {
  poke: [760, 583],
  hop: [437, 760],
  wave: [760, 741],
  heart: [480, 760],
  sulk: [396, 760],
} as const

/** 데모 영상의 크기. `apps/desktop/scripts/make-demo-video.js` 의 `FRAME` 과 같다 */
const DEMO_SIZE = [1280, 880] as const

const escapeAttr = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * 히어로 데모 영상. WebM(VP9)이 더 가벼워 앞에 두고, 그것을 못 트는 사파리는 MP4 로 간다.
 * `playsinline` 이 없으면 아이폰이 전체 화면으로 열려 하고, `muted` 가 없으면 아예 저절로
 * 돌지 않는다.
 */
function demoVideoHtml(locale: string, label: string) {
  const base = `/assets/demo-${locale}`
  return (
    `<video class="demo-video" width="${DEMO_SIZE[0]}" height="${DEMO_SIZE[1]}" ` +
    `poster="${base}-poster.webp" autoplay muted loop playsinline preload="auto" ` +
    `aria-label="${escapeAttr(label)}">` +
    `<source src="${base}.webm" type="video/webm">` +
    `<source src="${base}.mp4" type="video/mp4">` +
    `</video>`
  )
}

export function Landing({ copy }: { copy: Copy }) {
  const downloadHref = copy.locale === 'en' ? DOWNLOAD_PATHS.en : DOWNLOAD_PATHS.ko
  const [firstStep, codeStep, lastStep] = copy.start.steps

  return (
    <>
      <a className="skip" href="#main">
        {copy.skipToContent}
      </a>

      <SiteHeader
        copy={copy}
        homeHref={copy.locale === 'en' ? '/en/' : '/'}
        other={copy.other}
        sections={[
          { href: '#signals', label: copy.nav.signals },
          { href: '#friends', label: copy.nav.friends },
          { href: '#start', label: copy.nav.start },
        ]}
        downloadHref={downloadHref}
      />

      <main id="main">
        {/* ── 히어로 ── */}
        <section className="hero">
          <div className="hero-copy">
            <h1>
              {copy.hero.lead}
              <br />
              {copy.hero.tail}
            </h1>
            <p className="lead">{copy.hero.sub}</p>
            <div className="actions">
              <a className="btn" href={RELEASES_LATEST} data-hero-download>
                {copy.hero.download}
              </a>
              <a className="btn ghost" href="#start">
                {copy.hero.howTo}
              </a>
            </div>
            {/*
              받기 버튼 **바로 아래**다. 경고 이야기가 한참 아래에만 있으면, 누르는 순간
              페이지를 떠나는 사람에게는 없는 것과 같다.
            */}
            <p className="note">
              {copy.hero.warns} <a href="#install">{copy.hero.warnsLink}</a>
            </p>
            <p className="note">{copy.hero.note}</p>
          </div>

          {/*
            누르면 친구 화면에서 반응한다. 이 제품의 단 하나뿐인 마법을 글보다 먼저 보게 한다.
            내 고양이를 누르면 신호를 따라 친구 바탕화면으로 건너가 강아지가 춤추고, 친구가
            강아지를 누르면 돌아와 내 고양이가 수줍어하는 왕복 영상이다.

            앱의 캐릭터 코드로 그려 찍었다 (`apps/desktop/src/renderer/demo-video/`,
            `npm run demo-video`). 글씨가 구워져 있어 언어마다 한 벌씩이다.

            영상 태그를 JSX 가 아니라 HTML 그대로 내보낸다. React 는 `muted` 를 속성이 아니라
            DOM 값으로만 다뤄서 서버가 그린 HTML 에 남기지 않는데, 이 페이지는 이 부분을
            다시 그리지 않으므로 그 값이 끝내 들어가지 않는다. `muted` 가 HTML 에 없으면
            브라우저가 자동 재생을 막아 포스터만 남는다.
          */}
          <figure className="demo">
            <div
              // 우리가 고른 고정된 경로와 사전 문구만 들어간다. 사전 문구는 escapeAttr 를 거친다
              dangerouslySetInnerHTML={{ __html: demoVideoHtml(copy.locale, copy.demo.label) }}
            />
            <img
              className="demo-still"
              src={`/assets/demo-${copy.locale}-still.webp`}
              alt={copy.demo.label}
              width={DEMO_SIZE[0]}
              height={DEMO_SIZE[1]}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </section>

        {/* ── 말 걸기엔 시시하고 ── */}
        <section className="quiet" aria-labelledby="quiet-heading">
          <h2 id="quiet-heading">{copy.quiet.heading}</h2>
          <ul className="stickers" aria-hidden="true">
            {copy.quiet.stickers.map((sticker) => (
              <li key={sticker}>{sticker}</li>
            ))}
          </ul>
          <p>
            <strong>{copy.quiet.bodyStrong}</strong> {copy.quiet.body}
          </p>
        </section>

        {/*
          ── 몸짓 다섯 가지 ──

          라디오 단추 다섯이 이 칸의 **맨 앞 형제**여야 한다. CSS 가 `:checked ~` 로 뒤에
          오는 목록과 그림판을 함께 고르기 때문이다. 같은 `name` 이라 화살표 키로도 넘어간다.
        */}
        <section className="signals" id="signals" aria-labelledby="signals-heading">
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
                  width={SIGNAL_SIZE[item.id][0]}
                  height={SIGNAL_SIZE[item.id][1]}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>{item.motion}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── 다섯 친구 ── */}
        <section className="friends" id="friends" aria-labelledby="friends-heading">
          <h2 id="friends-heading">{copy.friends.heading}</h2>
          <p className="sub">{copy.friends.sub}</p>
          <ul className="lineup">
            {copy.friends.items.map((friend) => (
              <li key={friend.id}>
                <img
                  src={`/assets/friend-${friend.id}.webp`}
                  alt=""
                  width={FRIEND_SIZE[friend.id][0]}
                  height={FRIEND_SIZE[friend.id][1]}
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
        <section className="start" id="start" aria-labelledby="start-heading">
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

        {/* ── 방 규칙 네 칸 ── */}
        <section className="room">
          <div className="tile tile-members">
            <div className="crowd" aria-hidden="true">
              {copy.friends.items.map((friend) => (
                <img
                  key={friend.id}
                  src={`/assets/friend-${friend.id}.webp`}
                  alt=""
                  width={FRIEND_SIZE[friend.id][0]}
                  height={FRIEND_SIZE[friend.id][1]}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
            <div>
              <span className="big">{copy.room.members.big}</span>
              <h3>{copy.room.members.title}</h3>
              <p>{copy.room.members.body}</p>
            </div>
          </div>
          <div className="tile tile-rooms">
            <span className="big">{copy.room.rooms.big}</span>
            <h3>{copy.room.rooms.title}</h3>
            <p>{copy.room.rooms.body}</p>
          </div>
          <div className="tile tile-sleep">
            <span className="zz" aria-hidden="true">
              <i>Z</i>
              <i>Z</i>
              <i>Z</i>
            </span>
            <h3>{copy.room.sleep.title}</h3>
            <p>{copy.room.sleep.body}</p>
          </div>
          <div className="tile tile-clear">
            <div>
              <h3>{copy.room.clear.title}</h3>
              <p>{copy.room.clear.body}</p>
            </div>
            <img
              src="/assets/friend-panda.webp"
              alt=""
              width={FRIEND_SIZE.panda[0]}
              height={FRIEND_SIZE.panda[1]}
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>

        {/* ── 처음 열 때 ── 히어로의 "넘기는 법 보기" 가 여기로 온다 */}
        <section className="install" id="install" aria-labelledby="install-heading">
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

        {/* ── 궁금한 것 ── 여섯 개를 다 펼쳐 두면 길어서, 질문만 보이게 접어 둔다 */}
        <section className="faq" id="faq" aria-labelledby="faq-heading">
          <h2 id="faq-heading">{copy.faq.heading}</h2>
          <div className="qa-list">
            {copy.faq.items.map((item) => (
              <details className="qa" key={item.id} id={item.id}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── 마지막 받기 칸 ── Linux 는 기획서대로 아직 앞세우지 않는다 */}
        <section className="final" aria-labelledby="final-heading">
          <div>
            <h2 id="final-heading">
              {copy.final.headingTop}
              <br />
              {copy.final.headingBottom}
            </h2>
            <div className="actions">
              <a className="btn" href={downloadHref}>
                {copy.nav.download}
              </a>
            </div>
            <p className="note">{copy.final.note}</p>
          </div>
          <div className="pile" aria-hidden="true">
            <img src="/assets/signal-sulk.webp" alt="" width={SIGNAL_SIZE.sulk[0]} height={SIGNAL_SIZE.sulk[1]} loading="lazy" decoding="async" />
            <img src="/assets/signal-heart.webp" alt="" width={SIGNAL_SIZE.heart[0]} height={SIGNAL_SIZE.heart[1]} loading="lazy" decoding="async" />
            <img src="/assets/signal-hop.webp" alt="" width={SIGNAL_SIZE.hop[0]} height={SIGNAL_SIZE.hop[1]} loading="lazy" decoding="async" />
          </div>
        </section>
      </main>

      <SiteFooter copy={copy} />

      <DownloadButtons strings={copy.downloadStrings} />
    </>
  )
}
