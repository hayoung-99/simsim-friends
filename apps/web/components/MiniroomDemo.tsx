'use client'

import { useEffect, useRef } from 'react'
import type { Copy } from '../lib/copy'

/**
 * 히어로의 미니룸 데모 — 내 방의 고양이를 누르면 친구 방의 강아지가 춤춘다.
 *
 * **누를 때만 움직인다.** 페이지가 저절로 춤을 틀지 않는다. 이 제품의 움직임은 언제나
 * 누군가의 콕에서 시작하므로, 데모도 방문자의 콕 하나에서만 퍼져 나가게 했다.
 *
 * **스크립트가 하는 일은 셋뿐이다** — 장면을 처음부터 다시 틀도록 클래스를 갈아 끼우고,
 * 끝나면 걷고, 카운터 숫자를 올린다. 언제 무엇이 움직이는지(고양이 콕 → 노란 점 →
 * 강아지 춤 → 이름표)는 전부 `globals.css` 의 "미니룸 데모" 절이 지연 시간으로 정한다.
 * 그래서 이 섬은 작고, 스크립트가 늦게 와도 고양이를 누르기 전까지는 아무 차이가 없다.
 *
 * 춤과 콕은 Blender 에서 렌더한 프레임을 이어 붙인 스프라이트다. 움직이는 WebP 를 쓰지
 * 않은 것은 **다시 누를 때 처음부터 틀 수 없어서**다 — 브라우저는 같은 그림의 애니메이션을
 * 한 시계로 돌려서, 두 번째 콕에는 강아지가 춤 중간부터 시작한다.
 */

/** 고양이 콕부터 이름표가 사라질 때까지. `globals.css` 의 지연 시간들을 더한 값과 같아야 한다 */
const SCENE_MS = 3400

/** TOTAL 은 이 브라우저에만 남긴다. 서버로 보내지 않는다 */
const TOTAL_KEY = 'simsim-landing-taps'

function readTotal(): number {
  try {
    return Number(localStorage.getItem(TOTAL_KEY)) || 0
  } catch {
    // 사생활 보호 창이나 저장소를 막은 브라우저 — 이번 방문에서만 센다
    return 0
  }
}

function writeTotal(value: number) {
  try {
    localStorage.setItem(TOTAL_KEY, String(value))
  } catch {
    // 남기지 못해도 화면의 숫자는 그대로 오른다
  }
}

/** 윗줄의 TODAY · TOTAL 칸. 서버가 0 으로 그려 둔 것을 여기서 고친다 */
function paintCounter(today: number, total: number) {
  const todayCell = document.querySelector('[data-count-today]')
  const totalCell = document.querySelector('[data-count-total]')
  if (todayCell) todayCell.textContent = String(today)
  if (totalCell) totalCell.textContent = String(total)
}

/** 음표 — 글자(♪)가 아니라 그림으로 둔다. 서체마다 모양이 달라 미니룸 선과 따로 논다 */
function Note({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 20 24" aria-hidden="true" focusable="false">
      <path d="M8 18.5V4.2l10-2.7v13.2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <ellipse cx="5" cy="19" rx="4" ry="3.2" fill="currentColor" />
      <ellipse cx="15" cy="15.6" rx="4" ry="3.2" fill="currentColor" />
    </svg>
  )
}

/** 아이소메트릭 방 한 칸. 벽 둘과 바닥 하나 — 무늬만 방마다 다르다 */
function Room({ kind }: { kind: 'mine' | 'friend' }) {
  const id = `room-${kind}`
  return (
    <svg className="room-art" viewBox="0 0 430 430" aria-hidden="true" focusable="false">
      <defs>
        {kind === 'mine' ? (
          <>
            <pattern id={`${id}-wall`} width="18" height="18" patternUnits="userSpaceOnUse">
              <rect width="18" height="18" fill="var(--wall-a)" />
              <circle cx="9" cy="9" r="2.4" fill="var(--wall-a-dot)" />
            </pattern>
            <pattern id={`${id}-floor`} width="28" height="14" patternUnits="userSpaceOnUse" patternTransform="skewX(-30)">
              <rect width="28" height="14" fill="var(--floor-a)" />
              <rect width="28" height="1.5" fill="var(--floor-a-line)" />
            </pattern>
          </>
        ) : (
          <>
            <pattern id={`${id}-wall`} width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="var(--wall-b)" />
              <path d="M0 10h20M10 0v20" stroke="var(--wall-b-line)" strokeWidth="2" />
            </pattern>
            <pattern id={`${id}-floor`} width="26" height="26" patternUnits="userSpaceOnUse">
              <rect width="26" height="26" fill="var(--floor-b)" />
              <rect width="13" height="13" fill="var(--floor-b-check)" />
              <rect x="13" y="13" width="13" height="13" fill="var(--floor-b-check)" />
            </pattern>
          </>
        )}
      </defs>
      <polygon points="215,40 405,135 405,300 215,205" fill={kind === 'mine' ? 'var(--wall-a-side)' : 'var(--wall-b-side)'} />
      <polygon points="25,135 215,40 215,205 25,300" fill={`url(#${id}-wall)`} />
      <polygon points="25,300 215,205 405,300 215,395" fill={`url(#${id}-floor)`} />
      <polyline points="25,300 215,395 405,300" fill="none" stroke="var(--room-edge)" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  )
}

export function MiniroomDemo({ strings }: { strings: Copy['demo'] }) {
  const sceneRef = useRef<HTMLDivElement>(null)
  const liveRef = useRef<HTMLParagraphElement>(null)
  const counts = useRef({ today: 0, total: 0 })
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    counts.current.total = readTotal()
    paintCounter(0, counts.current.total)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const poke = () => {
    const scene = sceneRef.current
    if (!scene) return
    // 클래스를 뗐다가 다시 붙여야 CSS 애니메이션이 처음부터 다시 돈다.
    // 그 사이에 레이아웃을 한 번 읽어 브라우저가 "뗀 상태" 를 실제로 거치게 한다
    scene.classList.remove('is-playing')
    void scene.offsetWidth
    scene.classList.add('is-playing')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => scene.classList.remove('is-playing'), SCENE_MS)

    counts.current.today += 1
    counts.current.total += 1
    writeTotal(counts.current.total)
    paintCounter(counts.current.today, counts.current.total)
    // 같은 문장을 다시 넣으면 낭독기가 두 번째 콕을 읽지 않는다 — 비웠다가 채운다
    if (liveRef.current) {
      liveRef.current.textContent = ''
      liveRef.current.textContent = strings.label
    }
  }

  return (
    <div className="miniroom" ref={sceneRef}>
      <div className="room room-mine">
        <span className="room-tag">{strings.myRoom}</span>
        <Room kind="mine" />
        <button type="button" className="cat" onClick={poke} aria-label={strings.tapLabel}>
          <span className="ring" aria-hidden="true" />
          <img className="cat-still" src="/assets/room-cat.webp" alt="" width={480} height={480} decoding="async" />
          <span className="sprite cat-poke" aria-hidden="true" />
        </button>
        <p className="hint-bubble">{strings.hint}</p>
      </div>

      <div className="room room-friend">
        <span className="room-tag">{strings.friendRoom}</span>
        <Room kind="friend" />
        <div className="dog" aria-hidden="true">
          <img className="dog-still" src="/assets/room-dog.webp" alt="" width={480} height={480} decoding="async" />
          <span className="sprite dog-dance" />
          <Note className="music-note music-note-1" />
          <Note className="music-note music-note-2" />
        </div>
        <span className="chip" aria-hidden="true">
          {strings.chip}
        </span>
      </div>

      {/* 노란 점 — 바깥이 옆으로, 안쪽이 위아래로 움직여 포물선을 그린다 */}
      <div className="signal-path" aria-hidden="true">
        {/* 두 방이 이어져 있다는 것을 누르기 전에도 보이게, 점이 지나갈 길을 옅게 그려 둔다 */}
        <svg className="arc" viewBox="0 0 100 60" preserveAspectRatio="none" focusable="false">
          <path d="M0 58 Q50 -56 100 58" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="signal-x">
          <span className="signal-y" />
        </span>
      </div>

      {/* 누르면 무엇이 일어났는지 낭독기에게도 알린다. 화면에는 보이지 않는다 */}
      <p className="visually-hidden" aria-live="polite" ref={liveRef} />
    </div>
  )
}
