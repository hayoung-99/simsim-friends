/**
 * 캐릭터 선택용 썸네일. 캐릭터 창과 같은 3D 마스코트(glb)로 그린다.
 *
 * 5개의 WebGL 캔버스를 동시에 띄우면 무겁기 때문에, 렌더러 하나로 5종을
 * 차례대로 그려 PNG 데이터 URL로 뽑아 쓴다. 캐릭터 창은 그 이미지를 보여줄 뿐이다.
 *
 * glb 는 비동기로 뜨므로 썸네일도 비동기다. 화면은 `useCharacterThumbnails()` 로 받고,
 * 다 그려지기 전에는 빈 칸이었다가 그려지는 순간 한꺼번에 채워진다.
 */

import * as THREE from 'three'
import { useEffect, useState } from 'react'
import { CHARACTERS } from '@simsim-friends/shared/characters'
import { loadMascot, disposeMascot, scaleMascot } from '../pet/mascot'
import { addLighting } from '../pet/scene'

/**
 * @returns 캐릭터 키 → PNG data URL
 */
export async function renderCharacterThumbnails({
  width = 132,
  height = 148,
}: { width?: number; height?: number } = {}): Promise<Map<string, string>> {
  // 모델을 먼저 다 불러 둔다. 그리는 동안에는 컨텍스트를 짧게 쥐고 있으려는 것이다.
  const mascots = await Promise.all(CHARACTERS.map((spec) => loadMascot(spec.key)))

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(2)
  renderer.setSize(width, height, false)

  const scene = new THREE.Scene()
  addLighting(scene)

  const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 40)
  camera.position.set(0, 1.5, 6.6)
  camera.lookAt(0, 0.95, 0)

  const stand = new THREE.Group()
  stand.rotation.y = -0.3
  scene.add(stand)

  const thumbnails = new Map<string, string>()
  CHARACTERS.forEach((spec, index) => {
    const mascot = mascots[index]
    /*
     * 쉬는 자세(바인드 포즈)가 아니라 `idle` 첫 프레임으로 세운다. 볼 붉힘·눈웃음 같은
     * 표정 부품은 동작 안에서 숨겨 두는 것이라, 쉬는 자세에서는 얼굴에 그대로 드러난다.
     */
    const mixer = new THREE.AnimationMixer(mascot.model)
    const idle = mascot.clips.find((clip) => clip.name === 'idle')
    if (idle) {
      mixer.clipAction(idle).play()
      mixer.update(0)
    }
    stand.scale.setScalar(scaleMascot(mascot))
    stand.add(mascot.root)
    renderer.render(scene, camera)
    thumbnails.set(spec.key, renderer.domElement.toDataURL('image/png'))
    mixer.stopAllAction()
    mixer.uncacheRoot(mascot.model)
    disposeMascot(mascot)
  })

  renderer.dispose()
  renderer.forceContextLoss()
  return thumbnails
}

/**
 * 창 하나에 한 벌만 만든다.
 *
 * 그리는 데 WebGL 컨텍스트와 glb 다섯 개가 필요해서 값이 싸지 않고, 다시 그려도
 * 결과가 같다. 컴포넌트가 다시 그려질 때마다 새로 만들면 컨텍스트가 계속 쌓인다.
 */
let pending: Promise<Map<string, string>> | null = null
let ready: Map<string, string> | null = null

export function characterThumbnails(): Promise<Map<string, string>> {
  pending ??= renderCharacterThumbnails().then((map) => (ready = map))
  return pending
}

const EMPTY = new Map<string, string>()

/** 다 그려지면 다시 그리도록 상태로 들고 있는다 */
export function useCharacterThumbnails(): Map<string, string> {
  const [thumbnails, setThumbnails] = useState(ready ?? EMPTY)
  useEffect(() => {
    if (ready) return
    let alive = true
    void characterThumbnails().then((map) => {
      if (alive) setThumbnails(map)
    })
    return () => {
      alive = false
    }
  }, [])
  return thumbnails
}
