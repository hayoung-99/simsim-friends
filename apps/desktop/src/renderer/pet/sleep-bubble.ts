/**
 * 잠들었을 때 머리 곁에 뜨는 **Z 가 든 말풍선**.
 *
 * 하트 말풍선(`heart-bubble.ts`)과 같은 판·꼬리·장난감 질감을 쓰고, 안에 든 것만 Z 둘
 * (큰 Z 와 작은 z) 이다. 다른 점은 **잠든 동안 계속 떠 있다는 것**이다. 하트는 한 번
 * 뜨고 사라지지만, 자는 것은 동작이 아니라 상태라서 깨울 때까지 남아 있어야 한다.
 *
 * 절전: 떠 있는 동안의 오르내림은 잠든 캐릭터의 느린 프레임(`SLEEP_FPS`)으로 충분히
 * 읽히는 느린 흔들림이라, 나타나고 사라지는 짧은 순간만 `transitioning` 으로 알린다.
 */

import * as THREE from 'three'

const PLATE_COLOR = 0xfffaf2
/** 밤하늘 같은 남색. 하트의 분홍과 겹치지 않으면서 크림 판 위에서 또렷하다 */
const Z_COLOR = 0x5b6bb5

/** 잠들기 동작(1.5초)에서 거의 다 엎드린 뒤에 뜬다 */
const DELAY = 1.1
const POP = 0.35
const FADE_OUT = 0.25
/** 누운 캐릭터의 머리 곁 [옆으로, 높이] (캐릭터 키 기준 비율). 엎드리면 키가 낮아진다 */
const SPOT: [number, number] = [-0.3, 0.98]
const PLATE_SIZE = 0.34

const isMesh = (object: THREE.Object3D): object is THREE.Mesh =>
  (object as THREE.Mesh).isMesh === true
const materialOf = (mesh: THREE.Mesh) => mesh.material as THREE.MeshStandardMaterial

function toy(color: number) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0, transparent: true, opacity: 1 })
}

/** Z 한 글자. 윤곽을 그려 얇게 밀어내고 모서리를 둥글린다 (하트와 같은 방식) */
function buildZ(size: number, material: THREE.Material) {
  const w = 1
  const s = 0.26 // 획 굵기
  const shape = new THREE.Shape()
  shape.moveTo(0, 1)
  shape.lineTo(w, 1)
  shape.lineTo(w, 1 - s)
  shape.lineTo(s * 1.25, s)
  shape.lineTo(w, s)
  shape.lineTo(w, 0)
  shape.lineTo(0, 0)
  shape.lineTo(0, s)
  shape.lineTo(w - s * 1.25, 1 - s)
  shape.lineTo(0, 1 - s)
  shape.lineTo(0, 1)
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.07,
    bevelSize: 0.06,
    bevelSegments: 3,
  })
  geometry.center()
  geometry.scale(size, size, size)
  return new THREE.Mesh(geometry, material)
}

function buildPlate(size: number) {
  const group = new THREE.Group()
  const mat = toy(PLATE_COLOR)
  const plate = new THREE.Mesh(new THREE.SphereGeometry(size * 0.5, 22, 16), mat)
  plate.scale.set(1.12, 1, 0.34)
  group.add(plate)
  const tail = new THREE.Mesh(new THREE.SphereGeometry(size * 0.13, 14, 10), mat)
  tail.scale.set(1, 1.1, 0.34)
  tail.position.set(size * 0.2, -size * 0.44, 0)
  group.add(tail)
  return group
}

/**
 * @param parent 캐릭터가 담긴 그룹
 * @param unit 캐릭터 키 (월드 단위)
 */
export function createSleepBubble(parent: THREE.Object3D, unit: number) {
  const size = unit * PLATE_SIZE
  const group = new THREE.Group()
  group.add(buildPlate(size))
  const zMat = toy(Z_COLOR)
  const big = buildZ(size * 0.36, zMat)
  big.position.set(-size * 0.1, -size * 0.06, size * 0.14)
  group.add(big)
  const small = buildZ(size * 0.22, zMat)
  small.position.set(size * 0.24, size * 0.18, size * 0.14)
  group.add(small)

  group.position.set(unit * SPOT[0], unit * SPOT[1], unit * 0.12)
  group.visible = false
  parent.add(group)
  const baseY = group.position.y

  /** 나타난 뒤 흐른 시간. 음수인 동안은 아직 나오지 않았다. null 이면 떠 있지 않다 */
  let age: number | null = null
  /** 사라지는 중이면 그 뒤 흐른 시간 */
  let leaving: number | null = null

  function setOpacity(o: number) {
    group.traverse((child) => {
      if (isMesh(child)) materialOf(child).opacity = o
    })
  }

  /** 잠들 때. `instant` 면 엎드리는 과정을 건너뛴 것이라 곧바로 떠 있는 상태로 둔다 */
  function show({ instant = false }: { instant?: boolean } = {}) {
    leaving = null
    age = instant ? POP : -DELAY
  }

  /** 깨울 때 */
  function hide() {
    if (age === null) return
    if (age < 0) {
      age = null
      group.visible = false
      return
    }
    leaving = 0
  }

  function update(delta: number) {
    if (age === null) return
    age += delta
    if (age < 0) return
    group.visible = true

    if (leaving !== null) {
      leaving += delta
      const t = Math.min(1, leaving / FADE_OUT)
      setOpacity(1 - t)
      group.scale.setScalar(1 - t * 0.4)
      if (t >= 1) {
        age = null
        leaving = null
        group.visible = false
      }
      return
    }

    // 톡 튀어나온 뒤에는 숨쉬듯 천천히 오르내리고, 작은 z 가 살짝 흔들린다
    const pop = Math.min(1, age / POP)
    const overshoot = pop < 1 ? Math.sin(pop * Math.PI) * 0.12 : 0
    group.scale.setScalar(0.35 + pop * 0.65 + overshoot)
    setOpacity(1)
    group.position.y = baseY + Math.sin(age * 1.6) * unit * 0.015
    small.rotation.z = Math.sin(age * 1.1) * 0.15
  }

  function dispose() {
    group.removeFromParent()
    group.traverse((child) => {
      if (isMesh(child)) {
        child.geometry.dispose()
        materialOf(child).dispose()
      }
    })
  }

  return {
    show,
    hide,
    update,
    dispose,
    object: group,
    /** 나타나거나 사라지는 짧은 순간. 이때만 넉넉히 그린다 */
    get transitioning() {
      return (age !== null && age >= 0 && age < POP) || leaving !== null
    },
    get top() {
      return baseY + size * 0.5
    },
  }
}
