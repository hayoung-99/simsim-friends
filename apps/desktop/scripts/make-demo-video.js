/**
 * 랜딩 히어로의 데모 영상을 만든다.
 *
 *   npm run demo-video            한국어 · 영어 두 벌
 *   npm run demo-video -- en      하나만
 *   npm run demo-video -- --keep-frames    프레임 PNG 를 .preview/demo-video/ 에 남긴다
 *
 * 앱과 같은 캐릭터 코드로 그린 장면(`src/renderer/demo-video/`)을 띄워 60fps 로 한 장씩
 * 넘기며 캡처하고, ffmpeg 로 MP4(H.264 · 사파리) 와 WebM(VP9 · 나머지) 두 벌로 묶는다.
 * 첫 장은 포스터로, 춤 한가운데 장은 움직임을 줄인 사람에게 보여 줄 한 장으로 함께 뽑는다.
 * 산출물은 커밋한다.
 *
 * **ffmpeg 가 있어야 한다** (`brew install ffmpeg`). 저장소 의존성이 아니라 이 영상을
 * 다시 뜨는 사람에게만 필요한 도구라서 package.json 에 넣지 않았다.
 *
 * 영상 속 글씨가 구워져 들어가므로 언어마다 한 벌씩 뜬다. 한국어 페이지에 영어 영상이
 * 걸리면 화면 이름부터 어긋난다.
 */

const fs = require('node:fs')
const path = require('node:path')
const { spawnSync } = require('node:child_process')
const { app, BrowserWindow, nativeImage } = require('electron')

const ROOT = path.join(__dirname, '..')
const PAGE = path.join(ROOT, 'dist-renderer', 'demo-video', 'index.html')
const OUT_DIR = path.join(ROOT, '..', 'web', 'public', 'assets')
// 프레임 PNG 는 수백 MB 라 저장소 밖(.gitignore 의 .preview/)에 두고, 다 묶으면 지운다
const WORK_DIR = path.join(ROOT, '.preview', 'demo-video')

/** 장면은 640x440 으로 그린다. 화면 배율 2 로 찍어 이 크기가 된다 (배율이 다르면 맞춰 줄인다) */
const SCENE = { width: 640, height: 440 }
const FRAME = { width: 1280, height: 880 }

const READY_TIMEOUT_MS = 15000
const LANGS = ['ko', 'en']

/**
 * 화질. 바탕이 단색에 가까워 잘 눌리므로 둘 다 넉넉하게 준다. H.264 의 18 은 눈으로
 * 원본과 구별이 안 되는 쪽이고, VP9 의 30 이 그와 비슷하다.
 */
const MP4_CRF = '18'
const WEBM_CRF = '30'

const only = process.argv.slice(2).filter((arg) => !arg.startsWith('-'))
const langs = only.length ? LANGS.filter((lang) => only.includes(lang)) : LANGS

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const kb = (bytes) => `${Math.round(bytes / 1024)}KB`

function ffmpeg(args) {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' })
  if (result.error) throw new Error('ffmpeg 를 찾을 수 없습니다. `brew install ffmpeg` 로 설치하세요')
  if (result.status !== 0) throw new Error(`ffmpeg 가 실패했습니다 (${result.status})`)
}

async function waitForReady(window) {
  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    const ready = await window.webContents.executeJavaScript(
      `document.body.getAttribute('data-ready') === 'true'`,
    )
    if (ready) return
    await wait(120)
  }
  throw new Error('장면이 준비됐다고 알려오지 않았습니다 (렌더 실패?)')
}

/** 포스터 화질. 영상의 첫 장이 그대로 보이는 자리라 영상보다 거칠면 바뀌는 순간 티가 난다 */
const WEBP_QUALITY = 0.9

/** PNG 를 WebP 로. 크로뮴이 이미 가진 인코더를 빈 창에서 부른다 */
async function encodeWebp(encoder, png) {
  const base64 = await encoder.webContents.executeJavaScript(`(async () => {
    const response = await fetch('data:image/png;base64,${png.toString('base64')}')
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
  if (bytes.length < 32) throw new Error('WebP 로 옮기지 못했습니다')
  return bytes
}

/** 두 장을 `weight` 만큼 섞는다. 둘 다 불투명이라 BGRA 를 칸마다 그대로 섞으면 된다 */
function mix(current, earlier, weight) {
  const out = Buffer.allocUnsafe(current.length)
  for (let index = 0; index < current.length; index += 1) {
    out[index] = Math.round(current[index] * (1 - weight) + earlier[index] * weight)
  }
  return out
}

async function record(encoder, lang) {
  const work = path.join(WORK_DIR, lang)
  fs.rmSync(work, { recursive: true, force: true })
  fs.mkdirSync(work, { recursive: true })

  const window = new BrowserWindow({
    ...SCENE,
    useContentSize: true,
    show: true,
    frame: false,
    resizable: false,
    backgroundColor: '#f6eddc',
    webPreferences: { backgroundThrottling: false },
  })
  await window.loadFile(PAGE, { search: `lang=${lang}` })
  await waitForReady(window)

  const plan = await window.webContents.executeJavaScript(
    '({ total: demo.total, blend: demo.blend, loop: demo.loop, still: demo.still, weights: demo.weights })',
  )

  // 섞기 구간의 앞 장면들. 마지막 장들이 여기로 서서히 넘어가 첫 장과 이어진다
  const earlier = []
  for (let captured = 0; captured < plan.total; captured += 1) {
    await window.webContents.executeJavaScript(`demo.seekFrame(${captured})`)
    let image = await window.capturePage()
    const size = image.getSize()
    if (size.width !== FRAME.width || size.height !== FRAME.height) {
      image = image.resize({ ...FRAME, quality: 'best' })
    }

    if (captured < plan.blend) {
      earlier[captured] = image.toBitmap()
      continue
    }

    const output = captured - plan.blend
    const weight = plan.weights[output]
    /*
     * **모든 장을 같은 길(비트맵 → PNG)로 저장한다.** 캡처한 그림을 곧장 `toPNG()` 하면
     * 디스플레이 색 공간으로 바뀐 값이 들어가는데 ffmpeg 는 그 색 정보를 버려서, 노랑
     * `#ffc83d` 가 물 빠진 (245, 201, 88) 로 찍혔다. 이음매를 섞는 장만 비트맵을 거쳐 제
     * 색으로 나와서, 반복이 돌아오는 순간 바탕화면 노랑이 연했다 진해졌다 했다.
     */
    const bitmap = image.toBitmap()
    const pixels = weight > 0 ? mix(bitmap, earlier[captured - plan.loop], weight) : bitmap
    const png = nativeImage.createFromBitmap(pixels, FRAME).toPNG()
    fs.writeFileSync(path.join(work, `f${String(output).padStart(4, '0')}.png`), png)
    if (output % 60 === 0) process.stdout.write(`\r${lang}: ${output}/${plan.loop}`)
  }
  window.destroy()
  process.stdout.write(`\r${lang}: ${plan.loop}/${plan.loop}\n`)

  const frames = path.join(work, 'f%04d.png')
  // 페이지는 sRGB 다. 색 정보를 bt709 로 적어 두어야 사파리와 크롬이 바탕색을 같게 그린다
  const color = [
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
  ]
  const outputs = {
    mp4: path.join(OUT_DIR, `demo-${lang}.mp4`),
    webm: path.join(OUT_DIR, `demo-${lang}.webm`),
    poster: path.join(OUT_DIR, `demo-${lang}-poster.webp`),
    still: path.join(OUT_DIR, `demo-${lang}-still.webp`),
  }

  ffmpeg([
    '-framerate', '60', '-i', frames,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', MP4_CRF, '-pix_fmt', 'yuv420p', ...color,
    // 받는 도중에도 재생이 시작되도록 색인을 앞에 둔다
    '-movflags', '+faststart', '-an', outputs.mp4,
  ])
  ffmpeg([
    '-framerate', '60', '-i', frames,
    '-c:v', 'libvpx-vp9', '-crf', WEBM_CRF, '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2',
    '-pix_fmt', 'yuv420p', ...color, '-an', outputs.webm,
  ])
  // brew 의 ffmpeg 에는 WebP 인코더가 없어서 크로뮴의 것을 쓴다 (`make-site-images.js` 와 같은 길)
  const pad = (index) => `f${String(index).padStart(4, '0')}.png`
  fs.writeFileSync(outputs.poster, await encodeWebp(encoder, fs.readFileSync(path.join(work, pad(0)))))
  fs.writeFileSync(outputs.still, await encodeWebp(encoder, fs.readFileSync(path.join(work, pad(plan.still)))))

  // `--keep-frames` 면 프레임을 남겨 둔다. 화질·용량 설정을 바꿔 가며 다시 묶어 볼 때 쓴다
  if (!process.argv.includes('--keep-frames')) fs.rmSync(work, { recursive: true, force: true })
  for (const file of Object.values(outputs)) {
    console.log(`wrote ${path.relative(ROOT, file)}  (${kb(fs.statSync(file).size)})`)
  }
}

void app.whenReady().then(async () => {
  try {
    fs.mkdirSync(OUT_DIR, { recursive: true })
    // 빈 문서에는 CSP 가 없어서 data: 를 그대로 읽을 수 있다
    const encoder = new BrowserWindow({ show: false, width: 200, height: 200 })
    await encoder.loadURL('about:blank')
    for (const lang of langs) await record(encoder, lang)
    encoder.destroy()
    app.exit(0)
  } catch (error) {
    console.error(error)
    app.exit(1)
  }
})

app.on('window-all-closed', () => {})
