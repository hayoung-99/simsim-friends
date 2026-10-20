/**
 * 앱 아이콘 한 장을 그리는 화면. `scripts/make-app-icon.js` 가 이걸 띄워 캡처한다.
 * 앱 동작과는 무관하다 — 배포본에는 들어가지 않는다(package.json 의 files 참고).
 *
 *   ?platform=mac   1024 캔버스 안에 824 판 (애플 아이콘 규격의 여백)
 *   ?platform=win   판이 캔버스를 꽉 채운다 (Windows · 파비콘)
 *   ?platform=touch 모서리를 깎지 않은 정사각형 (아이폰 홈 화면)
 *
 * 그림은 `logo.ts` 의 "빼꼼" 마크다. 예전에는 3D 캐릭터의 얼굴을 클로즈업해 떴는데, 작은
 * 크기에서 무엇인지 읽히는 마크로 바꿨다 (기획서 "앱 아이콘은 빼꼼 마크").
 *
 * 캡처 말고 글자 그대로 필요한 것(Icon Composer 의 그림 겹 · 웹 파비콘 SVG)은
 * `window.iconSources` 로 건네 스크립트가 파일로 쓴다. 모양이 이 한 곳에서만 나오게 하려고
 * 스크립트가 따로 그리지 않는다.
 */

import { DARK, LIGHT, appIconSvg, composerLayerSvg, faviconSvg, squareIconSvg } from './logo'

const platform = new URLSearchParams(location.search).get('platform')

document.body.innerHTML =
  platform === 'touch' ? squareIconSvg(LIGHT) : appIconSvg(LIGHT, platform === 'win' ? 'full' : 'mac')
;(window as unknown as { iconSources: unknown }).iconSources = {
  plateLight: LIGHT.plate,
  plateDark: DARK.plate,
  composerLight: composerLayerSvg(LIGHT, 'light'),
  composerDark: composerLayerSvg(DARK, 'dark'),
  favicon: faviconSvg(),
}

requestAnimationFrame(() => requestAnimationFrame(() => document.body.setAttribute('data-ready', 'true')))
