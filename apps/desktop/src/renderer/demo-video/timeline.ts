/**
 * 랜딩 데모 영상의 시간표와 계산 부분.
 *
 * Three.js 도 DOM 도 부르지 않는다 — 언제 무엇이 일어나는지, 그 사이를 어떤 곡선으로
 * 잇는지, 카메라가 어디를 보는지, 반복 이음매를 어떻게 섞는지만 정한다. 그래서
 * `test/demo-video.test.ts` 가 브라우저 없이 지킨다.
 *
 * 영상은 **한 번 오가는 왕복**이다. 내 바탕화면에서 고양이를 누르면 신호를 따라 친구
 * 바탕화면으로 건너가 강아지가 춤추고, 이번엔 친구가 강아지를 누르면 신호를 따라 돌아와
 * 내 고양이가 수줍어한다. 그러고 물러나 처음 장면으로 이어진다.
 */

/** 초당 장수. 신호를 따라 카메라가 크게 오가는 영상이라 30 이면 끊겨 보인다. */
export const FPS = 60

/** 한 바퀴 길이(초). 끝 장면이 첫 장면으로 이어져 반복된다. */
export const LOOP_SECONDS = 12.4

/**
 * 반복 이음매를 섞는 길이(초).
 *
 * 숨쉬기·깜빡임은 서로 맞지 않는 주기로 돌아서 한 바퀴 뒤의 자세가 처음과 같지 않다. 그래서
 * 0초보다 이만큼 앞에서부터 찍어 두고, 마지막 이만큼을 그 앞 장면 쪽으로 서서히 섞는다.
 * 그러면 마지막 장은 첫 장 바로 앞 장면이 되어 이음매가 사라진다.
 */
export const BLEND_SECONDS = 0.5

/** 카메라가 내 바탕화면 전체에서 다가가고, 다 끝난 뒤 물러나는 시각(초) */
export const ZOOM = {
  in: 0.5,
  inDone: 1.3,
  out: 11.0,
  outDone: 11.7,
} as const

/**
 * 한 번 건너가는 일의 시각(초). 앱의 순서를 그대로 따른다 — 누르면 움찔과 말풍선
 * (`pet.ts` 의 `tapSelf`), 신호가 닿으면 받는 쪽의 몸짓과 이름표(`tapReceived`).
 *
 * 누른 뒤 반 초를 쉬어 말풍선과 움찔을 먼저 보게 하고, 건너가는 데 1.6초를 쓴다. 한 번
 * 줄였더니(0.3초 · 1.1초) "누르면 저쪽에서 반응한다" 는 인과가 읽히기 전에 장면이 넘어갔다.
 * 커서는 카메라가 그 화면을 떠나 보이지 않게 된 뒤에 치운다.
 */
export interface Leg {
  cursorIn: number
  cursorAt: number
  press: number
  cursorAway: number
  launch: number
  land: number
  cursorGone: number
}

/** 내가 고양이를 누른다 → 친구의 강아지가 춤춘다 */
export const TO_FRIEND: Leg = {
  cursorIn: 1.3,
  cursorAt: 1.85,
  press: 1.95,
  cursorAway: 2.1,
  launch: 2.45,
  land: 4.05,
  cursorGone: 3.3,
}

/** 친구가 강아지를 누른다 → 내 고양이가 수줍어한다 */
export const TO_ME: Leg = {
  cursorIn: 6.2,
  cursorAt: 6.75,
  press: 6.85,
  cursorAway: 7.0,
  launch: 7.35,
  land: 8.95,
  cursorGone: 8.2,
}

/** 말풍선이 떠 있는 시간(초). `pet/bubble.ts` 의 `SHOW_MS` 와 같다. */
export const BUBBLE_SECONDS = 1.4

/** 이름표가 떠 있는 시간(초). `pet/nameplate.ts` 의 `LIFE_MS` 와 같다. */
export const NAMEPLATE_SECONDS = 2

/**
 * 받는 쪽 몸짓이 다 끝나기까지(초). 춤은 1.7초지만 마지막 음표가 사라지기까지 2.5초 남짓,
 * 수줍음은 1.7초에 하트 말풍선이 그 안에서 사라진다. 다음 일은 이 뒤에 시작해야 한다.
 */
export const DANCE_SETTLE_SECONDS = 2.6
export const SHY_SETTLE_SECONDS = 1.8

/** 첫 장(섞기 앞부분 포함)부터 마지막 장까지 찍을 장 수 */
export const TOTAL_FRAMES = Math.round((BLEND_SECONDS + LOOP_SECONDS) * FPS)

/** 찍는 순서의 `index` 번째 장이 가리키는 시각(초). 앞의 섞기 구간은 음수다. */
export const frameTime = (index: number) => index / FPS - BLEND_SECONDS

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** `start` 에서 `end` 사이 어디쯤인지 0~1 로. 그 밖은 끝값에 붙는다. */
export function progress(time: number, start: number, end: number) {
  if (end <= start) return time >= end ? 1 : 0
  return clamp01((time - start) / (end - start))
}

export const easeInOutCubic = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2)

export const easeOutCubic = (u: number) => 1 - (1 - u) ** 3

/** 끝에서 살짝 넘쳤다 돌아오는 곡선. 말풍선이 튀어나오는 맛이다. */
export function easeOutBack(u: number) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2
}

export interface Point {
  x: number
  y: number
}

/** 2차 베지어 곡선 위의 점. 신호가 포물선을 그리며 건너가는 길이다. */
export function bezierPoint(from: Point, control: Point, to: Point, u: number): Point {
  const v = 1 - u
  return {
    x: v * v * from.x + 2 * v * u * control.x + u * u * to.x,
    y: v * v * from.y + 2 * v * u * control.y + u * u * to.y,
  }
}

/** 카메라가 바라보는 곳(장면 좌표)과 배율 */
export interface CameraKey extends Point {
  time: number
  scale: number
}

/**
 * 시각 `time` 의 카메라. 열쇠 사이는 천천히 출발해 천천히 서는 곡선으로 잇는다 —
 * 신호도 같은 곡선으로 날아가므로, 그 구간에서는 카메라가 신호와 나란히 움직인다.
 * 열쇠는 시간 순이어야 하고, 첫 열쇠 전과 마지막 열쇠 뒤에는 그 열쇠에 머문다.
 */
export function cameraAt(time: number, keys: CameraKey[]): CameraKey {
  if (time <= keys[0].time) return { ...keys[0], time }
  for (let index = 1; index < keys.length; index += 1) {
    const from = keys[index - 1]
    const to = keys[index]
    if (time <= to.time) {
      const u = easeInOutCubic(progress(time, from.time, to.time))
      return {
        time,
        x: from.x + (to.x - from.x) * u,
        y: from.y + (to.y - from.y) * u,
        scale: from.scale + (to.scale - from.scale) * u,
      }
    }
  }
  return { ...keys[keys.length - 1], time }
}

/**
 * 장면 좌표의 점이 카메라를 거쳐 화면(영상) 어디에 보이는지. 카메라가 보는 곳이
 * 영상 한가운데(`view` 의 절반)에 온다.
 */
export function toView(point: Point, camera: CameraKey, view: { width: number; height: number }): Point {
  return {
    x: view.width / 2 + (point.x - camera.x) * camera.scale,
    y: view.height / 2 + (point.y - camera.y) * camera.scale,
  }
}

/**
 * 출력 영상의 `output` 번째 장에서, 섞기 구간 앞 장면을 얼마나 섞을지 (0~1).
 *
 * 마지막 장에서 정확히 1 이 되어, 그 장이 곧 첫 장의 바로 앞 장면이 된다.
 */
export function loopBlendWeight(output: number, loopFrames: number, blendFrames: number) {
  const start = loopFrames - blendFrames
  if (output < start) return 0
  return clamp01((output - start + 1) / blendFrames)
}

/**
 * 씨앗을 고정한 난수 (mulberry32).
 *
 * 깜빡임 간격과 음표 자리는 앱에서 `Math.random` 으로 정한다. 그대로 찍으면 다시 뜰
 * 때마다 영상이 달라져 커밋마다 상관없는 이진 diff 가 생기므로, 찍는 동안만 바꿔 끼운다.
 */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
