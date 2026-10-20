import type { Copy } from './copy'
import { RELEASES_PAGE } from './site'

/**
 * 한국어판. 설치 안내 · 궁금한 것 · 받기 화면 문장은 예전 `site/index.html` 에서 옮겨 온
 * 그대로이고, 나머지는 2026-09 베이지 랜딩 시안의 문장이다.
 */
export const ko: Copy = {
  locale: 'ko',
  other: { href: '/en/', lang: 'en', short: 'EN', long: 'English' },

  skipToContent: '본문으로 건너뛰기',
  nav: { signals: '신호', friends: '친구들', start: '시작하기', download: '다운로드' },

  hero: {
    lead: '톡 누르면,',
    tail: '친구 화면에서 ',
    emphasis: '춤춰요',
    sub: '바탕화면에 사는 작은 동물 친구로, 답장할 필요 없는 안부를 보내요.',
    download: '받기',
    howTo: '어떻게 시작해요?',
    warns: '처음 열 때 경고가 한 번 떠요.',
    warnsLink: '넘기는 법 보기',
    note: '친구도 함께 받아야 시작돼요. 무료이고 가입도 없어요.',
  },

  demo: {
    label: '내 화면의 흰 고양이를 톡 누르면 신호가 건너가, 민지 화면의 갈색 강아지가 음표를 띄우며 춤춰요',
  },

  quiet: {
    heading: '말 걸기엔 시시하고, 안 걸자니 아쉬울 때',
    stickers: ['읽음 1', '답장 언제 해?', '띠링!', '안 읽은 알림 12'],
    bodyStrong: '읽음 표시도, 답장도, 소리도 없어요.',
    body: '화면 구석에서 누가 잠깐 움직이고, 그게 나였다는 것만 전해져요.',
  },

  signals: {
    heading: '몸짓은 다섯 가지, 방마다 하나',
    sub: '누르는 건 하나뿐이라, 고른 몸짓이 곧 그 사람의 인사법이 돼요.',
    pickerLabel: '몸짓 고르기',
    items: [
      { id: 'poke', name: '콕', meaning: '나 여기 있어', motion: '좌우로 흔들며 춤춰요', alt: '음표 사이에서 춤추는 강아지' },
      { id: 'hop', name: '폴짝', meaning: '반가워, 신나', motion: '제자리에서 통통 뛰어요', alt: '제자리에서 뛰어오르는 고양이' },
      { id: 'wave', name: '손 흔들기', meaning: '안녕', motion: '한쪽 팔을 들어 흔들어요', alt: '한쪽 팔을 들어 흔드는 판다' },
      { id: 'heart', name: '하트', meaning: '고마워, 좋아해', motion: '하트를 띄우고 수줍어해요', alt: '하트 말풍선 아래에서 수줍어하는 오리' },
      { id: 'sulk', name: '앙탈', meaning: '날 좀 봐줘', motion: '털썩 주저앉아 보채요', alt: '털썩 주저앉아 보채는 토끼' },
    ],
  },

  friends: {
    heading: '다섯 친구 중 누구를 데려갈까요',
    sub: '방마다 다른 친구를 두면, 어느 방에서 온 신호인지 한눈에 알아요.',
    items: [
      { id: 'cat', name: '샤이 캣', trait: '낯가림 담당' },
      { id: 'dog', name: '크레이지 독', trait: '늘 신나 있음' },
      { id: 'panda', name: '코지 판다', trait: '느긋함 그 자체' },
      { id: 'duck', name: '위스키 덕', trait: '어딘가 멍함' },
      { id: 'bunny', name: '저스트 버니', trait: '그냥 토끼' },
    ],
  },

  start: {
    heading: '가입 없이, 초대코드 하나면 끝',
    steps: [
      { title: '받아서 켜기', body: '내 컴퓨터에 맞는 파일 하나만 받으면 돼요.' },
      { title: '방 만들고 코드 나누기', body: '닉네임만 적으면 방이 생겨요. 나온 코드를 멤버에게 보내 주세요.' },
      { title: '톡 눌러 보기', body: '멤버가 들어오면 바탕화면에 한 마리가 더 나타나요.' },
    ],
    codeSample: 'K7QX2MPA',
    codeNote: '24시간 동안 쓸 수 있어요',
  },

  room: {
    members: { big: '5명', title: '딱 친한 사이만큼', body: '한 방에 다섯 명까지. 서른 명이 서로 찌르는 화면은 끄고 싶어지니까요.' },
    rooms: { big: '3개', title: '방은 셋까지', body: '친구방, 가족방, 우리 둘 방.' },
    sleep: { title: '조용히 하고 싶으면 재우기', body: '재운 방의 친구는 웅크려 자요. 내 신호는 그대로 나가요.' },
    clear: { title: '바탕화면을 가리지 않아요', body: '친구 옆 빈 자리는 클릭이 그대로 통과해요. 가만히 있을 땐 배터리도 아껴요.' },
  },

  final: {
    headingTop: '오늘은 누구를',
    headingBottom: '톡 찔러 볼까요?',
    note: 'macOS와 Windows에서 무료예요. 한국어, English, 日本語, 中文을 지원해요.',
  },

  download: {
    label: '받기',
    heading: '내 컴퓨터에 맞는 파일',
    sub: '버전마다 다시 받을 수 있어요. 평소에는 최신 버전이면 충분해요.',
    metaTitle: 'SimSim Friends · 받기',
    metaDescription: 'macOS·Windows용 SimSim Friends를 받아요. 지난 버전도 그대로 남아 있어요.',
    ogDescription: '내 컴퓨터에 맞는 파일을 골라 받아요. 지난 버전도 여기서 다시 받을 수 있어요.',
    backHome: 'SimSim Friends로 돌아가기',
    latest: '최신',
    releaseNotes: '릴리스 노트 보기',
    button: '받기',
    rows: [
      { asset: 'mac-arm64', label: 'macOS', name: 'Mac (ARM64)' },
      { asset: 'mac-x64', label: 'macOS', name: 'Mac (x64)' },
      { asset: 'windows', label: 'Windows', name: 'Windows (x64)' },
    ],
    mobileGateHeading: '컴퓨터에서 열어 주세요',
    mobileGateBody:
      'SimSim Friends는 macOS·Windows 데스크톱 앱이에요. 받는 파일도 컴퓨터에서만 열려요 — 지금 보고 있는 이 주소를 컴퓨터로 보내 두세요.',
    pending: (
      <>
        아직 올라온 파일이 없어요. 준비되면 여기에 나타나요.{' '}
        <a href={RELEASES_PAGE}>릴리스 보러 가기</a>
      </>
    ),
  },

  install: {
    label: '처음 열 때',
    heading: '처음 한 번만',
    sub: '처음 열 때 컴퓨터가 한 번 확인해요. 아래대로 하면 다음부터는 그냥 열려요.',
    macos: {
      title: 'macOS',
      howToName: 'macOS에서 SimSim Friends 처음 열기',
      steps: [
        ['받은 앱을 ', { strong: '응용 프로그램' }, ' 폴더로 옮겨요.'],
        ['두 번 눌러 열고, 경고가 뜨면 ', { strong: '완료' }, '를 눌러요.'],
        [
          { strong: '시스템 설정 → 개인 정보 보호 및 보안' },
          '을 열고, 아래쪽 ',
          { strong: '확인 없이 열기' },
          '를 눌러요.',
        ],
        ['한 번 더 ', { strong: '열기' }, '를 누르면 다음부터는 그냥 열려요.'],
      ],
    },
    windows: {
      title: 'Windows',
      howToName: 'Windows에서 SimSim Friends 설치하기',
      steps: [
        ['받은 파일을 두 번 눌러요.'],
        ['파란 창이 뜨면 ', { strong: '추가 정보' }, '를 눌러요.'],
        ['아래에 나타나는 ', { strong: '실행' }, '을 누르면 설치가 이어져요.'],
      ],
      hint: '관리자 권한은 묻지 않아요.',
    },
  },

  faq: {
    label: '궁금한 것',
    heading: '궁금할 만한 것',
    items: [
      {
        id: 'faq-what',
        question: 'SimSim Friends가 뭔가요?',
        answer:
          '바탕화면에 3D 동물 캐릭터를 띄워 두는 macOS·Windows 앱이에요. 내 캐릭터를 누르면 같은 방 사람들 화면에서 캐릭터가 춤을 춰요. 무료이고 가입도 없어요.',
      },
      {
        id: 'faq-teammates',
        question: '멤버도 받아야 하나요?',
        answer:
          '네. 서로의 바탕화면에 캐릭터가 있어야 신호가 오가요. 한 사람이 방을 만들면 8자리 초대코드가 나오고, 나머지는 그 코드만 넣으면 돼요.',
      },
      {
        id: 'faq-free',
        question: '정말 무료인가요?',
        answer: '네. 광고도 유료 기능도 없어요. 이메일도 비밀번호도 받지 않고요.',
      },
      {
        id: 'faq-alone',
        question: '혼자 써도 되나요?',
        answer:
          '캐릭터는 방마다 한 마리씩 떠서 방은 하나 있어야 해요. 혼자 만든 방도 방이라 캐릭터는 그대로 살아요. 콕 찌를 상대가 아직 없을 뿐이에요. 방은 최대 3개, 한 방에 5명까지예요.',
      },
      {
        id: 'faq-work',
        question: '회사 컴퓨터에 깔아도 될까요?',
        answer:
          '오가는 건 누가 눌렀다는 신호와 이름뿐이에요. 화면에 뭐가 떠 있는지도, 파일도 밖으로 나가지 않아요. 설치할 때 관리자 권한도 묻지 않고요.',
      },
      {
        id: 'faq-first-open',
        question: '처음 열 때 창이 떠요. 안 열리면요?',
        answer:
          '처음 한 번만 그래요. 위의 순서대로 하면 다음부터는 그냥 열려요. 그래도 미덥지 않으면 만드는 코드를 전부 공개해 뒀으니 직접 읽어 보셔도 돼요.',
      },
    ],
  },

  footer: {
    github: 'GitHub',
    releases: '릴리스',
  },

  downloadStrings: {
    pending: '곧 올라와요',
    heroFor: '{target}용 받기',
    copied: '복사됨',
    sendToComputer: '내 컴퓨터로 보내기',
  },

  app: {
    description:
      '바탕화면에 3D 동물 친구를 띄우고, 내 캐릭터를 누르면 멤버들 화면에서 캐릭터가 춤추는 데스크톱 앱이에요.',
    subCategory: '바탕화면 캐릭터 앱',
    featureList: [
      '바탕화면 위에 3D 동물 캐릭터가 떠 있어요',
      '내 캐릭터를 누르면 같은 방 사람들 화면에서 캐릭터가 춤을 춰요',
      '가입 없이 닉네임과 8자리 초대코드로 방에 들어가요',
      '캐릭터 옆 빈 자리는 클릭이 그대로 바탕화면으로 통과해요',
      '끌어서 옮긴 자리와 키운 크기를 기억해요',
      '소리가 나지 않고, 메뉴 막대에서 한 번에 숨길 수 있어요',
      '한 사람이 최대 3개 방, 방 하나에 최대 5명',
      'macOS와 Windows에서 무료',
    ],
  },

  meta: {
    title: 'SimSim Friends · 친구들과 함께 쓰는 무료 바탕화면 캐릭터 앱',
    description:
      '바탕화면에 3D 동물 친구를 띄우고, 내 캐릭터를 누르면 멤버들 화면에서 캐릭터가 춤을 춰요. macOS·Windows 무료. 가입 없이 닉네임과 8자리 초대코드로 시작해요.',
    ogDescription:
      '내 캐릭터를 누르면 멤버들 화면에서 캐릭터가 춤을 춰요. 말을 걸지 않고도 나 여기 있어를 전하는 가장 가벼운 방법.',
    imageAlt: '크림색 배경 위에 선 고양이, 강아지, 판다, 오리, 토끼 캐릭터 다섯 마리',
  },
}
