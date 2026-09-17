/**
 * 랜딩 페이지에 넣을 그림을 앱과 같은 캐릭터로 그린다.
 * `scripts/make-site-images.js` 가 이 화면을 띄워 캡처한다. 배포본에는 들어가지 않는다.
 *
 *   ?shot=hero        고양이 한 마리, 배경 없음
 *   ?shot=characters  5종 나란히, 배경 없음
 *   ?shot=og          공유 카드 (글 + 5종)
 *   ?shot=peek-panda  판다가 정면을 본 채 오른쪽으로 기운다 (랜딩 왼쪽 위)
 *   ?shot=peek-bunny  토끼가 정면을 본 채 왼쪽으로 기운다   (랜딩 오른쪽 가운데)
 *   ?shot=peek-dog    강아지가 정면을 본 채 오른쪽으로 기운다 (랜딩 왼쪽 아래)
 *   ?shot=peek-duck   오리가 정면을 본 채 왼쪽으로 기운다    (랜딩 오른쪽 네 번째)
 *   ?shot=peek-cat    고양이가 정면을 본 채 오른쪽으로 기운다 (랜딩 왼쪽 다섯 번째)
 */

import * as THREE from 'three'
import { CHARACTERS, getCharacter } from '@simsim-friends/shared/characters'
import { createCritter, scaleToStandardHeight } from '../pet/critter'
import { addLighting, createShadowCatcher } from '../pet/scene'
import { createAnimator, DANCE_CYCLES } from '../pet/animations'
import type { TrackName } from '../pet/animations'
import type { CharacterSpec } from '@simsim-friends/shared/characters'

/** 한 장면을 어떻게 세우고 어디서 볼지 (아래 주석에 항목별 뜻이 있다) */
interface ShotLayout {
  specs: CharacterSpec[]
  spacing: number
  headroom: number
  lift: number
  yaw: number
  roll?: number
  panX?: number
  spanX?: number
}

const shot = new URLSearchParams(location.search).get('shot') ?? 'hero'
document.body.dataset.shot = shot

/**
 * 화면마다 캐릭터를 어떻게 세우고 어디를 볼지.
 *
 *   headroom  세로로 얼마나 넓게 담을지 (작을수록 가까이 당긴다)
 *   lift      카메라와 시선을 얼마나 올릴지 (얼굴을 담으려면 올린다)
 *   yaw       캐릭터를 얼마나 돌릴지 (+ 가 오른쪽을 보는 쪽)
 *   roll      캐릭터를 얼마나 기울일지 (+ 가 머리를 왼쪽으로 눕히는 쪽)
 *   panX      카메라를 좌우로 얼마나 옮길지. 눕히면 머리가 한쪽으로 쏠리므로
 *             그만큼 따라가서 얼굴을 화면 가운데로 되돌린다
 *   spanX     가로로 담을 폭. 없으면 캐릭터 수에서 알아서 정한다
 */
const LAYOUTS: Record<string, ShotLayout> = {
  hero: { specs: [getCharacter('cat')], spacing: 0, headroom: 1.35, lift: 0.0, yaw: -0.24 },

  /*
   * 랜딩의 "눌러 보면 이렇게 돼요" 장면에 서는 짝.
   *
   * 왼쪽 창이 내 화면, 오른쪽 창이 친구 화면이라 **서로 다른 종이어야** 한다 —
   * 같은 종을 두 번 쓰면 화면 둘이 아니라 같은 그림 둘로 보이고, 방마다 다른
   * 캐릭터를 고르는 제품의 성질도 함께 사라진다.
   *
   * `hero` 와 달리 정면을 본다(`yaw: 0`). 작은 창 안에 들어가는 그림이라 조금만
   * 돌려도 얼굴이 옆으로 달아나고, 이 장면에서 읽혀야 하는 것은 자세가 아니라
   * **둘이 같은 일을 겪고 있다**는 것이다.
   */
  'duo-cat': { specs: [getCharacter('cat')], spacing: 0, headroom: 1.3, lift: 0.0, yaw: 0 },
  'duo-bunny': { specs: [getCharacter('bunny')], spacing: 0, headroom: 1.3, lift: 0.0, yaw: 0 },

  /*
   * 춤 스프라이트 시트용. **`duo-bunny` 와 값이 같아야 한다.**
   *
   * 랜딩에서 이 그림이 정지 그림이 서 있던 바로 그 자리에 갈아 끼워지므로, 구도가
   * 한 뼘이라도 다르면 춤이 시작되는 순간 캐릭터가 튄다. 값을 손볼 일이 생기면
   * 위와 여기를 **함께** 고칠 것.
   */
  'duo-bunny-dance': { specs: [getCharacter('bunny')], spacing: 0, headroom: 1.3, lift: 0.0, yaw: 0 },
  characters: { specs: CHARACTERS, spacing: 2.3, headroom: 1.28, lift: 0.0, yaw: -0.2 },
  // 공유 카드는 캔버스 자체가 오른쪽 아래로 밀려 있다 (index.html 참고)
  og: { specs: CHARACTERS, spacing: 2.3, headroom: 1.24, lift: 0.0, yaw: -0.2 },

  /*
   * 빼꼼 — 모서리 뒤에서 몸을 기울여 얼굴을 내민 자세.
   *
   * 기울기(roll)가 이 자세의 전부다. 똑바로 선 캐릭터를 가장자리로 자르면 그냥
   * 잘린 그림이지만, 기대는 쪽으로 눕혀 놓으면 벽 뒤에서 내다보는 것이 된다.
   * 그래서 화면 왼쪽에 설 아이는 오른쪽으로, 오른쪽에 설 아이는 왼쪽으로 눕는다.
   * 몸이 잘리는 방향과 기우는 방향이 어긋나면 자세가 무너지니 짝을 바꾸지 말 것.
   *
   * **얼굴은 기울여도 정면을 본다** (`yaw: 0`). 한때 고개까지 옆으로 돌려
   * 놓았는데, 그러면 눈 하나와 볼터치 하나가 뒤로 넘어가 표정이 절반만 남는다.
   * 기울기만으로도 빼꼼해 보이므로 시선까지 돌릴 이유가 없다.
   *
   * 얼굴만 크게 담고 싶더라도 **캐릭터 전체가 그림 안에 들어와야 한다.** 발이
   * 그림 아래 모서리에 걸리면 랜딩페이지에서 몸통이 평평한 가로선으로 잘려
   * 보인다. 잘리는 곳은 화면 가장자리 하나여야 하고, 그건 세로선이다.
   * 얼굴을 키우는 일은 여기서가 아니라 style.css 에서 크게 걸고 많이 물리는
   * 방식으로 한다.
   *
   * 정면을 보면 옆으로 돌렸을 때보다 몸통 폭이 넓다. spanX 1.6 에 판다가 좌우
   * 10~20px 남기고 겨우 들어가므로, roll 을 더 눕히거나 headroom 을 줄이려면
   * 먼저 알파 여백부터 재 볼 것.
   */
  'peek-panda': {
    specs: [getCharacter('panda')],
    spacing: 0,
    headroom: 1.04,
    lift: 0.021,
    yaw: 0,
    roll: -0.34,
    panX: 0.365,
    spanX: 1.6,
  },
  // 토끼는 귀가 길어서 눕히면 더 넓게 잡아야 귀 끝이 살아난다.
  'peek-bunny': {
    specs: [getCharacter('bunny')],
    spacing: 0,
    headroom: 1.02,
    lift: 0.153,
    yaw: 0,
    roll: 0.36,
    panX: -0.098,
    spanX: 1.6,
  },
  // 강아지는 귀가 늘어져서 기울이면 귀가 먼저 쏠린다. 그 맛으로 쓴다.
  'peek-dog': {
    specs: [getCharacter('dog')],
    spacing: 0,
    headroom: 1.04,
    lift: 0.023,
    yaw: 0,
    roll: -0.3,
    panX: 0.251,
    spanX: 1.6,
  },
  // 오리는 귀가 없어서 세로가 짧다. 더 당겨야 얼굴이 다른 넷과 같은 크기로 보인다.
  'peek-duck': {
    specs: [getCharacter('duck')],
    spacing: 0,
    headroom: 0.94,
    lift: 0.069,
    yaw: 0,
    roll: 0.34,
    panX: -0.117,
    spanX: 1.6,
  },
  'peek-cat': {
    specs: [getCharacter('cat')],
    spacing: 0,
    headroom: 1.04,
    lift: 0.022,
    yaw: 0,
    roll: -0.34,
    panX: 0.287,
    spanX: 1.6,
  },
}

const LAYOUT = LAYOUTS[shot]
if (!LAYOUT) throw new Error(`[site-assets] 모르는 샷 이름입니다: ${shot}`)

const canvas = document.getElementById('stage') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
renderer.setClearColor(0x000000, 0)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()
addLighting(scene)

/*
 * 빼꼼 샷은 얼굴만 담아서 바닥이 보이지 않는다. 그런데도 그림자 받이를 두면
 * 옅은 그림자가 알파에 남고, 랜딩페이지에서 그 위에 drop-shadow 를 얹는 순간
 * 캐릭터가 아니라 네모가 하나 떠오른다.
 */
if (!shot.startsWith('peek-')) scene.add(createShadowCatcher(30))

// 연속 촬영이 애니메이터를 물리려면 캐릭터를 손에 들고 있어야 해서 `map` 으로 받는다.
const critters = LAYOUT.specs.map((spec, index) => {
  const critter = createCritter(spec)
  const stand = new THREE.Group()
  stand.position.x = (index - (LAYOUT.specs.length - 1) / 2) * LAYOUT.spacing
  // 촬영장(`preview` 의 촬영장 탭)과 같은 순서여야 거기서 맞춘 각도가 그대로 나온다.
  stand.rotation.order = 'ZYX'
  stand.rotation.y = LAYOUT.yaw
  stand.rotation.z = LAYOUT.roll ?? 0
  stand.scale.setScalar(scaleToStandardHeight(critter))
  stand.add(critter.root)
  scene.add(stand)
  return critter
})

const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 60)

/**
 * 가로로 다 들어오면서 위아래로도 잘리지 않게 카메라를 뒤로 뺀다.
 * 창 비율이 바뀌어도 캐릭터 크기가 일정하도록 두 조건 중 먼 쪽을 쓴다.
 */
function frame() {
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  renderer.setSize(width, height, false)
  camera.aspect = width / height

  const halfFov = THREE.MathUtils.degToRad(camera.fov / 2)
  const spanX = LAYOUT.spanX ?? Math.max(LAYOUT.spacing * LAYOUT.specs.length, 2.6)
  const spanY = 2.0 * LAYOUT.headroom // 캐릭터 키는 2.0 (STANDARD_HEIGHT)

  const forWidth = spanX / 2 / (Math.tan(halfFov) * camera.aspect)
  const forHeight = spanY / 2 / Math.tan(halfFov)

  const panX = LAYOUT.panX ?? 0
  camera.position.set(panX, 1.05 + LAYOUT.lift, Math.max(forWidth, forHeight) + 1)
  camera.lookAt(panX, 0.95 + LAYOUT.lift, 0)
  camera.updateProjectionMatrix()
  renderer.render(scene, camera)
}

/*
 * 연속 촬영용 창구 — `scripts/make-site-images.js` 가 프레임마다 부른다.
 *
 * `scrub` 을 쓰는 것이 핵심이다. 시간을 굴리지 않고 그 시각의 자세를 곧바로 바르므로
 * (`pet/animations.ts` 의 `scrub` 이 끝에서 `update(0)` 을 부른다) **렌더 루프가 없는
 * 이 화면에서도** 쓸 수 있고, 무엇보다 같은 `t` 를 주면 언제나 같은 그림이 나온다.
 * 커밋해 두는 산출물이라 다시 뜰 때마다 결과가 달라지면 안 된다.
 *
 * 같은 이유로 음표·먼지 같은 연출은 담지 않는다. 그것들은 물리로 흩어지는 것이라
 * 시각 하나만으로 되돌릴 수 없다.
 *
 * 캐릭터가 하나인 샷에만 창구를 연다. 여럿이 선 샷은 누구를 움직일지가 정해지지
 * 않아서, 부르면 `undefined` 로 실패하는 편이 조용히 엉뚱한 그림을 내는 것보다 낫다.
 */
declare global {
  interface Window {
    /** 그 동작의 `t` 초 자세로 세우고 한 장 그린다 */
    __poseAt?: (track: TrackName, t: number) => void
    /** 그 동작 **한 바퀴**의 길이(초). 스크립트가 프레임 간격을 이 값에서 셈한다 */
    __lapDuration?: (track: TrackName) => number
  }
}

if (critters.length === 1) {
  const animator = createAnimator(critters[0])

  window.__poseAt = (track, t) => {
    animator.scrub(track, t)
    frame()
  }

  /*
   * 춤은 유닛 한 바퀴를 `DANCE_CYCLES` 번 이어 붙여 쓰므로 `durations.dance` 가
   * 돌려주는 것은 **이어 붙인 전체 길이**다. 시트에는 한 바퀴만 담으니 여기서
   * 나눠 준다. 나누는 수를 스크립트 쪽에 옮겨 적지 않는 이유는, 그러면 같은 숫자가
   * 두 곳에 생겨 한쪽만 고쳐질 수 있기 때문이다.
   *
   * 폴짝도 `HOP_COUNT` 번 이어 붙이는 동작이라, 폴짝 시트를 만들게 되면 여기에
   * 같은 처리를 더해야 한다.
   */
  window.__lapDuration = (track) =>
    track === 'dance' ? animator.durations.dance / DANCE_CYCLES : animator.durations[track]
}

frame()

requestAnimationFrame(() => {
  frame()
  requestAnimationFrame(() => document.body.setAttribute('data-ready', 'true'))
})
