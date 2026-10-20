/**
 * 랜딩 히어로의 데모 영상 — 두 사람의 바탕화면을 한 번 오간다.
 *
 *   1. 내 바탕화면에서 고양이로 다가가 톡 누른다 → 신호를 따라 친구 바탕화면으로 건너가
 *      강아지가 춤춘다 (콕 신호)
 *   2. 이번엔 친구가 강아지를 톡 누른다 → 신호를 따라 돌아와 내 고양이가 수줍어한다
 *      (하트 신호)
 *   3. 물러나 내 바탕화면 전체로 — 처음 장면으로 이어진다
 *
 * **캐릭터는 앱 코드 그대로다.** 누른 쪽은 `animator.twitch()` 와 말풍선, 받은 쪽은 춤
 * (`animator.dance()` + 음표 여섯 개) 또는 수줍음(`animator.shy()` + 하트 말풍선) —
 * `pet/pet.ts` 의 `tapSelf`·`tapReceived` 가 하는 일을 같은 순서로 부른다. 그 둘을 잇는
 * 커서 · 물결 · 신호 궤적 · 카메라만 영상을 위해 그린 것이다.
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
import { createHeartBubble } from '../pet/heart-bubble'
import { createStage, PET_CAMERA } from '../pet/scene'
import {
  BLEND_SECONDS,
  BUBBLE_SECONDS,
  FPS,
  LOOP_SECONDS,
  NAMEPLATE_SECONDS,
  TOTAL_FRAMES,
  TO_FRIEND,
  TO_ME,
  ZOOM,
  bezierPoint,
  cameraAt,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  frameTime,
  loopBlendWeight,
  progress,
  seededRandom,
  toView,
} from './timeline'
import type { CameraKey, Leg, Point } from './timeline'

// 캐릭터를 만들기 전에 바꿔 끼운다 — 깜빡임 간격과 음표 자리가 여기서 정해진다.
Math.random = seededRandom(20261020)

const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'ko'
document.documentElement.lang = lang

/** 장면(영상) 크기. `demo-video.css` 의 `#scene` 과 같다 */
const VIEW = { width: 640, height: 440 }

/**
 * 캐릭터에 다가갔을 때의 배율. 바탕화면에 선 캐릭터는 앱처럼 작아서(영상 높이의 4분의 1
 * 남짓) 이만큼 당겨야 표정과 몸짓이 보인다. 머리 위 말풍선과 발밑 이름표가 위아래로
 * 잘리지 않는 데까지만 당긴다.
 */
const ZOOM_SCALE = 2.2

/** 신호 궤적이 솟는 높이와 점 크기(장면 좌표 px). 카메라가 2배 넘게 키워 보이므로 작게 그린다 */
const FLIGHT = { arc: 110, dot: 5, glow: 10 }

/** 신호가 몸 어디에서 떠나고 닿는지 (캐릭터 키 2.0 기준 높이) */
const BELLY = 0.85
const HEAD_TOP = 2.02
/** 말풍선과 머리 사이 간격(px). `pet/bubble.ts` 의 `GAP` 과 같다 */
const BUBBLE_GAP = 12
/** 커서 그림에서 화살촉 끝이 있는 자리(px). 30px 로 그린 24 칸짜리 아이콘의 (5, 2.5) */
const CURSOR_TIP = { x: 6.25, y: 3.1 }

/**
 * 이름표 글씨. 화면 이름 없이 바탕화면만 보여 주므로 특정한 사람 이름 대신 일반어로 둔다
 * — 누구의 이야기가 아니라 누구나의 이야기로 읽히게. 강아지 발밑은 "친구", 고양이 발밑은
 * "나" 로, 그 캐릭터가 누구 것인지를 말한다. (앱의 이름표는 *보낸 사람*의 이름이라 엄밀히는
 * 반대지만, 이름 없이 일반어만 쓰는 영상에서는 이쪽이 덜 헷갈린다.)
 * 말풍선은 앱이 실제로 띄우는 문구를 앱 사전에서 그대로 가져온다.
 */
const TEXT = {
  ko: { mine: '나', theirs: '친구' },
  en: { mine: 'Me', theirs: 'Friend' },
}[lang]
const bubbleText = createTranslator(lang)('pet.bubble')

/**
 * 바탕화면 오른쪽 위에 늘어놓는 아이콘. 실제 바탕화면처럼 보이게 하려는 소품이라
 * 이름은 흔한 것으로만 둔다. 두 사람의 바탕화면이 같아 보이지 않도록 구성을 다르게 했다.
 */
type DeskIcon = { kind: 'folder' | 'document' | 'shot'; label: string }
const DESK_ICONS_BY_LANG: Record<'ko' | 'en', Record<'mine' | 'theirs', DeskIcon[]>> = {
  ko: {
    mine: [
      { kind: 'folder', label: '프로젝트' },
      { kind: 'folder', label: '사진' },
      { kind: 'document', label: '메모.txt' },
      { kind: 'shot', label: '스크린샷' },
    ],
    theirs: [
      { kind: 'folder', label: '여행' },
      { kind: 'folder', label: '디자인' },
      { kind: 'document', label: '보고서.pdf' },
    ],
  },
  en: {
    mine: [
      { kind: 'folder', label: 'Projects' },
      { kind: 'folder', label: 'Photos' },
      { kind: 'document', label: 'notes.txt' },
      { kind: 'shot', label: 'Screenshot' },
    ],
    theirs: [
      { kind: 'folder', label: 'Travel' },
      { kind: 'folder', label: 'Design' },
      { kind: 'document', label: 'report.pdf' },
    ],
  },
}
const DESK_ICONS = DESK_ICONS_BY_LANG[lang]

const $ = <T extends Element>(root: ParentNode, selector: string) => root.querySelector(selector) as T

interface Actor {
  side: 'mine' | 'theirs'
  screen: HTMLElement
  canvas: HTMLCanvasElement
  stage: ReturnType<typeof createStage>
  animator: ReturnType<typeof createAnimator>
  notes: ReturnType<typeof createNotes>
  heart: ReturnType<typeof createHeartBubble>
  bubble: HTMLElement
  ripple: HTMLElement
  ring: HTMLElement
  nameplate: HTMLElement
  /** 화면 판 기준의 머리 위 · 배 · 발 */
  head: Point
  belly: Point
  feet: Point
  /** 장면 전체 기준의 배 */
  bellyScene: Point
}

/**
 * 바탕화면 한 장에 캐릭터 한 마리. 앱의 `createStage` 를 그대로 쓰고 화각도 앱 창 그대로라
 * 앱에 뜨는 모습 그대로 담긴다. 서로 마주 보도록 내 고양이는 오른쪽을, 친구의 강아지는
 * 왼쪽을 보게 돌린다.
 */
function createActor(side: 'mine' | 'theirs', key: string, yaw: number): Actor {
  const screen = $<HTMLElement>(document, `.screen.${side}`)
  const canvas = $<HTMLCanvasElement>(screen, 'canvas')
  const stage = createStage({ canvas, yaw })
  // 카메라가 다가가면 캔버스도 함께 커진다. 처음부터 그만큼 촘촘히 그려 두어야 확대한
  // 캐릭터가 뭉개지지 않는다 (글씨와 판은 DOM 이라 저절로 또렷하다)
  stage.renderer.setPixelRatio(window.devicePixelRatio * ZOOM_SCALE)
  stage.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
  stage.camera.fov = PET_CAMERA.fov
  stage.camera.updateProjectionMatrix()

  const critter = createCritter(getCharacter(key))
  const scale = scaleToStandardHeight(critter)
  stage.stand.scale.setScalar(scale)
  stage.stand.add(critter.root)
  const unit = critter.height * scale

  const list = $<HTMLElement>(screen, '.desk-icons')
  for (const icon of DESK_ICONS[side]) {
    const item = document.createElement('li')
    item.className = icon.kind
    const label = document.createElement('span')
    label.textContent = icon.label
    item.append(document.createElement('i'), label)
    list.append(item)
  }

  const actor = {
    side,
    screen,
    canvas,
    stage,
    animator: createAnimator(critter),
    notes: createNotes(stage.stand, unit),
    heart: createHeartBubble(stage.stand, unit),
    bubble: $<HTMLElement>(screen, '.bubble'),
    ripple: $<HTMLElement>(screen, '.ripple'),
    ring: $<HTMLElement>(screen, '.landing-ring'),
    nameplate: $<HTMLElement>(screen, '.nameplate'),
  }
  const head = anchorInScreen(actor, HEAD_TOP)
  const belly = anchorInScreen(actor, BELLY)
  const feet = anchorInScreen(actor, 0)
  const bellyScene = { x: screen.offsetLeft + belly.x, y: screen.offsetTop + belly.y }

  actor.bubble.textContent = bubbleText
  actor.nameplate.textContent = TEXT[side]
  place(actor.bubble, { x: head.x, y: head.y - BUBBLE_GAP })
  place(actor.ripple, belly)
  place(actor.ring, belly)
  place(actor.nameplate, { x: feet.x, y: feet.y + 4 })

  return { ...actor, head, belly, feet, bellyScene }
}

/**
 * 캐릭터 몸의 한 높이가 그 화면 안에서 어디에 그려지는지(px, 화면 판 기준).
 * 첫 프레임을 그리기 전이라 카메라 행렬을 손수 최신화한다 — 안 하면 50px 쯤 어긋난다.
 */
function anchorInScreen(actor: { stage: Actor['stage']; canvas: HTMLCanvasElement }, height: number): Point {
  actor.stage.camera.updateMatrixWorld()
  const ndc = new THREE.Vector3(0, height, 0).project(actor.stage.camera)
  return {
    x: ((ndc.x + 1) / 2) * actor.canvas.clientWidth + actor.canvas.offsetLeft,
    y: ((1 - ndc.y) / 2) * actor.canvas.clientHeight + actor.canvas.offsetTop,
  }
}

function place(element: HTMLElement, point: Point) {
  element.style.left = `${point.x}px`
  element.style.top = `${point.y}px`
}

const mine = createActor('mine', 'cat', 0.2)
const theirs = createActor('theirs', 'dog', -0.2)
const actors = [mine, theirs]

/**
 * 한 번 건너가는 일. 누가 누르고(`from`) 누가 받는지(`to`), 받는 쪽이 무엇을 하는지.
 * 받는 몸짓은 `pet.ts` 의 `tapReceived` 가 그 신호에 하는 일과 같다.
 */
interface Trip {
  leg: Leg
  from: Actor
  to: Actor
  react: (actor: Actor) => void
  control: Point
  cursorStart: Point
  cursorRest: Point
}

function trip(leg: Leg, from: Actor, to: Actor, react: Trip['react']): Trip {
  return {
    leg,
    from,
    to,
    react,
    // 신호는 두 배 사이에서 위로 솟았다가 떨어진다
    control: {
      x: (from.bellyScene.x + to.bellyScene.x) / 2,
      y: Math.min(from.bellyScene.y, to.bellyScene.y) - FLIGHT.arc,
    },
    // 커서는 다가간 화면의 오른쪽 아래 밖에서 들어오고, 누른 뒤 조금 비켜선다
    cursorStart: { x: from.bellyScene.x + 120, y: from.bellyScene.y + 125 },
    cursorRest: { x: from.bellyScene.x + 38, y: from.bellyScene.y + 46 },
  }
}

const TRIPS = [
  trip(TO_FRIEND, mine, theirs, (actor) => {
    actor.animator.dance()
    actor.notes.burst({ count: 6 })
  }),
  trip(TO_ME, theirs, mine, (actor) => {
    actor.animator.shy()
    actor.heart.burst()
  }),
]

/** 바탕화면 한 장을 영상에 꽉 채워 보는 카메라 */
const wholeDesk = (screen: HTMLElement) => ({
  x: screen.offsetLeft + screen.offsetWidth / 2,
  y: screen.offsetTop + screen.offsetHeight / 2,
  scale: 1,
})

/**
 * 캐릭터에 다가간 카메라. 캐릭터는 바탕화면 구석에 서 있어서 그대로 가운데에 두면 옆
 * 바탕화면과 그 사이 틈이 영상에 들어온다. 그래서 영상이 그 바탕화면 밖으로 나가지 않는
 * 데까지만 가운데로 끌어오고, 캐릭터는 영상 오른쪽 아래로 비켜 선다. 위로 조금 올려 보는
 * 것은 머리 위 말풍선을, 아래로 내려 보는 것은 발밑 이름표를 넣기 위해서다.
 */
function focusOn(actor: Actor, lift: number) {
  const halfWidth = VIEW.width / 2 / ZOOM_SCALE
  const halfHeight = VIEW.height / 2 / ZOOM_SCALE
  const { screen } = actor
  return {
    x: Math.min(Math.max(actor.bellyScene.x, screen.offsetLeft + halfWidth), screen.offsetLeft + screen.offsetWidth - halfWidth),
    y: Math.min(
      Math.max(actor.bellyScene.y - lift, screen.offsetTop + halfHeight),
      screen.offsetTop + screen.offsetHeight - halfHeight,
    ),
    scale: ZOOM_SCALE,
  }
}

const catFocus = focusOn(mine, 30)
const dogFocus = focusOn(theirs, -12)
const CAMERA_KEYS: CameraKey[] = [
  { time: ZOOM.in, ...wholeDesk(mine.screen) },
  { time: ZOOM.inDone, ...catFocus },
  { time: TO_FRIEND.launch, ...catFocus },
  { time: TO_FRIEND.land, ...dogFocus },
  { time: TO_ME.launch, ...dogFocus },
  { time: TO_ME.land, ...catFocus },
  { time: ZOOM.out, ...catFocus },
  { time: ZOOM.outDone, ...wholeDesk(mine.screen) },
]

const world = $<HTMLElement>(document, '#world')
const cursor = $<SVGElement>(document, '.cursor')
const trail = $<SVGPathElement>(document, '.flight .trail')
const dot = $<SVGCircleElement>(document, '.flight .dot')
const glow = $<SVGCircleElement>(document, '.flight .glow')
const trailFade = $<SVGLinearGradientElement>(document, '#trail-fade')

function drawCamera(camera: CameraKey) {
  const origin = toView({ x: 0, y: 0 }, camera, VIEW)
  world.style.transform = `translate(${origin.x}px, ${origin.y}px) scale(${camera.scale})`
}

const lerp = (from: Point, to: Point, u: number): Point => ({
  x: from.x + (to.x - from.x) * u,
  y: from.y + (to.y - from.y) * u,
})

/** 커서는 카메라를 따라 커지지 않는다 — 장면 좌표에서 길을 정하고 영상 좌표로 옮겨 그린다 */
function drawCursor(time: number, camera: CameraKey) {
  const active = TRIPS.find(({ leg }) => time >= leg.cursorIn && time < leg.cursorGone)
  if (!active) {
    cursor.style.opacity = '0'
    return
  }
  const { leg, from, cursorStart, cursorRest } = active
  const target = from.bellyScene
  const at =
    time < leg.cursorAway
      ? // 곧게 오지 않고 살짝 휘어 들어온다. 사람 손이 그렇게 움직인다
        bezierPoint(
          cursorStart,
          { x: cursorStart.x + 20, y: target.y + 40 },
          target,
          easeInOutCubic(progress(time, leg.cursorIn, leg.cursorAt)),
        )
      : lerp(target, cursorRest, easeInOutCubic(progress(time, leg.cursorAway, leg.cursorAway + 0.5)))

  // 누르는 순간 살짝 눌렸다 돌아온다
  const pressed = progress(time, leg.press - 0.05, leg.press) - progress(time, leg.press + 0.04, leg.press + 0.16)
  const shown = toView(at, camera, VIEW)
  cursor.style.opacity = '1'
  cursor.style.left = `${shown.x - CURSOR_TIP.x}px`
  cursor.style.top = `${shown.y - CURSOR_TIP.y}px`
  cursor.style.transform = `scale(${1 - 0.14 * pressed})`
}

/** 앱 말풍선처럼 — 140ms 에 걸쳐 나타나고 220ms 동안 튀어나오며 커졌다가, 1.4초 뒤 사라진다 */
function drawBubble(actor: Actor, time: number) {
  const pressed = TRIPS.filter(({ from }) => from === actor).map(({ leg }) => time - leg.press)
  const age = pressed.find((value) => value >= 0 && value < BUBBLE_SECONDS + 0.22) ?? -1
  const showing = age >= 0 && age < BUBBLE_SECONDS
  const fadeIn = progress(age, 0, 0.14)
  const fadeOut = progress(age, BUBBLE_SECONDS, BUBBLE_SECONDS + 0.14)
  const grow = showing
    ? easeOutBack(progress(age, 0, 0.22))
    : 1 - easeOutCubic(progress(age, BUBBLE_SECONDS, BUBBLE_SECONDS + 0.22))
  actor.bubble.style.opacity = String(age < 0 ? 0 : fadeIn * (1 - fadeOut))
  actor.bubble.style.transform = `translate(-50%, -100%) scale(${0.8 + 0.2 * grow})`
}

/** 누른 자리에 번지는 물결 */
function drawRipple(actor: Actor, time: number) {
  const trips = TRIPS.filter(({ from }) => from === actor)
  const u = Math.max(...trips.map(({ leg }) => {
    const value = progress(time, leg.press, leg.press + 0.5)
    return value > 0 && value < 1 ? value : 0
  }))
  actor.ripple.style.opacity = String(u > 0 ? 0.95 * (1 - u) : 0)
  actor.ripple.style.transform = `scale(${0.3 + 1.2 * easeOutCubic(u)})`
}

/** 신호 — 꼬리를 끌며 포물선으로 건너간다. 꼬리는 머리 뒤로 경로의 45% 만큼 */
function drawFlight(time: number) {
  const active = TRIPS.find(({ leg }) => time >= leg.launch && time < leg.land + 0.08)
  if (!active) {
    trail.setAttribute('d', '')
    dot.setAttribute('r', '0')
    glow.setAttribute('r', '0')
    return
  }
  const { leg, from, to, control } = active
  const path = (u: number) => bezierPoint(from.bellyScene, control, to.bellyScene, u)
  const u = easeInOutCubic(progress(time, leg.launch, leg.land))
  const head = path(u)
  const tailStart = Math.max(0, u - 0.45)
  const tail = path(tailStart)
  const points: string[] = []
  for (let step = 0; step <= 16; step += 1) {
    const at = path(tailStart + ((u - tailStart) * step) / 16)
    points.push(`${at.x.toFixed(2)} ${at.y.toFixed(2)}`)
  }

  trail.setAttribute('d', `M ${points.join(' L ')}`)
  trailFade.setAttribute('x1', String(tail.x))
  trailFade.setAttribute('y1', String(tail.y))
  trailFade.setAttribute('x2', String(head.x))
  trailFade.setAttribute('y2', String(head.y))

  // 떠날 때 톡 생겨나고 닿으면 쏙 들어간다
  const size = easeOutBack(progress(time, leg.launch, leg.launch + 0.16)) * (1 - progress(time, leg.land, leg.land + 0.08))
  for (const circle of [dot, glow]) {
    circle.setAttribute('cx', String(head.x))
    circle.setAttribute('cy', String(head.y))
  }
  dot.setAttribute('r', String(FLIGHT.dot * size))
  // 날아가는 동안 빛이 숨 쉬듯 일렁인다
  glow.setAttribute('r', String(FLIGHT.glow * (1 + 0.2 * Math.sin(time * 28)) * size))
}

/** 신호가 닿은 자리의 반짝임 */
function drawRing(actor: Actor, time: number) {
  const trips = TRIPS.filter(({ to }) => to === actor)
  const u = Math.max(...trips.map(({ leg }) => {
    const value = progress(time, leg.land, leg.land + 0.55)
    return value > 0 && value < 1 ? value : 0
  }))
  actor.ring.style.opacity = String(u > 0 ? 1 - u : 0)
  actor.ring.style.transform = `scale(${0.4 + 1.3 * easeOutCubic(u)})`
}

/** 앱 이름표의 `chip-life` — 10% 에 걸쳐 나타나 82% 까지 머물고 사라진다 */
function drawNameplate(actor: Actor, time: number) {
  const landed = TRIPS.filter(({ to }) => to === actor).map(({ leg }) => (time - leg.land) / NAMEPLATE_SECONDS)
  const u = landed.find((value) => value >= 0 && value < 1) ?? -1
  let opacity = 0
  let rise = 7
  let scale = 0.9
  if (u >= 0) {
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
  actor.nameplate.style.opacity = String(opacity)
  actor.nameplate.style.transform = `translate(-50%, ${rise}px) scale(${scale})`
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

  for (const { leg, from, to, react } of TRIPS) {
    if (crossed(leg.press, before, time)) from.animator.twitch()
    if (crossed(leg.land, before, time)) react(to)
  }

  for (const actor of actors) {
    actor.animator.update(STEP)
    actor.notes.update(STEP)
    actor.heart.update(STEP)
  }

  const camera = cameraAt(time, CAMERA_KEYS)
  drawCamera(camera)
  drawCursor(time, camera)
  drawFlight(time)
  for (const actor of actors) {
    drawBubble(actor, time)
    drawRipple(actor, time)
    drawRing(actor, time)
    drawNameplate(actor, time)
    actor.stage.render()
  }
  current = index

  // 화면에 실제로 합성될 때까지 두 번 기다린다. 그 전에 캡처하면 앞 장이 찍힌다.
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

/*
 * 막 만든 애니메이터는 숨쉬기가 약하게 시작해서 차츰 자리를 잡는다. 첫 장부터 평소
 * 모습이도록 찍기 전에 몇 초 굴려 둔다 — 이것도 찍는 장과 같은 고정 간격이라 결과가 같다.
 */
for (let warm = 0; warm < FPS * 3; warm += 1) {
  for (const actor of actors) actor.animator.update(STEP)
}

const loopFrames = Math.round(LOOP_SECONDS * FPS)
const blendFrames = Math.round(BLEND_SECONDS * FPS)

/*
 * 캡처 스크립트(`scripts/make-demo-video.js`)가 읽는 것. 시간표는 여기 한 곳에만 있게
 * 하려고 장 수와 섞는 비율까지 이쪽에서 알려 준다.
 *
 *   still  움직임을 줄인 사람에게 보여 줄 한 장 — 강아지 춤이 한창이고 음표가 다 떠 있을 때
 */
;(window as unknown as { demo: unknown }).demo = {
  seekFrame,
  total: TOTAL_FRAMES,
  blend: blendFrames,
  loop: loopFrames,
  still: Math.round((TO_FRIEND.land + 0.75) * FPS),
  weights: Array.from({ length: loopFrames }, (_, output) => loopBlendWeight(output, loopFrames, blendFrames)),
}
void document.fonts.ready.then(() => document.body.setAttribute('data-ready', 'true'))
