/**
 * 랜딩 페이지에 넣을 그림을 만든다.
 *
 *   npm run site-images                    전부 다시 뜬다
 *   npm run site-images -- peek-panda      하나만 다시 뜬다
 *   npm run site-images -- --webp-only     뜨지 않고 WebP 만 다시 만든다
 *
 * 앱과 같은 캐릭터 코드로 그리므로(`src/renderer/site-assets/`), 캐릭터가 바뀌면
 * 다시 돌리기만 하면 랜딩 페이지의 그림도 따라온다. 산출물은 커밋한다.
 *
 * 방 창 스크린샷은 여기서 만들지 않는다. 진짜 앱을 띄워서 찍어야 하기 때문이다.
 * 랜딩페이지는 **한국어와 영어 두 장**을 쓰므로 둘 다 떠야 한다. 한쪽만 새로 뜨면
 * 두 페이지의 화면이 서로 다른 버전을 보여주게 된다.
 *
 * 예시 방 이름은 언어마다 그 나라에서 자연스러운 것으로 둔다. 음차한 이름을 넣으면
 * 읽는 사람이 그 이름부터 해석하느라 정작 보여주려던 화면이 눈에 안 들어온다.
 *
 *   SIMSIM_FAKE_NET=1 SIMSIM_PROFILE=shot SIMSIM_CAPTURE=.preview/ko \
 *     SIMSIM_SEED="나오리와 친구들:나영" SIMSIM_LANG=ko npm start
 *   cp .preview/ko/team.png apps/web/public/assets/team-window.png
 *
 *   SIMSIM_FAKE_NET=1 SIMSIM_PROFILE=shot SIMSIM_CAPTURE=.preview/en \
 *     SIMSIM_SEED="Naori & friends:Nayoung" SIMSIM_LANG=en npm start
 *   cp .preview/en/team.png apps/web/public/assets/team-window-en.png
 *
 * **그렇게 옮겨 둔 뒤 `-- --webp-only` 를 한 번 돌린다.** 랜딩이 거는 것은 WebP 라,
 * PNG 를 그 자리에 두는 것만으로는 화면이 바뀌지 않는다. 옮기고 나면 PNG 는 지운다
 * (원본은 `.preview/` 에 그대로 남아 있다).
 */

const fs = require('node:fs')
const path = require('node:path')
const { app, BrowserWindow } = require('electron')

const ROOT = path.join(__dirname, '..')
const PAGE = path.join(ROOT, 'dist-renderer', 'site-assets', 'index.html')
// 그림은 앱 코드로 그리지만 쓰이는 곳은 랜딩이다. ROOT 가 apps/desktop 이므로
// 한 칸 올라가 이웃 워크스페이스로 건너간다.
const OUT_DIR = path.join(ROOT, '..', 'web', 'public', 'assets')

const READY_TIMEOUT_MS = 15000

/**
 * 어떤 그림을 어느 크기로 뜰지.
 *
 * **화면에 걸릴 크기의 두 배로 뜬다.** 요즘 노트북은 대부분 화소가 두 배라, 걸릴
 * 크기 그대로 만들면 가장자리가 뭉개져 보인다. 빼꼼 그림은 1900px 이상에서 가장
 * 크게 걸리므로(`globals.css` 의 두 번째 구간) 그 폭의 두 배가 기준이다.
 *
 *   판다·강아지·고양이 300px → 612    토끼 370px → 748    오리 335px → 680
 *
 * 가로세로 비는 340:460, 즉 17:23 이어야 한다. `.peek` 이 `aspect-ratio: 340/460`
 * 칸에 `background-size: contain` 으로 넣기 때문에, 비가 어긋나면 남는 쪽에 여백이
 * 생기면서 캐릭터가 그만큼 작아진다. 그래서 크기는 17과 23의 배수로만 고른다.
 *
 * **확장자가 곧 형식이다.** `.webp` 면 WebP 로, `.png` 면 PNG 로 저장한다.
 * 두 배로 뜨면 PNG 는 넉 배로 무거워지는데, WebP 로 담으면 5분의 1 안팎이라
 * **또렷해지면서 오히려 가벼워진다.** 알파가 있는 그림도 담을 수 있어서 캐릭터에
 * 쓸 수 있다.
 *
 * `og.png` 만 PNG 로 남긴다. 링크 미리보기를 만드는 쪽(슬랙·카카오·X)에는 WebP 를
 * 못 읽는 곳이 아직 있어서, 공유 카드는 가장 무던한 형식으로 둔다.
 */
const SHOTS = [
  { shot: 'hero', file: 'hero-cat.webp', width: 760, height: 900, transparent: true },
  { shot: 'characters', file: 'characters.webp', width: 1760, height: 460, transparent: true },
  // "눌러 보면 이렇게 돼요" 장면의 두 창. 화면에 130px 안팎으로 걸리므로 두 배로 뜬다
  { shot: 'duo-cat', file: 'duo-cat.webp', width: 320, height: 380, transparent: true },
  { shot: 'duo-bunny', file: 'duo-bunny.webp', width: 320, height: 380, transparent: true },
  { shot: 'og', file: 'og.png', width: 1200, height: 630, transparent: false },
  { shot: 'peek-panda', file: 'peek-panda.webp', width: 612, height: 828, transparent: true },
  { shot: 'peek-bunny', file: 'peek-bunny.webp', width: 748, height: 1012, transparent: true },
  { shot: 'peek-dog', file: 'peek-dog.webp', width: 612, height: 828, transparent: true },
  { shot: 'peek-duck', file: 'peek-duck.webp', width: 680, height: 920, transparent: true },
  { shot: 'peek-cat', file: 'peek-cat.webp', width: 612, height: 828, transparent: true },
]

/**
 * 동작 한 바퀴를 프레임으로 나눠 찍어 **격자 한 장**에 담는 것들 (스프라이트 시트).
 *
 * 랜딩의 "눌러 보면 이렇게 돼요" 장면에서 춤을 흉내가 아니라 앱이 실제로 쓰는
 * 동작으로 보여 주려고 둔다. 동영상이 아니라 정지 그림 한 장인 것이 핵심이다 —
 * Safari 는 WebM 의 알파를 살려 주지 않고, `<img>` 로 얹은 애니메이션 WebP 는
 * 재생 시점을 잡을 수 없어 **누르는 것과 춤추는 것의 인과가 깨진다.** 시트는
 * `steps()` 로 CSS 가 직접 넘기므로 그 타이밍을 랜딩이 쥔다.
 *
 * **한 바퀴만 담는다.** `DANCE_UNIT` 은 시작과 끝의 값이 같은 완벽한 루프라
 * (`pet/animations.ts` 의 `buildDanceTimeline` 이 이 유닛을 그대로 이어 붙인다),
 * 두 바퀴를 담으면 같은 그림이 두 벌 들어가 용량만 두 배가 된다.
 *
 * 마지막 칸에 `t = 한 바퀴` 를 넣지 않는 이유도 같다 — 그 자세는 첫 칸과 같다.
 *
 *   frames   한 바퀴를 몇 칸으로 나눌지. 12 칸이면 0.84초에 약 14fps
 *   columns  격자의 가로 칸 수
 *
 * **한 줄로 담는다 (`columns === frames`).** 격자로 접으면 CSS 에서 칸을 넘길 수가
 * 없다 — `translateX(%)` 는 그 요소 **자신의 너비**를 기준으로 재기 때문에, 4열로
 * 접는 순간 가로 25%·세로 33.3% 를 따로 움직여야 하고 `steps()` 하나로는 표현되지
 * 않는다. 한 줄이면 한 칸이 정확히 `100% / frames` 라 `steps(frames)` 하나로 끝난다.
 * 화소 수는 어느 쪽이든 같다.
 */
const SHEETS = [
  {
    shot: 'duo-bunny-dance',
    file: 'duo-bunny-dance.webp',
    track: 'dance',
    frames: 12,
    columns: 12,
    width: 320,
    height: 380,
  },
]

/** 앱을 띄워 손으로 찍어 온 것들. 여기서는 형식만 바꿔 준다 (`--webp-only`). */
const HAND_MADE = ['team-window', 'team-window-en']

/** 무손실이 아니다. 0.9 면 캐릭터의 부드러운 면에서 티가 나지 않는다. */
const WEBP_QUALITY = 0.9

/**
 * 이름을 대면 그것만 다시 뜬다. 하나를 손보는데 나머지 그림까지 새로 쓰이면
 * 커밋에 상관없는 이진 파일이 딸려 오기 때문이다.
 */
const args = process.argv.slice(2)
const webpOnly = args.includes('--webp-only')
const only = args.filter((arg) => !arg.startsWith('-'))
const targets = webpOnly ? [] : only.length ? SHOTS.filter((s) => only.includes(s.shot)) : SHOTS
const sheetTargets = webpOnly ? [] : only.length ? SHEETS.filter((s) => only.includes(s.shot)) : SHEETS

if (!webpOnly && !targets.length && !sheetTargets.length) {
  console.error(`그런 그림이 없습니다: ${only.join(', ')}`)
  console.error(
    `고를 수 있는 것: ${[...SHOTS, ...SHEETS].map((s) => s.shot).join(', ')}`,
  )
  process.exit(1)
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function waitForReady(window) {
  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    const ready = await window.webContents.executeJavaScript(
      `document.body.getAttribute('data-ready') === 'true'`,
    )
    if (ready) return
    await wait(120)
  }
  throw new Error('그림이 준비됐다고 알려오지 않았습니다 (렌더 실패?)')
}

/**
 * PNG 바이트를 WebP 로 옮긴다.
 *
 * 인코더를 새로 들이지 않고 크로뮴이 이미 갖고 있는 것을 쓴다 — 빈 창에서
 * `OffscreenCanvas.convertToBlob` 을 부르면 된다. 그림을 통째로 base64 로 주고받는
 * 것이 곱게 보이지는 않지만, 랜딩 그림은 한 장에 몇백 KB 라 한 번 도는 데 문제가 없다.
 */
async function encodeWebp(encoder, png) {
  const encoded = png.toString('base64')
  const base64 = await encoder.webContents.executeJavaScript(`(async () => {
    const response = await fetch('data:image/png;base64,${encoded}')
    const bitmap = await createImageBitmap(await response.blob())
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
    canvas.getContext('2d').drawImage(bitmap, 0, 0)
    const blob = await canvas.convertToBlob({ type: 'image/webp', quality: ${WEBP_QUALITY} })
    const bytes = new Uint8Array(await blob.arrayBuffer())
    let binary = ''
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
    }
    return btoa(binary)
  })()`)

  const bytes = Buffer.from(base64, 'base64')
  // 크로뮴이 WebP 를 못 만들면 빈 문자열이 돌아온다. 그걸 그대로 쓰면 페이지에
  // 깨진 그림이 걸리므로 여기서 멈춘다.
  if (bytes.length < 32) throw new Error('WebP 로 옮기지 못했습니다')
  return bytes
}

const kb = (bytes) => `${Math.round(bytes / 1024)}KB`

async function capture(encoder, { shot, file, width, height, transparent }) {
  const window = new BrowserWindow({
    width,
    height,
    useContentSize: true,
    show: true,
    frame: false,
    transparent,
    backgroundColor: transparent ? '#00000000' : '#f5efe1',
    resizable: false,
    webPreferences: { backgroundThrottling: false },
  })

  await window.loadFile(PAGE, { search: `shot=${shot}` })
  await waitForReady(window)
  // 창이 화면에 실제로 합성될 틈을 준다. 이게 없으면 빈 화면이 찍히는 때가 있다.
  await wait(400)

  const image = await window.capturePage()
  window.destroy()

  if (image.isEmpty()) throw new Error(`${shot} 캡처가 비어 있습니다`)

  /*
   * 창을 띄운 화면의 배율과 무관하게 늘 같은 크기로 저장한다. 화소가 두 배인
   * 화면에서는 여기서 절반으로 줄어드는데, 줄이면서 계단이 고르게 눌리므로
   * 오히려 가장자리가 곱다.
   */
  const png = image.resize({ width, height, quality: 'best' }).toPNG()
  const bytes = file.endsWith('.webp') ? await encodeWebp(encoder, png) : png

  const target = path.join(OUT_DIR, file)
  fs.writeFileSync(target, bytes)
  console.log(`wrote ${path.relative(ROOT, target)}  (${width}x${height}, ${kb(bytes.length)})`)
}

/**
 * 시트를 만드는 세 걸음 — 격자를 열고, 프레임을 한 칸씩 얹고, 굽는다.
 *
 * 프레임을 전부 모아 한 번에 넘기지 않고 한 장씩 얹는 이유는, 열두 장을 base64 로
 * 이어 붙이면 `executeJavaScript` 에 수백 KB 짜리 문자열이 통째로 들어가기 때문이다.
 * 인코더 창에 격자를 열어 두고 거기에 얹으면 그럴 일이 없다.
 */
async function beginSheet(encoder, { width, height, columns, frames }) {
  const rows = Math.ceil(frames / columns)
  await encoder.webContents.executeJavaScript(`
    globalThis.__sheet = new OffscreenCanvas(${columns * width}, ${rows * height})
    globalThis.__sheetCtx = globalThis.__sheet.getContext('2d')
    true
  `)
}

async function addSheetFrame(encoder, png, { index, width, height, columns }) {
  const encoded = png.toString('base64')
  const x = (index % columns) * width
  const y = Math.floor(index / columns) * height
  await encoder.webContents.executeJavaScript(`(async () => {
    const response = await fetch('data:image/png;base64,${encoded}')
    const bitmap = await createImageBitmap(await response.blob())
    globalThis.__sheetCtx.drawImage(bitmap, ${x}, ${y})
    bitmap.close()
    return true
  })()`)
}

async function encodeSheet(encoder) {
  const base64 = await encoder.webContents.executeJavaScript(`(async () => {
    const blob = await globalThis.__sheet.convertToBlob({ type: 'image/webp', quality: ${WEBP_QUALITY} })
    const bytes = new Uint8Array(await blob.arrayBuffer())
    let binary = ''
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
    }
    return btoa(binary)
  })()`)

  const bytes = Buffer.from(base64, 'base64')
  if (bytes.length < 32) throw new Error('시트를 WebP 로 굽지 못했습니다')
  return bytes
}

/**
 * 동작 한 바퀴를 프레임으로 나눠 찍어 격자 한 장으로 묶는다.
 *
 * 창은 **하나만** 띄우고 그 안에서 자세만 바꿔 가며 찍는다. 프레임마다 창을 새로
 * 만들면 그때마다 첫 합성을 기다려야 해서 훨씬 느려진다.
 */
async function captureSheet(encoder, { shot, file, track, frames, columns, width, height }) {
  const window = new BrowserWindow({
    width,
    height,
    useContentSize: true,
    show: true,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: false,
    webPreferences: { backgroundThrottling: false },
  })

  await window.loadFile(PAGE, { search: `shot=${shot}` })
  await waitForReady(window)
  await wait(400)

  // 한 바퀴 길이는 화면에 물어본다 — 스크립트가 숫자를 따로 갖고 있으면 동작을
  // 손볼 때 한쪽만 고쳐진다.
  const lap = await window.webContents.executeJavaScript(`window.__lapDuration('${track}')`)
  if (!(lap > 0)) throw new Error(`${shot}: 동작 한 바퀴 길이를 못 읽었습니다 (${lap})`)

  await beginSheet(encoder, { width, height, columns, frames })

  for (let index = 0; index < frames; index += 1) {
    // 마지막 칸을 한 바퀴로 꽉 채우지 않는다 — 그 자세는 첫 칸과 같아서 한 칸을 버리게 된다
    const t = (lap * index) / frames
    await window.webContents.executeJavaScript(`window.__poseAt('${track}', ${t}), true`)
    // 자세를 바른 뒤 창에 실제로 합성될 틈을 준다 (정지 샷이 400ms 를 기다리는 것과 같은 이유)
    await wait(150)

    const image = await window.capturePage()
    if (image.isEmpty()) throw new Error(`${shot} 의 ${index}번째 프레임이 비어 있습니다`)
    await addSheetFrame(encoder, image.resize({ width, height, quality: 'best' }).toPNG(), {
      index,
      width,
      height,
      columns,
    })
  }

  window.destroy()

  const bytes = await encodeSheet(encoder)
  const target = path.join(OUT_DIR, file)
  fs.writeFileSync(target, bytes)
  const rows = Math.ceil(frames / columns)
  console.log(
    `wrote ${path.relative(ROOT, target)}  (${frames}칸 ${columns}x${rows}, ` +
      `${columns * width}x${rows * height}, ${kb(bytes.length)})`,
  )
}

/**
 * 손으로 찍어 옮겨 둔 PNG 를 WebP 로 바꾸고 PNG 는 치운다.
 *
 * 치우는 이유는 **둘 다 남으면 어느 쪽이 지금 화면인지 알 수 없기 때문이다.**
 * 랜딩이 거는 것은 WebP 하나뿐이라, 옆에 남은 PNG 는 언제 찍은 것인지 아무도
 * 모르는 채로 저장소만 불린다. 원본은 `.preview/` 에 그대로 있다.
 */
async function convertHandMade(encoder) {
  for (const name of HAND_MADE) {
    const source = path.join(OUT_DIR, `${name}.png`)
    if (!fs.existsSync(source)) {
      console.log(`skip ${name}.png (없음 — 앱을 띄워 찍어 옮겨 두어야 합니다)`)
      continue
    }

    const bytes = await encodeWebp(encoder, fs.readFileSync(source))
    const target = path.join(OUT_DIR, `${name}.webp`)
    fs.writeFileSync(target, bytes)
    fs.unlinkSync(source)
    console.log(`wrote ${path.relative(ROOT, target)}  (${kb(bytes.length)}, PNG 는 지웠습니다)`)
  }
}

void app.whenReady().then(async () => {
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true })

    // 빈 문서에는 CSP 가 없어서 data: 를 그대로 읽을 수 있다. 캡처용 화면을 다시
    // 쓰지 않는 이유가 그것이다.
    const encoder = new BrowserWindow({ show: false, width: 200, height: 200 })
    await encoder.loadURL('about:blank')

    for (const spec of targets) await capture(encoder, spec)
    for (const spec of sheetTargets) await captureSheet(encoder, spec)
    if (webpOnly) await convertHandMade(encoder)
    encoder.destroy()
    app.exit(0)
  } catch (error) {
    console.error(error)
    app.exit(1)
  }
})

app.on('window-all-closed', () => {})
