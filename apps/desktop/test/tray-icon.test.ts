/**
 * 메뉴바 아이콘 고르기.
 */

import { describe, it, expect } from 'vitest'
import { chooseTrayIcon } from '../src/main/tray-icon'

describe('chooseTrayIcon', () => {
  it('맥은 테마와 상관없이 검정 템플릿 한 벌 — 운영체제가 뒤집는다', () => {
    expect(chooseTrayIcon('darwin', false)).toEqual({ file: 'trayTemplate.png', template: true })
    expect(chooseTrayIcon('darwin', true)).toEqual({ file: 'trayTemplate.png', template: true })
  })

  it('윈도우 · 리눅스는 어두운 테마에서 흰색을 쓴다', () => {
    for (const platform of ['win32', 'linux'] as const) {
      expect(chooseTrayIcon(platform, true)).toEqual({ file: 'trayDark.png', template: false })
      expect(chooseTrayIcon(platform, false)).toEqual({ file: 'trayTemplate.png', template: false })
    }
  })
})
