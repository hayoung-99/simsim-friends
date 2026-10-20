/**
 * 랜딩 데모 영상의 시간표와 계산 부분.
 *
 * Three.js 도 DOM 도 부르지 않는다 — 언제 무엇이 일어나는지, 그 사이를 어떤 곡선으로
 * 잇는지, 반복 이음매를 어떻게 섞는지만 정한다. 그래서 `test/demo-video.test.ts` 가
 * 브라우저 없이 지킨다.
 */

/** 초당 장수. 춤과 신호가 좌우로 크게 오가는 영상이라 30 이면 끊겨 보인다. */
export const FPS = 60

/** 한 바퀴 길이(초). 끝 장면이 첫 장면으로 이어져 반복된다. */
export const LOOP_SECONDS = 6

/**
 * 반복 이음매를 섞는 길이(초).
 *
 * 숨쉬기·깜빡임은 서로 맞지 않는 주기로 돌아서 6초 뒤의 자세가 처음과 같지 않다. 그래서
 * 0초보다 이만큼 앞에서부터 찍어 두고, 마지막 이만큼을 그 앞 장면 쪽으로 서서히 섞는다.
 * 그러면 마지막 장은 첫 장 바로 앞 장면이 되어 이음매가 사라진다.
 */
export const BLEND_SECONDS = 0.5

/**
 * 일이 일어나는 시각(초). 앱의 순서를 그대로 따른다 — 누르면 움찔과 말풍선
 * (`pet.ts` 의 `tapSelf`), 신호가 닿으면 춤·음표·이름표(`tapReceived`).
 *
 * 춤(1.7초)과 마지막 음표(약 2.5초)가 다 끝난 뒤에도 섞기 구간 전까지 쉬는 틈이 있어야
 * 이음매에 움직이던 것이 반쯤 섞여 유령처럼 보이지 않는다.
 */
export const CUES = {
  /** 커서가 화면 밖에서 들어오기 시작 */
  cursorIn: 0.35,
  /** 커서가 고양이에 닿음 */
  cursorAt: 0.95,
  /** 누름 — 움찔 · 말풍선 · 물결 */
  press: 1.05,
  /** 신호가 떠남 */
  launch: 1.3,
  /** 신호가 닿음 — 춤 · 음표 · 이름표 */
  land: 2.1,
  /** 커서가 비켜나기 시작 */
  cursorAway: 1.45,
  /** 커서가 화면 밖으로 나가기 시작 */
  cursorOut: 4.3,
  /** 커서가 다 나감 */
  cursorGone: 5.0,
} as const

/** 말풍선이 떠 있는 시간(초). `pet/bubble.ts` 의 `SHOW_MS` 와 같다. */
export const BUBBLE_SECONDS = 1.4

/** 이름표가 떠 있는 시간(초). `pet/nameplate.ts` 의 `LIFE_MS` 와 같다. */
export const NAMEPLATE_SECONDS = 2

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
