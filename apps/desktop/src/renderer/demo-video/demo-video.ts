/**
 * 랜딩 히어로의 데모 영상 — 내 화면에서 고양이를 톡 누르면 신호가 건너가 민지 화면의
 * 강아지가 춤춘다.
 *
 * **캐릭터는 앱 코드 그대로다.** 누른 쪽은 `animator.twitch()` 와 말풍선, 받은 쪽은
 * `animator.dance()` 와 음표 여섯 개 — `pet/pet.ts` 의 `tapSelf`·`tapReceived` 가 하는
 * 일을 같은 순서로 부른다. 그 둘을 잇는 커서 · 물결 · 신호 궤적만 영상을 위해 그린 것이다.
 *
 * 시간은 실제 시계가 아니라 `seekFrame()` 이 한 장씩 넘긴다. 그래서 캡처가 느려도 영상은
 * 정확히 60fps 이고, 난수도 고정해 두어 몇 번을 다시 떠도 같은 영상이 나온다.
 *
 *   ?lang=ko | en   영상에 구워 넣을 글씨의 언어
 */

import * as THREE from 'three'
import { getCharacter } from '@simsim-friends/shared/characters'
import { createTranslator } from '@simsim-friends/shared/i18n'
import { createCritter, scaleToStandardHeight } from '../pet/critter'
import { createAnimator } from '../pet/animations'
import { createNotes } from '../pet/notes'
import { createStage } from '../pet/scene'
import {
  BLEND_SECONDS,
  BUBBLE_SECONDS,
  CUES,
  FPS,
  LOOP_SECONDS,
  NAMEPLATE_SECONDS,
  TOTAL_FRAMES,
  bezierPoint,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  frameTime,
  loopBlendWeight,
  progress,
  seededRandom,
} from './timeline'
import type { Point } from './timeline'

// 캐릭터를 만들기 전에 바꿔 끼운다 — 깜빡임 간격과 음표 자리가 여기서 정해진다.
Math.random = seededRandom(20261020)

const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'ko'
document.documentElement.lang = lang

/**
 * 영상에 구워 넣는 글씨. 랜딩 사전(`apps/web/lib/copy.*.tsx` 의 `demo.label`)의 설명과
 * 이름이 맞아야 한다 — 바꾸면 그쪽 설명도 함께 고친다. 말풍선은 앱이 실제로 띄우는
 * 문구를 앱 사전에서 그대로 가져온다.
 */
const TEXT = {
  ko: { mine: '내 화면', theirs: '민지 화면', sender: '나영' },
  en: { mine: 'Your screen', theirs: "Mina's screen", sender: 'Nayoung' },
}[lang]
const bubbleText = createTranslator(lang)('pet.bubble')

/**
 * 세로 화각. 앱 창(31°)과 거의 같게 둔다. 24° 로 좁혀 캐릭터를 키워 봤더니 춤추며 옆으로
 * 건너갈 때 몸과 음표가 화면 가장자리에서 잘렸다. 카메라 자리와 조명은 앱 그대로다.
 */
const FOV = 29
/** 신호가 몸 어디에서 떠나고 닿는지 (캐릭터 키 2.0 기준 높이) */
const BELLY = 0.85
const HEAD_TOP = 2.02
/** 말풍선과 머리 사이 간격(px). `pet/bubble.ts` 의 `GAP` 과 같다 */
const BUBBLE_GAP = 12
/** 커서 그림에서 화살촉 끝이 있는 자리(px). 30px 로 그린 24 칸짜리 아이콘의 (5, 2.5) */
const CURSOR_TIP = { x: 6.25, y: 3.1 }

const $ = <T extends Element>(selector: string) => document.querySelector(selector) as T

for (const element of document.querySelectorAll<HTMLElement>('[data-text]')) {
  const key = element.dataset.text as keyof typeof TEXT | 'bubble'
  element.textContent = key === 'bubble' ? bubbleText : TEXT[key]
}

interface Actor {
  screen: HTMLElement
  canvas: HTMLCanvasElement
  stage: ReturnType<typeof createStage>
  animator: ReturnType<typeof createAnimator>
  notes: ReturnType<typeof createNotes>
}

/**
 * 화면 한 장에 캐릭터 한 마리. 앱의 `createStage` 를 그대로 쓰되, 서로 마주 보도록
 * 내 고양이는 오른쪽을, 민지의 강아지는 왼쪽을 보게 돌린다.
 */
function createActor(screenSelector: string, key: string, yaw: number): Actor {
  const screen = $<HTMLElement>(screenSelector)
  const canvas = screen.querySelector('canvas') as HTMLCanvasElement
  const stage = createStage({ canvas, yaw })
  stage.camera.fov = FOV
  stage.camera.updateProjectionMatrix()

  const critter = createCritter(getCharacter(key))
  const scale = scaleToStandardHeight(critter)
  stage.stand.scale.setScalar(scale)
  stage.stand.add(critter.root)

  return {
    screen,
    canvas,
    stage,
    animator: createAnimator(critter),
    notes: createNotes(stage.stand, critter.height * scale),
  }
}

const mine = createActor('.screen.mine', 'cat', 0.2)
const theirs = createActor('.screen.theirs', 'dog', -0.2)

/**
 * 캐릭터 몸의 한 높이가 그 화면 안에서 어디에 그려지는지(px, 화면 판 기준).
 * 첫 프레임을 그리기 전이라 카메라 행렬을 손수 최신화한다 — 안 하면 50px 쯤 어긋난다.
 */
function anchorInScreen(actor: Actor, height: number): Point {
  actor.stage.camera.updateMatrixWorld()
  const ndc = new THREE.Vector3(0, height, 0).project(actor.stage.camera)
  return {
    x: ((ndc.x + 1) / 2) * actor.canvas.clientWidth + actor.canvas.offsetLeft,
    y: ((1 - ndc.y) / 2) * actor.canvas.clientHeight + actor.canvas.offsetTop,
  }
}

/** 기울여 놓은 화면 판 안의 점을 장면 전체 좌표로. 판은 가운데를 축으로 돈다. */
function toScene(screen: HTMLElement, local: Point): Point {
  const angle = new DOMMatrix(getComputedStyle(screen).transform)
  const cx = screen.offsetWidth / 2
  const cy = screen.offsetHeight / 2
  const turned = angle.transformPoint(new DOMPoint(local.x - cx, local.y - cy))
  return { x: screen.offsetLeft + cx + turned.x, y: screen.offsetTop + cy + turned.y }
}

const catHead = anchorInScreen(mine, HEAD_TOP)
const catBelly = anchorInScreen(mine, BELLY)
const dogBelly = anchorInScreen(theirs, BELLY)
const dogFeet = anchorInScreen(theirs, 0)

const catBellyScene = toScene(mine.screen, catBelly)
const dogBellyScene = toScene(theirs.screen, dogBelly)
/** 신호는 위로 크게 솟았다가 떨어진다. 두 화면 사이의 틈을 건너는 것이 보여야 한다 */
const flightControl = {
  x: (catBellyScene.x + dogBellyScene.x) / 2,
  y: Math.min(catBellyScene.y, dogBellyScene.y) - 230,
}

const CURSOR_START = { x: 300, y: 470 }
const CURSOR_REST = { x: catBellyScene.x + 46, y: catBellyScene.y + 58 }
const CURSOR_EXIT = { x: 230, y: 480 }

const bubble = $<HTMLElement>('.bubble')
const ripple = $<HTMLElement>('.ripple')
const ring = $<HTMLElement>('.landing-ring')
const nameplate = $<HTMLElement>('.nameplate')
const cursor = $<SVGElement>('.cursor')
const trail = $<SVGPathElement>('.flight .trail')
const dot = $<SVGCircleElement>('.flight .dot')
const glow = $<SVGCircleElement>('.flight .glow')
const trailFade = $<SVGLinearGradientElement>('#trail-fade')

const place = (element: HTMLElement | SVGElement, point: Point) => {
  element.style.left = `${point.x}px`
  element.style.top = `${point.y}px`
}
place(bubble, { x: catHead.x, y: catHead.y - BUBBLE_GAP })
place(ripple, catBelly)
place(ring, dogBelly)
place(nameplate, { x: dogFeet.x, y: dogFeet.y + 4 })

const lerp = (from: Point, to: Point, u: number): Point => ({
  x: from.x + (to.x - from.x) * u,
  y: from.y + (to.y - from.y) * u,
})

function drawCursor(time: number) {
  let at: Point
  if (time < CUES.cursorIn || time >= CUES.cursorGone) {
    at = CURSOR_START
  } else if (time < CUES.cursorAway) {
    // 곧게 오지 않고 살짝 휘어 들어온다. 사람 손이 그렇게 움직인다
    const u = easeInOutCubic(progress(time, CUES.cursorIn, CUES.cursorAt))
    at = bezierPoint(CURSOR_START, { x: CURSOR_START.x + 90, y: catBellyScene.y + 40 }, catBellyScene, u)
  } else if (time < CUES.cursorOut) {
    at = lerp(catBellyScene, CURSOR_REST, easeInOutCubic(progress(time, CUES.cursorAway, CUES.cursorAway + 0.5)))
  } else {
    at = lerp(CURSOR_REST, CURSOR_EXIT, easeInOutCubic(progress(time, CUES.cursorOut, CUES.cursorGone)))
  }

  // 누르는 순간 살짝 눌렸다 돌아온다
  const pressed = progress(time, CUES.press - 0.05, CUES.press) - progress(time, CUES.press + 0.04, CUES.press + 0.16)
  cursor.style.left = `${at.x - CURSOR_TIP.x}px`
  cursor.style.top = `${at.y - CURSOR_TIP.y}px`
  cursor.style.transform = `scale(${1 - 0.14 * pressed})`
}

/** 앱 말풍선처럼 — 140ms 에 걸쳐 나타나고 220ms 동안 튀어나오며 커졌다가, 1.4초 뒤 사라진다 */
function drawBubble(time: number) {
  const age = time - CUES.press
  const showing = age >= 0 && age < BUBBLE_SECONDS
  const fadeIn = progress(age, 0, 0.14)
  const fadeOut = progress(age, BUBBLE_SECONDS, BUBBLE_SECONDS + 0.14)
  const grow = showing ? easeOutBack(progress(age, 0, 0.22)) : 1 - easeOutCubic(progress(age, BUBBLE_SECONDS, BUBBLE_SECONDS + 0.22))
  bubble.style.opacity = String(age < 0 ? 0 : fadeIn * (1 - fadeOut))
  bubble.style.transform = `translate(-50%, -100%) scale(${0.8 + 0.2 * grow})`
}

function drawRipple(time: number) {
  const u = progress(time, CUES.press, CUES.press + 0.5)
  ripple.style.opacity = String(u > 0 && u < 1 ? 0.95 * (1 - u) : 0)
  ripple.style.transform = `scale(${0.3 + 1.2 * easeOutCubic(u)})`
}

/** 신호 — 꼬리를 끌며 포물선으로 건너간다. 꼬리는 머리 뒤로 경로의 45% 만큼 */
function drawFlight(time: number) {
  const flying = time >= CUES.launch && time < CUES.land + 0.08
  const u = easeInOutCubic(progress(time, CUES.launch, CUES.land))
  const head = bezierPoint(catBellyScene, flightControl, dogBellyScene, u)
  const tailStart = Math.max(0, u - 0.45)
  const points: string[] = []
  for (let step = 0; step <= 16; step += 1) {
    const at = bezierPoint(catBellyScene, flightControl, dogBellyScene, tailStart + ((u - tailStart) * step) / 16)
    points.push(`${at.x.toFixed(2)} ${at.y.toFixed(2)}`)
  }
  const tail = bezierPoint(catBellyScene, flightControl, dogBellyScene, tailStart)

  trail.setAttribute('d', flying ? `M ${points.join(' L ')}` : '')
  trailFade.setAttribute('x1', String(tail.x))
  trailFade.setAttribute('y1', String(tail.y))
  trailFade.setAttribute('x2', String(head.x))
  trailFade.setAttribute('y2', String(head.y))

  // 떠날 때 톡 생겨나고 닿으면 쏙 들어간다
  const size = flying
    ? easeOutBack(progress(time, CUES.launch, CUES.launch + 0.16)) * (1 - progress(time, CUES.land, CUES.land + 0.08))
    : 0
  for (const circle of [dot, glow]) {
    circle.setAttribute('cx', String(head.x))
    circle.setAttribute('cy', String(head.y))
  }
  dot.setAttribute('r', String(9 * size))
  // 날아가는 동안 빛이 숨 쉬듯 일렁인다
  glow.setAttribute('r', String((19 + 4 * Math.sin(time * 28)) * size))
}

function drawRing(time: number) {
  const u = progress(time, CUES.land, CUES.land + 0.55)
  ring.style.opacity = String(u > 0 && u < 1 ? 1 - u : 0)
  ring.style.transform = `scale(${0.4 + 1.3 * easeOutCubic(u)})`
}

/** 앱 이름표의 `chip-life` — 10% 에 걸쳐 나타나 82% 까지 머물고 사라진다 */
function drawNameplate(time: number) {
  const u = (time - CUES.land) / NAMEPLATE_SECONDS
  let opacity = 0
  let rise = 7
  let scale = 0.9
  if (u >= 0 && u < 1) {
    if (u < 0.1) {
      const k = easeOutCubic(u / 0.1)
      opacity = k
      rise = 7 * (1 - k)
      scale = 0.9 + 0.1 * k
    } else if (u < 0.82) {
      opacity = 1
      rise = 0
      scale = 1
    } else {
      const k = easeOutCubic((u - 0.82) / 0.18)
      opacity = 1 - k
      rise = -3 * k
      scale = 1 - 0.02 * k
    }
  }
  nameplate.style.opacity = String(opacity)
  nameplate.style.transform = `translate(-50%, ${rise}px) scale(${scale})`
}

const STEP = 1 / FPS
const crossed = (cue: number, before: number, now: number) => before < cue && cue <= now

let current = -1

/**
 * `index` 번째 장으로 넘긴다. **반드시 0 부터 차례로** 불러야 한다 — 캐릭터의 자세는
 * 앞 장에서 한 칸씩 굴려 오는 것이라 건너뛸 수 없다.
 */
async function seekFrame(index: number) {
  if (index !== current + 1) throw new Error(`[demo-video] ${current} 다음에 ${index} 를 찍을 수 없습니다`)
  const time = frameTime(index)
  const before = index === 0 ? -Infinity : frameTime(index - 1)

  if (crossed(CUES.press, before, time)) mine.animator.twitch()
  if (crossed(CUES.land, before, time)) {
    // `pet.ts` 의 `tapReceived` 가 콕 신호에 하는 일과 같다
    theirs.animator.dance()
    theirs.notes.burst({ count: 6 })
  }

  for (const actor of [mine, theirs]) {
    actor.animator.update(STEP)
    actor.notes.update(STEP)
  }

  drawCursor(time)
  drawBubble(time)
  drawRipple(time)
  drawFlight(time)
  drawRing(time)
  drawNameplate(time)
  mine.stage.render()
  theirs.stage.render()
  current = index

  // 화면에 실제로 합성될 때까지 두 번 기다린다. 그 전에 캡처하면 앞 장이 찍힌다.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

/*
 * 막 만든 애니메이터는 숨쉬기가 약하게 시작해서 차츰 자리를 잡는다. 첫 장부터 평소
 * 모습이도록 찍기 전에 몇 초 굴려 둔다 — 이것도 찍는 장과 같은 고정 간격이라 결과가 같다.
 */
for (let warm = 0; warm < FPS * 3; warm += 1) {
  for (const actor of [mine, theirs]) actor.animator.update(STEP)
}

const loopFrames = Math.round(LOOP_SECONDS * FPS)
const blendFrames = Math.round(BLEND_SECONDS * FPS)

/*
 * 캡처 스크립트(`scripts/make-demo-video.js`)가 읽는 것. 시간표는 여기 한 곳에만 있게
 * 하려고 장 수와 섞는 비율까지 이쪽에서 알려 준다.
 *
 *   still  움직임을 줄인 사람에게 보여 줄 한 장 — 춤이 한창이고 음표가 다 떠 있을 때
 */
;(window as unknown as { demo: unknown }).demo = {
  seekFrame,
  total: TOTAL_FRAMES,
  blend: blendFrames,
  loop: loopFrames,
  still: Math.round((CUES.land + 0.75) * FPS),
  weights: Array.from({ length: loopFrames }, (_, output) => loopBlendWeight(output, loopFrames, blendFrames)),
}
void document.fonts.ready.then(() => document.body.setAttribute('data-ready', 'true'))
