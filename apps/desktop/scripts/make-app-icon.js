/**
 * 앱 아이콘을 코드로 만든다.
 *
 *   npm run app-icon
 *
 * "빼꼼" 마크(`src/renderer/icon/logo.ts`)를 그려 한 장을 뜨고, 거기서 플랫폼별 아이콘
 * 파일을 파생시킨다. 이미지 편집기가 필요 없고, 마크를 고치면 다시 돌리기만 하면 된다.
 *
 * **바탕은 노랑이 기본이고, macOS 다크 모드에서는 검정이다.** 다크 모드에 따라 바뀌는
 * 앱 아이콘은 macOS 26 의 Icon Composer 형식(`.icon`)으로만 만들 수 있어서, 그 묶음을
 * 만들어 Xcode 의 `actool` 로 `Assets.car` 를 컴파일해 둔다. 앱은 그 파일을 품고 나간다
 * (package.json 의 `mac.extraResources` · `CFBundleIconName`). 다크 모드를 모르는
 * 곳(Windows · Linux · macOS 25 이하)은 노랑 한 벌을 쓴다.
 *
 * 만드는 것
 *   build/Icon.icon/           Icon Composer 원본 (노랑 · 검정 두 모습)
 *   build/Assets.car           그것을 컴파일한 것 — macOS 26 의 아이콘 (Xcode 가 있어야 한다)
 *   build/icon.icns            macOS 25 이하의 아이콘 (iconutil, macOS 에서만)
 *   build/icon.ico             Windows 앱 아이콘
 *   build/icon.png             Linux 앱 아이콘 (512)
 *   assets/trayTemplate*.png   메뉴바 아이콘 — 검정. 맥은 템플릿으로 써서 메뉴바 색에 맞춰 뒤집는다
 *   assets/trayDark*.png       메뉴바 아이콘 — 흰색. 윈도우 · 리눅스의 어두운 작업 표시줄용
 *   ../web/public/assets/icon.svg       랜딩 파비콘 — 브라우저가 다크 모드면 검정
 *   ../web/public/assets/icon-*.png     랜딩 파비콘(32) · 아이폰 홈 화면(180)
 *   ../web/public/favicon.ico           랜딩 파비콘 (구형 브라우저)
 *
 * 산출물은 저장소에 커밋한다. CI 러너(Xcode 판이 다를 수 있다)에서 그리고 컴파일하는
 * 것보다 훨씬 안정적이고, 빌드가 그림 그리는 일에 기대지 않게 된다.
 */

const fs = require('node:fs')
const path = require('node:path')
const { execFileSync } = require('node:child_process')
const { app, BrowserWindow, nativeImage } = require('electron')

const ROOT = path.join(__dirname, '..')
const PAGE = path.join(ROOT, 'dist-renderer', 'icon', 'index.html')
const BUILD_DIR = path.join(ROOT, 'build')
const ASSETS_DIR = path.join(ROOT, 'assets')

/**
 * 메뉴바 아이콘 두 벌. 크기는 1x(22) 와 2x(44) — `nativeImage.createFromPath` 가 이름의
 * `@2x` 를 보고 화면 배율에 맞는 쪽을 고른다. 파일 이름은 `main/tray-icon.ts` 와 짝이다.
 */
const TRAY_ICONS = [
  { base: 'trayTemplate', color: '#000000' },
  { base: 'trayDark', color: '#ffffff' },
]
const TRAY_SIZES = [
  [22, ''],
  [44, '@2x'],
]
// 랜딩은 이웃 워크스페이스다. ROOT 가 apps/desktop 이므로 한 칸 올라가 건너간다
const WEB_PUBLIC = path.join(ROOT, '..', 'web', 'public')
const WEB_ASSETS = path.join(WEB_PUBLIC, 'assets')

const CANVAS = 1024
const READY_TIMEOUT_MS = 15000

/** macOS 가 .icns 안에 기대하는 이름과 크기 */
const ICONSET = [
  ['icon_16x16.png', 16],
  ['icon_16x16@2x.png', 32],
  ['icon_32x32.png', 32],
  ['icon_32x32@2x.png', 64],
  ['icon_128x128.png', 128],
  ['icon_128x128@2x.png', 256],
  ['icon_256x256.png', 256],
  ['icon_256x256@2x.png', 512],
  ['icon_512x512.png', 512],
  ['icon_512x512@2x.png', 1024],
]

const ICO_SIZES = [16, 24, 32, 48, 64, 128, 256]
const FAVICON_SIZES = [16, 32, 48]

// ── 렌더 ──────────────────────────────────────────────────

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** 화면이 다 그려졌다고 알릴 때까지 기다린다 */
async function waitForReady(window) {
  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    const ready = await window.webContents.executeJavaScript(
      `document.body.getAttribute('data-ready') === 'true'`,
    )
    if (ready) return
    await wait(120)
  }
  throw new Error('아이콘 화면이 준비됐다고 알려오지 않았습니다 (렌더 실패?)')
}

/**
 * 아이콘 한 장을 1024×1024 로 뜬다.
 * 창은 투명해야 한다 — 판(둥근 사각형) 바깥이 비어 있어야 아이콘이 제 모양이 된다.
 */
async function shoot(platform, withSources = false) {
  const window = new BrowserWindow({
    width: CANVAS,
    height: CANVAS,
    useContentSize: true,
    show: true,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: false,
    webPreferences: { backgroundThrottling: false },
  })

  await window.loadFile(PAGE, { search: `platform=${platform}` })
  await waitForReady(window)

  const captured = await window.capturePage()
  const sources = withSources ? await window.webContents.executeJavaScript('window.iconSources') : null
  window.destroy()

  const resized = captured.resize({ width: CANVAS, height: CANVAS, quality: 'best' })
  if (resized.isEmpty()) throw new Error(`${platform} 아이콘 캡처가 비어 있습니다`)
  /*
   * 비트맵을 거쳐 다시 만든다. 캡처를 곧장 PNG 로 쓰면 디스플레이 색 공간으로 바뀐 값이
   * 들어가서, 노랑 #ffc83d 가 물 빠진 색으로 찍힌다 (데모 영상의 `make-demo-video.js` 가
   * 같은 일을 겪었다).
   */
  const image = nativeImage.createFromBitmap(resized.toBitmap(), { width: CANVAS, height: CANVAS })
  return withSources ? { image, sources } : image
}

// ── 메뉴바 아이콘 ─────────────────────────────────────────

/**
 * 메뉴바 아이콘을 그린다. 창을 캡처하지 않고 화면 쪽 캔버스가 정확히 그 화소로 그려 준
 * RGBA 를 받는다 (`renderer/icon/icon.ts` 의 `rasterizeTray`). 색은 검정 아니면 흰색 하나라
 * 색 공간이 끼어들 여지가 없다.
 */
async function writeTrayIcons(write) {
  const window = new BrowserWindow({ show: false, width: 200, height: 200 })
  await window.loadFile(PAGE)
  await waitForReady(window)
  for (const { base, color } of TRAY_ICONS) {
    for (const [size, suffix] of TRAY_SIZES) {
      const rgba = Buffer.from(
        await window.webContents.executeJavaScript(`rasterizeTray(${size}, '${color}')`),
        'base64',
      )
      // nativeImage 는 알파를 곱해 둔 BGRA 를 받는다. 캔버스는 곱하지 않은 RGBA 를 주므로
      // 빨강 · 파랑 자리를 바꾸고 알파를 곱한다 (안 곱하면 흰 아이콘의 가장자리가 번진다)
      for (let index = 0; index < rgba.length; index += 4) {
        const alpha = rgba[index + 3] / 255
        const red = rgba[index]
        rgba[index] = Math.round(rgba[index + 2] * alpha)
        rgba[index + 1] = Math.round(rgba[index + 1] * alpha)
        rgba[index + 2] = Math.round(red * alpha)
      }
      write(path.join(ASSETS_DIR, `${base}${suffix}.png`), nativeImage.createFromBitmap(rgba, { width: size, height: size }).toPNG())
    }
  }
  window.destroy()
}

// ── Icon Composer ─────────────────────────────────────────

/** '#ffc83d' → Icon Composer 가 적는 색 'srgb:1.00000,0.78431,0.23922,1.00000' */
function composerColor(hex) {
  const channels = [1, 3, 5].map((at) => (parseInt(hex.slice(at, at + 2), 16) / 255).toFixed(5))
  return `srgb:${channels.join(',')},1.00000`
}

/**
 * Icon Composer 묶음(`build/Icon.icon`)을 쓴다. **이름이 `Icon` 이어야 한다** — `actool` 의
 * `--app-icon` 이름과 묶음 이름이 다르면 오류 없이 아무것도 만들지 않고 끝난다. 그 이름이
 * 곧 Info.plist 의 `CFBundleIconName` 이다 (package.json).
 * 판은 묶음이 칠하고(밝을 때 노랑 · 어두울
 * 때 검정), 그 위에 마크 한 겹을 올린다. 마크도 모습마다 색이 달라서 그림을 둘 둔다.
 *
 * Liquid Glass 의 유리 효과(반투명 · 그림자)는 끈다 — 마크가 선 그림이라 유리처럼 비치면
 * 테두리가 흐려진다.
 */
function writeIconComposer(sources) {
  const bundle = path.join(BUILD_DIR, 'Icon.icon')
  fs.rmSync(bundle, { recursive: true, force: true })
  fs.mkdirSync(path.join(bundle, 'Assets'), { recursive: true })
  fs.writeFileSync(path.join(bundle, 'Assets', 'mark-light.svg'), sources.composerLight)
  fs.writeFileSync(path.join(bundle, 'Assets', 'mark-dark.svg'), sources.composerDark)
  const manifest = {
    'fill-specializations': [
      { value: { solid: composerColor(sources.plateLight) } },
      { appearance: 'dark', value: { solid: composerColor(sources.plateDark) } },
    ],
    groups: [
      {
        layers: [
          {
            name: 'mark',
            'image-name-specializations': [
              { value: 'mark-light.svg' },
              { appearance: 'dark', value: 'mark-dark.svg' },
            ],
          },
        ],
        shadow: { kind: 'none', opacity: 0.5 },
        translucency: { enabled: false, value: 0.5 },
      },
    ],
    'supported-platforms': { squares: ['macOS'] },
  }
  fs.writeFileSync(path.join(bundle, 'icon.json'), `${JSON.stringify(manifest, null, 2)}\n`)
  return bundle
}

/**
 * `actool` 로 `Assets.car` 를 컴파일한다. Xcode 26 이상이 있어야 `.icon` 을 읽는다.
 * 없으면 이미 커밋된 `Assets.car` 를 그대로 두고 알린다 — 그 파일이 낡았을 수 있다.
 */
function compileAssetCatalog(bundle) {
  const out = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'simsim-icon-'))
  try {
    execFileSync('xcrun', [
      'actool', bundle,
      '--compile', out,
      '--platform', 'macosx',
      '--minimum-deployment-target', '11.0',
      '--app-icon', 'Icon',
      '--output-partial-info-plist', path.join(out, 'partial.plist'),
    ], { stdio: 'ignore' })
    const car = path.join(out, 'Assets.car')
    // 이름이 어긋나거나 형식을 못 읽으면 actool 은 실패하지 않고 빈손으로 끝난다
    if (!fs.existsSync(car)) throw new Error('actool 이 Assets.car 를 만들지 않았습니다')
    fs.copyFileSync(car, path.join(BUILD_DIR, 'Assets.car'))
    return true
  } catch (error) {
    console.warn(`건너뜀: build/Assets.car — Xcode 26 이상의 actool 이 있어야 만들 수 있습니다 (${error.message})`)
    return false
  } finally {
    fs.rmSync(out, { recursive: true, force: true })
  }
}

/** 판 바깥이 정말 투명한지 왼쪽 위 구석 한 점으로 확인한다 */
function assertTransparentCorner(image, platform) {
  const bitmap = image.getBitmap() // BGRA
  const alpha = bitmap[3]
  if (alpha !== 0) {
    throw new Error(
      `${platform} 아이콘의 모서리가 불투명합니다(alpha=${alpha}). ` +
        '투명 창 캡처가 실패한 것으로 보입니다.',
    )
  }
}

const resize = (image, size) =>
  image.resize({ width: size, height: size, quality: 'best' }).toPNG()

// ── ICO 만들기 ────────────────────────────────────────────

/**
 * ICO 파일을 만든다.
 *
 * Vista 이후의 ICO 는 PNG 를 그대로 품을 수 있다. 그래서 헤더(6바이트)와
 * 항목(16바이트씩)만 앞에 붙이면 끝이고, 비트맵을 직접 인코딩할 필요가 없다.
 */
function encodeIco(pngsBySize) {
  const entries = [...pngsBySize.entries()].sort((a, b) => a[0] - b[0])

  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // 예약
  header.writeUInt16LE(1, 2) // 1 = 아이콘
  header.writeUInt16LE(entries.length, 4)

  const directory = Buffer.alloc(16 * entries.length)
  let offset = header.length + directory.length

  entries.forEach(([size, png], index) => {
    const at = index * 16
    directory[at] = size >= 256 ? 0 : size // 256 은 0 으로 적는 것이 규칙이다
    directory[at + 1] = size >= 256 ? 0 : size
    directory[at + 2] = 0 // 팔레트 색 수 (트루컬러라 0)
    directory[at + 3] = 0 // 예약
    directory.writeUInt16LE(1, at + 4) // 색 평면
    directory.writeUInt16LE(32, at + 6) // 픽셀당 비트
    directory.writeUInt32LE(png.length, at + 8)
    directory.writeUInt32LE(offset, at + 12)
    offset += png.length
  })

  return Buffer.concat([header, directory, ...entries.map(([, png]) => png)])
}

const icoFrom = (image, sizes) =>
  encodeIco(new Map(sizes.map((size) => [size, resize(image, size)])))

// ── 실행 ──────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(BUILD_DIR, { recursive: true })
  fs.mkdirSync(WEB_ASSETS, { recursive: true })

  const { image: mac, sources } = await shoot('mac', true)
  const win = await shoot('win')
  const touch = await shoot('touch')
  assertTransparentCorner(mac, 'mac')

  const written = []
  const write = (file, data) => {
    fs.writeFileSync(file, data)
    written.push(path.relative(ROOT, file))
  }

  // macOS 26 — 다크 모드에 따라 바뀌는 아이콘
  const bundle = writeIconComposer(sources)
  written.push(path.relative(ROOT, bundle))
  if (process.platform === 'darwin' && compileAssetCatalog(bundle)) {
    written.push(path.relative(ROOT, path.join(BUILD_DIR, 'Assets.car')))
  }

  // macOS 25 이하 — iconutil 은 macOS 에만 있다
  if (process.platform === 'darwin') {
    const iconset = path.join(BUILD_DIR, 'icon.iconset')
    fs.rmSync(iconset, { recursive: true, force: true })
    fs.mkdirSync(iconset)
    for (const [name, size] of ICONSET) {
      fs.writeFileSync(path.join(iconset, name), resize(mac, size))
    }
    const icns = path.join(BUILD_DIR, 'icon.icns')
    execFileSync('iconutil', ['-c', 'icns', iconset, '-o', icns])
    fs.rmSync(iconset, { recursive: true, force: true })
    written.push(path.relative(ROOT, icns))
  } else {
    console.warn('건너뜀: build/icon.icns 는 macOS 에서만 만들 수 있습니다 (iconutil)')
  }

  // 메뉴바
  await writeTrayIcons(write)

  // Windows / Linux
  write(path.join(BUILD_DIR, 'icon.ico'), icoFrom(win, ICO_SIZES))
  write(path.join(BUILD_DIR, 'icon.png'), resize(mac, 512))

  // 랜딩 페이지 — 파비콘은 작게 쓰이므로 여백 없는 win 판이 또렷하다
  write(path.join(WEB_ASSETS, 'icon.svg'), sources.favicon)
  write(path.join(WEB_ASSETS, 'icon-180.png'), resize(touch, 180)) // apple-touch-icon
  write(path.join(WEB_ASSETS, 'icon-32.png'), resize(win, 32))
  write(path.join(WEB_PUBLIC, 'favicon.ico'), icoFrom(win, FAVICON_SIZES))

  for (const file of written) console.log(`wrote ${file}`)
}

void app.whenReady().then(async () => {
  try {
    await main()
    app.exit(0)
  } catch (error) {
    console.error(error)
    app.exit(1)
  }
})

app.on('window-all-closed', () => {})
