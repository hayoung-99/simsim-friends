/**
 * 랜딩 한 벌의 모양.
 *
 * 마크업은 `components/` 에 한 번만 쓰고, 나라말마다 다른 것은 전부 여기로 모은다.
 * 예전에는 `site/index.html` 과 `site/en/index.html` 두 벌이 통째로 따로 있어서,
 * 한쪽만 고치면 조용히 어긋났다.
 *
 * 문장 안에 굵은 글씨가 들어가는 곳(설치 안내·힌트)은 `ReactNode` 로 둔다.
 * 자리표시자를 만들어 끼워 넣는 것보다 사전에 그대로 적는 편이 읽기 쉽다.
 */

import type { ReactNode } from 'react'

export type Locale = 'ko' | 'en'

/**
 * 설치 안내의 한 단계.
 *
 * 조각으로 쪼개 두는 이유가 있다. 이 문장은 **화면(굵은 글씨가 있는 마크업)과
 * 구조화 데이터(굵기가 없는 맨 문장) 두 모양**으로 쓰인다. 예전에는 HTML 과
 * JSON-LD 에 같은 문장을 두 벌 적어 두어서, 한쪽만 고치면 조용히 어긋났다.
 * 여기 한 벌만 두고 양쪽을 만들어 쓴다.
 */
export type StepPart = string | { strong: string }
export type Step = StepPart[]

/** 조각들을 이어 맨 문장으로 (구조화 데이터가 쓴다) */
export const stepText = (step: Step): string =>
  step.map((part) => (typeof part === 'string' ? part : part.strong)).join('')

export interface DownloadRow {
  /** `releases.ts` 가 릴리스 자산을 짝지을 때 쓰는 열쇠 */
  asset: 'mac-arm64' | 'mac-x64' | 'windows'
  /** 같은 값끼리 macOS · Windows 카드로 묶을 때 쓰는 이름 */
  label: string
  /** 카드 안 한 줄에 그대로 보이는 환경 이름. "요즘 맥" 같은 설명은 붙이지 않는다 */
  name: string
}

export interface Question {
  /** 주소에 남는 값. 구조화 데이터(FAQPage)도 이걸 가리킨다. */
  id: string
  question: string
  answer: string
}

/** 몸짓 다섯 가지. 그림 파일 이름(`signal-*.webp`)과 CSS 가 이 열쇠를 함께 쓴다. */
export type SignalId = 'poke' | 'hop' | 'wave' | 'heart' | 'sulk'

/** 다섯 친구. 그림 파일 이름(`friend-*.webp`)이 이 열쇠를 쓴다. */
export type FriendId = 'cat' | 'dog' | 'panda' | 'duck' | 'bunny'

export interface Copy {
  locale: Locale
  /** 다른 언어로 건너가는 곳 */
  other: { href: string; lang: Locale; short: string; long: string }

  skipToContent: string
  /** 윗줄 내비. `download` 는 `/download` 로 가는 단추이자 맨 끝 받기 칸의 단추 글자다 */
  nav: { signals: string; friends: string; start: string; download: string }

  hero: {
    /** 제목은 두 줄이다 — 앞줄과, 강조가 끝에 붙는 뒷줄 */
    lead: string
    tail: string
    emphasis: string
    sub: string
    /** 히어로의 받기 단추. `DownloadButtons` 가 OS 에 맞춰 바꿔 단다 */
    download: string
    /** 받기 옆 두 번째 단추 — 시작하는 법으로 내려간다 */
    howTo: string
    /**
     * 받기 버튼 바로 아래 한 줄. 처음 열 때 경고가 뜬다는 것을 **누르기 전에** 알려 준다.
     *
     * 받기 버튼은 파일을 내려받고 **페이지를 떠나므로**, 넘기는 법이 아래에 있다는
     * 사실 자체를 여기서 알려 주지 않으면 아무도 다시 찾아오지 않는다.
     */
    warns: string
    warnsLink: string
    /**
     * 그 아래 한 줄. **혼자서는 시작되지 않는다는 것**을 받기 전에 알린다 — 방이 없으면
     * 캐릭터도 뜨지 않기 때문이다(기획서 "방이 없으면 캐릭터도 없다").
     */
    note: string
  }

  /**
   * 히어로 오른쪽의 데모 영상. 영상 속 글씨(화면 이름 · 보낸 사람)는 구워져 있어서
   * 여기가 아니라 `apps/desktop/src/renderer/demo-video/demo-video.ts` 의 `TEXT` 에 있다.
   */
  demo: {
    /** 영상과, 움직임을 줄인 사람에게 대신 보여 주는 한 장의 설명. 낭독기가 읽는다 */
    label: string
  }

  /** 말 걸기엔 시시하고 — 이 제품이 무엇을 일부러 안 하는지 */
  quiet: {
    heading: string
    /** 줄을 그어 지우는 메신저의 흔적들 */
    stickers: string[]
    /** 굵게 보일 앞부분과 이어지는 뒷부분 */
    bodyStrong: string
    body: string
  }

  signals: {
    heading: string
    sub: string
    /** 몸짓 목록 전체의 이름 (낭독기용) */
    pickerLabel: string
    items: { id: SignalId; name: string; meaning: string; motion: string; alt: string }[]
  }

  friends: {
    heading: string
    sub: string
    items: { id: FriendId; name: string; trait: string }[]
  }

  start: {
    heading: string
    /** 순서가 곧 내용인 세 단계 — 받기, 방 만들고 코드 나누기, 눌러 보기 */
    steps: { title: string; body: string }[]
    /** 두 번째 단계 안에 그리는 예시 코드. 자릿수가 실제와 같아야 한다 */
    codeSample: string
    codeNote: string
  }

  /** 방 규칙 네 칸 */
  room: {
    members: { big: string; title: string; body: string }
    rooms: { big: string; title: string; body: string }
    sleep: { title: string; body: string }
    clear: { title: string; body: string }
  }

  /** 맨 끝 받기 칸. 단추 글자는 `nav.download` 를 함께 쓴다 */
  final: {
    headingTop: string
    headingBottom: string
    note: string
  }

  /**
   * `/download`(영어는 `/en/download`) — 버전 히스토리를 보여 주는 별도 화면.
   *
   * 예전에는 이 사전이 랜딩 안의 "받기" 판 하나만 채웠는데, 그 판이 통째로 이
   * 화면으로 옮겨 가면서 페이지 자체의 몫(`metaTitle`·`backHome` 등)이 늘었다.
   */
  download: {
    label: string
    heading: string
    /** 큰 제목 바로 아래 한 줄 */
    sub: string
    metaTitle: string
    metaDescription: string
    ogDescription: string
    /** 창 제목줄에서 랜딩으로 돌아가는 링크 */
    backHome: string
    /** 맨 위 버전에 붙는 꼬리표 */
    latest: string
    /** 버전마다 붙는, 그 버전의 깃허브 릴리스로 가는 링크 글자 */
    releaseNotes: string
    button: string
    rows: DownloadRow[]
    pending: ReactNode
    /**
     * 폰으로 열었을 때 목록 대신 보여 주는 화면(`DownloadMobileGate`) 전용 문구.
     * 이 화면이 이미 "컴퓨터에서 열라" 는 뜻을 지고 있어서, 목록 화면 쪽에는
     * 더 이상 그 안내를 따로 두지 않는다.
     */
    mobileGateHeading: string
    mobileGateBody: string
  }

  install: {
    label: string
    heading: string
    sub: string
    macos: { title: string; howToName: string; steps: Step[] }
    windows: { title: string; howToName: string; steps: Step[]; hint: string }
  }

  faq: {
    label: string
    heading: string
    items: Question[]
  }

  footer: { github: string; releases: string }

  /** 받기 단추가 상태에 따라 바꿔 다는 말 (예전 `dl-strings` 스크립트가 하던 일) */
  downloadStrings: {
    pending: string
    heroFor: string
    copied: string
    /** 폰에서는 받을 수 없으므로, 대신 이 주소를 컴퓨터로 보내게 한다 */
    sendToComputer: string
  }

  /** 구조화 데이터가 앱을 설명할 때 쓰는 말 (SoftwareApplication) */
  app: {
    description: string
    subCategory: string
    featureList: string[]
  }

  meta: {
    title: string
    description: string
    ogDescription: string
    imageAlt: string
  }
}
