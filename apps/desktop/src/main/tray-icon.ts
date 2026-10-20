/**
 * 메뉴바(트레이) 아이콘을 어느 파일로 할지.
 *
 * 맥은 검정 한 벌을 **템플릿 이미지**로 넘긴다 — 운영체제가 메뉴바 색(밝음 · 어두움 · 배경
 * 화면 색에 물든 반투명)에 맞춰 스스로 뒤집어 그린다. 그래서 다크 모드를 따로 볼 필요가 없다.
 *
 * 윈도우와 리눅스에는 템플릿이 없다. 검정 한 벌을 그대로 두면 어두운 작업 표시줄에서
 * 아이콘이 사라지므로, 시스템이 어두운 테마면 흰색 판을 쓴다. 테마가 바뀌면 `tray.ts` 가
 * 다시 골라 갈아 끼운다.
 *
 * 파일은 `scripts/make-app-icon.js` 가 로고(`renderer/icon/logo.ts`)에서 그려 둔다.
 */

export interface TrayIconChoice {
  /** `assets/` 안의 파일 이름. `@2x` 판은 같은 폴더에서 Electron 이 알아서 찾는다 */
  file: string
  /** 맥에서 템플릿 이미지로 다룰지 */
  template: boolean
}

export function chooseTrayIcon(platform: NodeJS.Platform, darkTheme: boolean): TrayIconChoice {
  if (platform === 'darwin') return { file: 'trayTemplate.png', template: true }
  return { file: darkTheme ? 'trayDark.png' : 'trayTemplate.png', template: false }
}
