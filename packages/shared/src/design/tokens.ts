/**
 * `tokens.css` 와 같은 값을 TS 로.
 *
 * CSS 변수를 읽을 수 없는 자리 — canvas 나 three.js 처럼 색을 숫자로 넘겨야 하는 곳 —
 * 를 위해 둔다. **한쪽을 고치면 다른 쪽도 함께 고친다.** 어긋나면 같은 캐릭터의 색이
 * 화면마다 조금씩 달라지는데, 눈으로는 잘 안 보여서 한참 뒤에야 드러난다.
 */

export const CHARACTER_COLORS = {
  cat: { main: '#f4a64a', light: '#fbf7f1' },
  dog: { main: '#c98a5e', light: '#f1dcc0' },
  panda: { main: '#2a2a2e', light: '#f6f6f3' },
  duck: { main: '#ffd84a', light: '#fff3c2' },
  bunny: { main: '#f19bc0', light: '#fbe3ee' },
} as const

export const SIGNAL_COLOR = '#ffd84d'
export const SLEEP_Z_COLOR = '#5b6bb5'
export const ONLINE_COLOR = '#6fc48a'
export const AWAY_COLOR = '#c9c2b6'

/** 신호 하나가 도는 길이(초). 앱의 동작 길이에 맞춘다 */
export const SIGNAL_DURATION_S = 1.7
