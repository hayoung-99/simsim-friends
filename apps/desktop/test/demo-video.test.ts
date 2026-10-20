/**
 * 랜딩 데모 영상의 시간표와 계산 부분.
 */

import { describe, it, expect } from 'vitest'
import {
  BLEND_SECONDS,
  BUBBLE_SECONDS,
  DANCE_SETTLE_SECONDS,
  FPS,
  LOOP_SECONDS,
  NAMEPLATE_SECONDS,
  SHY_SETTLE_SECONDS,
  TOTAL_FRAMES,
  TO_FRIEND,
  TO_ME,
  ZOOM,
  bezierPoint,
  cameraAt,
  easeInOutCubic,
  easeOutBack,
  frameTime,
  loopBlendWeight,
  progress,
  seededRandom,
  toView,
} from '../src/renderer/demo-video/timeline'
import type { Leg } from '../src/renderer/demo-video/timeline'

describe('시간표', () => {
  const inOrder = (leg: Leg) => {
    expect(leg.cursorIn).toBeLessThan(leg.cursorAt)
    expect(leg.cursorAt).toBeLessThanOrEqual(leg.press)
    expect(leg.press).toBeLessThan(leg.launch)
    expect(leg.launch).toBeLessThan(leg.land)
    // 커서는 카메라가 그 화면을 떠난 뒤(신호가 떠난 뒤)에 치운다
    expect(leg.cursorGone).toBeGreaterThan(leg.launch)
    expect(leg.cursorGone).toBeLessThan(leg.land)
  }

  it('한 번 건너가는 일은 앱의 순서대로 — 누르고, 떠나고, 닿는다', () => {
    inOrder(TO_FRIEND)
    inOrder(TO_ME)
  })

  it('다가간 뒤에 처음 누른다', () => {
    expect(ZOOM.inDone).toBeLessThanOrEqual(TO_FRIEND.cursorIn)
  })

  it('강아지 춤이 거의 끝난 뒤에 친구가 누르러 온다', () => {
    expect(TO_ME.cursorIn).toBeGreaterThanOrEqual(TO_FRIEND.land + NAMEPLATE_SECONDS)
    expect(TO_ME.press).toBeGreaterThanOrEqual(TO_FRIEND.land + DANCE_SETTLE_SECONDS)
  })

  it('수줍음과 이름표가 끝난 뒤에 물러난다', () => {
    expect(ZOOM.out).toBeGreaterThanOrEqual(TO_ME.land + Math.max(SHY_SETTLE_SECONDS, NAMEPLATE_SECONDS))
  })

  it('움직이는 것은 섞기 구간이 오기 전에 다 끝난다', () => {
    expect(ZOOM.outDone).toBeLessThanOrEqual(LOOP_SECONDS - BLEND_SECONDS)
    expect(TO_ME.press + BUBBLE_SECONDS).toBeLessThan(LOOP_SECONDS - BLEND_SECONDS)
  })

  it('섞기 구간만큼 0초 앞에서부터 찍는다', () => {
    expect(frameTime(0)).toBeCloseTo(-BLEND_SECONDS)
    expect(frameTime(BLEND_SECONDS * FPS)).toBeCloseTo(0)
    expect(frameTime(TOTAL_FRAMES - 1)).toBeCloseTo(LOOP_SECONDS - 1 / FPS)
  })
})

describe('progress', () => {
  it('구간 안에서는 0~1, 밖에서는 끝값에 붙는다', () => {
    expect(progress(0, 1, 2)).toBe(0)
    expect(progress(1.5, 1, 2)).toBeCloseTo(0.5)
    expect(progress(3, 1, 2)).toBe(1)
  })

  it('길이가 0 인 구간은 계단이다', () => {
    expect(progress(0.9, 1, 1)).toBe(0)
    expect(progress(1, 1, 1)).toBe(1)
  })
})

describe('곡선', () => {
  it('양 끝이 0 과 1 이다', () => {
    for (const ease of [easeInOutCubic, easeOutBack]) {
      expect(ease(0)).toBeCloseTo(0)
      expect(ease(1)).toBeCloseTo(1)
    }
  })

  it('튀어나오는 곡선은 도중에 1 을 넘는다', () => {
    expect(Math.max(...[0.6, 0.7, 0.8, 0.9].map(easeOutBack))).toBeGreaterThan(1)
  })

  it('베지어는 양 끝점을 지난다', () => {
    const from = { x: 0, y: 10 }
    const to = { x: 100, y: 20 }
    const control = { x: 50, y: -40 }
    expect(bezierPoint(from, control, to, 0)).toEqual(from)
    expect(bezierPoint(from, control, to, 1)).toEqual(to)
    // 조절점이 위에 있으니 가운데는 두 끝보다 높이 뜬다
    expect(bezierPoint(from, control, to, 0.5).y).toBeLessThan(10)
  })
})

describe('loopBlendWeight', () => {
  const loop = LOOP_SECONDS * FPS
  const blend = BLEND_SECONDS * FPS

  it('섞기 구간 앞에서는 섞지 않는다', () => {
    expect(loopBlendWeight(0, loop, blend)).toBe(0)
    expect(loopBlendWeight(loop - blend - 1, loop, blend)).toBe(0)
  })

  it('마지막 장에서 정확히 앞 장면이 된다', () => {
    expect(loopBlendWeight(loop - 1, loop, blend)).toBe(1)
  })

  it('갈수록 커진다', () => {
    let previous = 0
    for (let output = loop - blend; output < loop; output += 1) {
      const weight = loopBlendWeight(output, loop, blend)
      expect(weight).toBeGreaterThan(previous)
      previous = weight
    }
  })
})

describe('seededRandom', () => {
  it('같은 씨앗이면 같은 수열이 나온다', () => {
    const a = seededRandom(7)
    const b = seededRandom(7)
    expect(Array.from({ length: 5 }, b)).toEqual(Array.from({ length: 5 }, a))
  })

  it('0 이상 1 미만이다', () => {
    const next = seededRandom(42)
    for (let index = 0; index < 1000; index += 1) {
      const value = next()
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('카메라', () => {
  const view = { width: 640, height: 440 }
  const keys = [
    { time: 1, x: 320, y: 220, scale: 1 },
    { time: 2, x: 100, y: 200, scale: 2 },
  ]

  it('카메라는 열쇠 밖에서는 끝 열쇠에 머문다', () => {
    expect(cameraAt(0, keys)).toMatchObject({ x: 320, scale: 1 })
    expect(cameraAt(5, keys)).toMatchObject({ x: 100, scale: 2 })
  })

  it('카메라는 열쇠 사이를 곡선으로 잇는다 — 한가운데는 정확히 절반', () => {
    expect(cameraAt(1.5, keys)).toMatchObject({ x: 210, y: 210, scale: 1.5 })
    expect(cameraAt(1.25, keys).x).toBeGreaterThan(210)
  })

  it('카메라가 보는 곳이 영상 한가운데에 온다', () => {
    const camera = { time: 0, x: 100, y: 50, scale: 2 }
    expect(toView({ x: 100, y: 50 }, camera, view)).toEqual({ x: 320, y: 220 })
    expect(toView({ x: 110, y: 50 }, camera, view)).toEqual({ x: 340, y: 220 })
  })

  it('배율 1 에 한가운데를 보면 그대로다', () => {
    expect(toView({ x: 12, y: 34 }, { time: 0, x: 320, y: 220, scale: 1 }, view)).toEqual({ x: 12, y: 34 })
  })
})
