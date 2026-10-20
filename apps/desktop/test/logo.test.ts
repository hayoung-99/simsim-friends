/**
 * "빼꼼" 로고의 모양과 색.
 */

import { describe, it, expect } from 'vitest'
import {
  CAT_AXIS,
  CAT_PATH,
  DARK,
  EYES,
  LIGHT,
  appIconSvg,
  composerLayerSvg,
  faviconSvg,
  markBody,
  squareIconSvg,
} from '../src/renderer/icon/logo'

/** 경로 문자열에서 좌표 쌍만 뽑는다 */
function points(path: string) {
  const numbers = path.match(/-?\d+(\.\d+)?/g)!.map(Number)
  const pairs: [number, number][] = []
  for (let index = 0; index < numbers.length; index += 2) pairs.push([numbers[index], numbers[index + 1]])
  return pairs
}

describe('고양이 윤곽', () => {
  it('좌우 대칭이다 — 점마다 축 건너편에 짝이 있다', () => {
    const all = points(CAT_PATH)
    for (const [x, y] of all) {
      const mirrored = 2 * CAT_AXIS - x
      expect(all.some(([ox, oy]) => Math.abs(ox - mirrored) < 1e-9 && Math.abs(oy - y) < 1e-9)).toBe(true)
    }
  })

  it('이음매에서 꺾이지 않는다 — 귀 끝 곡선의 조절점이 앞뒤 직선과 같은 방향이다', () => {
    // 귀 바깥 선(46.5,58.5 → 48.6,51.3)과 귀 끝 곡선의 첫 조절점(49.3,48.9)
    const edge = Math.atan2(51.3 - 58.5, 48.6 - 46.5)
    const handle = Math.atan2(48.9 - 51.3, 49.3 - 48.6)
    expect(Math.abs(edge - handle)).toBeLessThan(0.02)
    // 귀 안쪽 선(51.8,50.2 → 56.5,54.8)과 정수리 곡선의 첫 조절점(59.5,57.8)
    const inner = Math.atan2(54.8 - 50.2, 56.5 - 51.8)
    const valley = Math.atan2(57.8 - 54.8, 59.5 - 56.5)
    expect(Math.abs(inner - valley)).toBeLessThan(0.03)
  })

  it('눈 둘도 같은 축에 대칭이다', () => {
    expect(EYES[0].cx + EYES[1].cx).toBeCloseTo(2 * CAT_AXIS)
    expect(EYES[0].cy).toBe(EYES[1].cy)
  })
})

describe('색', () => {
  it('밝은 판은 랜딩의 노란 포인트 색이다', () => {
    expect(LIGHT.plate).toBe('#ffc83d')
  })

  it('밝은 판과 어두운 판은 마크 색까지 서로 다르다', () => {
    expect(DARK.plate).not.toBe(LIGHT.plate)
    expect(DARK.mark.ink).not.toBe(LIGHT.mark.ink)
    expect(DARK.mark.cat).not.toBe(LIGHT.mark.cat)
  })

  it('그린 그림에 그 색이 그대로 들어간다', () => {
    const svg = appIconSvg(LIGHT, 'mac')
    expect(svg).toContain(LIGHT.plate)
    expect(svg).toContain(LIGHT.mark.ink)
    expect(svg).toContain(LIGHT.mark.cat)
    expect(composerLayerSvg(DARK, 'dark')).toContain(DARK.mark.cat)
    expect(squareIconSvg(LIGHT)).toContain(LIGHT.plate)
  })
})

describe('여러 벌', () => {
  it('클립과 마스크 이름이 벌마다 달라 한 문서에 함께 둘 수 있다', () => {
    const a = markBody(LIGHT.mark, 'a')
    const b = markBody(LIGHT.mark, 'b')
    expect(a).toContain('id="screen-a"')
    expect(b).toContain('id="screen-b"')
    expect(a).not.toContain('screen-b')
  })

  it('파비콘은 다크 모드에서 어두운 판으로 바뀐다', () => {
    const svg = faviconSvg()
    expect(svg).toContain('prefers-color-scheme: dark')
    const [light, dark] = svg.split('@media')
    expect(light).toContain(LIGHT.plate)
    expect(dark).toContain(DARK.plate)
    expect(dark).toContain(DARK.mark.cat)
    // 색을 속성으로 박으면 미디어 쿼리가 못 바꾼다
    expect(svg).not.toContain('currentColor')
  })
})
