/**
 * Blender 로 만든 3D 마스코트(glb)를 캐릭터 창에 세운다.
 *
 * 코드로 조립하던 `critter.ts` 대신 뼈와 동작 클립이 든 glb 를 불러오고,
 * `animations.ts` 의 애니메이터와 **같은 모양의 함수들**을 돌려준다. 그래서
 * `pet.ts` 는 몸을 만드는 줄과 애니메이터를 만드는 줄만 바꾸면 된다.
 *
 * 앱의 반응은 glb 에 든 클립으로 옮긴다. 클립은 전부 제자리 동작이고 처음과 끝 자세가
 * 같아서, 몇 번 이어 틀어도 이음매가 보이지 않는다.
 */

import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

/** 화면에서 차지할 높이. `critter.ts` 의 STANDARD_HEIGHT 와 같은 값이어야 말풍선 자리가 맞는다 */
const STANDARD_HEIGHT = 2.0

/** 반응 이름 → [클립, 몇 번 이어 틀지]. 앞의 것이 없으면 뒤의 것을 쓴다 (오리는 귀가 없다) */
const REACTIONS = {
  hop: [['hop', 3]],
  dance: [['dance', 2]],
  wave: [['wave', 1]],
  // 하트 — 두 손을 볼에 대고 살랑이며 볼이 붉어진다. 없는 모델은 예전처럼 갸웃
  shy: [['shy', 1], ['head_tilt', 1]],
  // 앙탈 — 털썩 앉아 다리를 벌려 뻗고 두 팔을 위아래로 휘젓는다. 눈은 > <. 없는 모델은 예전처럼 뒤뚱
  sulk: [['sulk', 1], ['waddle', 3]],
  // 내가 눌렀을 때 — 준비 동작 후 제자리 두 번 뛰기
  twitch: [['poke', 1], ['ear_wiggle', 1], ['clap', 1]],
  // 깨우기 — 몸을 일으켜 앉았다가 기지개를 켜며 일어선다. 없는 모델은 예전처럼 만세
  wake: [['wake', 1], ['cheer', 1]],
} as const satisfies Record<string, readonly (readonly [string, number])[]>

type Reaction = keyof typeof REACTIONS

/** 잠들기·자는 중 클립이 없는 모델은 숨쉬기를 이만큼 느리게 틀고 몸을 살짝 눌러 둔다 */
const SLEEP_TIME_SCALE = 0.35
const SLEEP_SQUASH = 0.93
const FADE = 0.2

export interface Mascot {
  root: THREE.Group
  height: number
  model: THREE.Object3D
  clips: THREE.AnimationClip[]
}

/*
 * glb 는 앱 크기를 줄이려고 메시를 meshopt 로 압축하고 텍스처를 WebP 로 담아 내보낸다.
 * 압축을 푸는 디코더를 꽂지 않으면 불러오기가 오류로 끝나 캐릭터가 아예 뜨지 않는다.
 */
const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder)

/** 페이지가 `dist-renderer/pet/` 에 있고 glb 는 `dist-renderer/mascots/` 에 복사된다 */
export async function loadMascot(key: string): Promise<Mascot> {
  const gltf = await loader.loadAsync(`../mascots/${key}.glb`)
  const model = gltf.scene
  model.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) object.castShadow = true
  })
  // root.position·scale 은 pet.ts 가 클릭 영역을 잴 때 건드리므로 모델을 한 겹 감싼다
  const root = new THREE.Group()
  root.add(model)
  root.updateMatrixWorld(true)
  const bounds = new THREE.Box3().setFromObject(root)
  return { root, model, clips: gltf.animations, height: bounds.max.y - bounds.min.y }
}

export const scaleMascot = (mascot: { height: number }) => STANDARD_HEIGHT / mascot.height

/** 텍스처까지 GPU 에서 되돌린다. glb 의 텍스처는 장마다 몇 MB 라 남기면 금방 쌓인다 */
export function disposeMascot(mascot: Mascot) {
  mascot.root.traverse((object) => {
    const mesh = object as THREE.Mesh
    if (!mesh.isMesh) return
    mesh.geometry.dispose()
    for (const material of [mesh.material].flat() as THREE.MeshStandardMaterial[]) {
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) value.dispose()
      }
      material.dispose()
    }
  })
  mascot.root.removeFromParent()
}

export function createMascotAnimator(mascot: Mascot) {
  const mixer = new THREE.AnimationMixer(mascot.model)
  const byName = new Map(mascot.clips.map((clip) => [clip.name, clip]))
  const idleClip = byName.get('idle') ?? mascot.clips[0]
  const idle = mixer.clipAction(idleClip)
  idle.play()

  let current: { name: Reaction; action: THREE.AnimationAction } | null = null
  let sleeping = false
  /*
   * 재우기는 두 클립이다 — 옆으로 엎드리는 `doze` 를 한 번 틀고, 끝나면 그 자세로 숨쉬는
   * `sleep` 을 반복한다. 깨울 때까지 `sleep` 이 돌아야 하므로 반응(current)과 따로 든다.
   */
  const dozeClip = byName.get('doze')
  const sleepClip = byName.get('sleep')
  let sleepAction: THREE.AnimationAction | null = null
  let dozing = false

  function backToIdle() {
    if (!current) return
    idle.reset().play()
    current.action.crossFadeTo(idle, FADE, false)
    current = null
  }

  mixer.addEventListener('finished', (event) => {
    if (dozing && sleepAction && event.action === sleepAction) {
      // 다 엎드렸다 — 같은 자세로 숨쉬는 반복으로 넘어간다
      dozing = false
      const loop = mixer.clipAction(sleepClip!)
      loop.reset().setLoop(THREE.LoopRepeat, Infinity).play()
      sleepAction.crossFadeTo(loop, FADE, false)
      sleepAction = loop
      return
    }
    if (current && event.action === current.action) backToIdle()
  })

  function play(name: Reaction) {
    const choice = REACTIONS[name].find(([clip]) => byName.has(clip))
    if (!choice) return
    const [clipName, times] = choice
    const action = mixer.clipAction(byName.get(clipName)!)
    action.reset()
    action.setLoop(THREE.LoopRepeat, times)
    action.clampWhenFinished = true
    action.play()
    const from = current?.action ?? sleepAction ?? idle
    if (sleepAction && from === sleepAction) sleepAction = null
    if (from !== action) from.crossFadeTo(action, FADE, false)
    current = { name, action }
  }

  const is = (name: Reaction) => current?.name === name

  function setSleeping(next: boolean) {
    sleeping = next
    idle.timeScale = next ? SLEEP_TIME_SCALE : 1
    mascot.model.scale.y = next ? SLEEP_SQUASH : 1
  }

  return {
    hop: () => play('hop'),
    dance: () => play('dance'),
    wave: () => play('wave'),
    shy: () => play('shy'),
    sulk: () => play('sulk'),
    /** 내가 누른 움찔은 다른 반응 위에 겹치지 않는다 — 이미 무언가 하고 있으면 건너뛴다 */
    twitch: () => {
      if (!current) play('twitch')
    },
    /** 앱을 켰을 때 이미 재워 둔 방이면 엎드리는 과정 없이 자는 자세부터 튼다 */
    doze: ({ instant = false }: { instant?: boolean } = {}) => {
      if (!dozeClip || !sleepClip) {
        if (current) backToIdle()
        setSleeping(true)
        return
      }
      sleeping = true
      const from = current?.action ?? sleepAction ?? idle
      current = null
      const next = mixer.clipAction(instant ? sleepClip : dozeClip)
      next.reset()
      if (instant) next.setLoop(THREE.LoopRepeat, Infinity)
      else { next.setLoop(THREE.LoopOnce, 1); next.clampWhenFinished = true }
      next.play()
      if (from !== next) from.crossFadeTo(next, instant ? 0 : FADE, false)
      sleepAction = next
      dozing = !instant
    },
    wake: () => {
      setSleeping(false)
      dozing = false
      play('wake')
    },
    stop: () => {
      if (sleepAction) {
        idle.reset().play()
        sleepAction.crossFadeTo(idle, FADE, false)
        sleepAction = null
      }
      dozing = false
      backToIdle()
      setSleeping(false)
    },
    update: (delta: number) => mixer.update(delta),
    dispose: () => {
      mixer.stopAllAction()
      mixer.uncacheRoot(mascot.model)
    },
    get isHopping() {
      return is('hop')
    },
    get isDancing() {
      return is('dance')
    },
    get isTwitching() {
      return is('twitch')
    },
    get isWaving() {
      return is('wave')
    },
    get isShying() {
      return is('shy')
    },
    get isSulking() {
      return is('sulk')
    },
    get isAsleep() {
      return sleeping
    },
    get isDozing() {
      return dozing
    },
    get isWaking() {
      return is('wake')
    },
  }
}
