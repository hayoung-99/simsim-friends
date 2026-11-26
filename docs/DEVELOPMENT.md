# 개발 안내

README 는 앱을 **쓰는** 사람을 위한 안내서로 두고, **만드는** 쪽이 보는 것은 여기에
모읍니다. 둘 다 저장소에 함께 올라갑니다. 고칠 때 지켜야 할 관례와 함정은
[../CLAUDE.md](../CLAUDE.md), 왜 이 제품인지는 [PRODUCT.md](PRODUCT.md) 에 있습니다.

---

## 시작하기

Node 는 `.nvmrc` 에 적힌 버전을 씁니다 (nvm·fnm 이 이 파일을 읽습니다).

```bash
nvm use
npm ci
```

`npm install` 이 아니라 `npm ci` 입니다 — `npm install` 은 lockfile 을 지금 쓰는 npm
버전에 맞게 다시 쓰기 때문에, 손대지도 않은 `package-lock.json` 이 커밋에 딸려
들어갑니다.

### 1. Supabase 준비 (약 5분, 한 번만)

방 정보 저장과 실시간 전달에 Supabase 무료 플랜을 씁니다.
[SUPABASE_SETUP.md](SUPABASE_SETUP.md) 를 따라 프로젝트를 만들고 키를 넣어 주세요.
접속 정보 파일은 `env.sample` 을 복사해 만들고 `SUPABASE_URL` · `SUPABASE_ANON_KEY`
를 채웁니다.

키가 없어도 앱은 실행됩니다. 방 창이 무엇을 해야 하는지 안내해 줘요.

### 2. 실행

```bash
npm start
```

캐릭터가 화면 오른쪽 아래에 나타나고, 방 창이 함께 열립니다. 이름을 정하고 방을
만들면 여섯 글자 초대코드가 나옵니다. 상대에게 그 코드를 알려주세요.

방은 **최대 3개**까지 만들거나 참여할 수 있고, **방 하나당 캐릭터 한 마리**가 화면에
뜹니다. 방마다 다른 캐릭터를 골라 두면 어느 방에서 온 신호인지 한눈에 보입니다.

---

## 자주 쓰는 명령

명령은 **루트에서** 부릅니다. 루트 `package.json` 이 알맞은 워크스페이스로 넘겨줍니다.

```bash
npm run build         # 화면(React·TS)·preload·메인 빌드 — 실행 전에 한 번은 필요하다
npm run dev           # 화면을 고칠 때마다 다시 빌드한다 (창은 새로고침)
npm test              # 단위 테스트 (vitest) — Supabase 없이 돈다
npm run typecheck     # 타입 검사
npm run lint          # 린트 (oxlint)
npm run check         # 실제 Supabase 연결 점검 (접속 정보 필요)
npm run app-icon      # 앱 · 메뉴바 아이콘(icns·ico·Assets.car·tray PNG·파비콘) 다시 생성 — Xcode 26 필요
npm run site          # 랜딩페이지를 Vercel 과 같은 규칙으로 로컬에서 띄운다
npm run site:open     # 띄우고 브라우저까지 연다
npm run check:site    # 랜딩페이지가 스스로 어긋나지 않았는지 (CI 도 이걸 돌린다)
npm run dist          # 설치 파일 만들기 (접속 정보를 앱에 구워 넣습니다)
```

CI(`.github/workflows/ci.yml`)가 미는 것마다 돌리는 것은 `npm test` ·
`npm run typecheck` · `npm run lint` · `npm run build` · `npm run check:site`
다섯입니다. 이 다섯이 통과하지 않으면 `main` 규칙셋이 머지를 막습니다.

`npm run check` 는 기기 두 대인 척하며 방 만들기 → 초대코드 참여 → 콕 찌르기 →
접속 상태 → 방 나가기까지 진짜 RPC·Realtime 을 거쳐 확인하고, 만든 데이터는 지웁니다.
Supabase 설정을 바꿨거나 스키마를 다시 실행한 뒤에 돌려보면 좋습니다.

### 혼자서 두 명인 척 테스트하기

한 대의 컴퓨터에서 A·B 두 명을 동시에 띄울 수 있습니다.

```bash
npm run start:both
```

터미널을 두 개 쓰고 싶다면 따로 실행해도 됩니다.

```bash
npm start              # A
npm run start:second   # B
```

`SIMSIM_PROFILE` 로 userData 경로가 갈라지므로 **서로 다른 사람으로 취급됩니다**
(로그인 세션·방 소속·캐릭터·창 위치가 각각 따로 저장됩니다).

두 번째 인스턴스의 캐릭터는 첫 번째 왼쪽에 떨어져 뜨고, 메뉴바 아이콘에 마우스를 올리면
`SimSim Friends (second)` 로 표시되어 구분됩니다.

**해볼 순서**

1. A의 방 창에서 이름을 넣고 방을 만듭니다 → 초대코드가 나옵니다
2. B의 방 창에 그 코드를 넣고 참여합니다
3. **A의 캐릭터를 클릭** → A는 움찔하며 `콕콕!`, **B는 춤추며 발밑에 A의 이름**이 떠오릅니다
4. 서로 다른 캐릭터를 골라 보고, 우클릭 → 크기 조절도 각각 따로 적용되는지 봅니다
5. A에서 방을 하나 더 만들어 보세요 — 캐릭터가 한 마리 더 뜨고, 그 캐릭터를 눌러도
   먼저 만든 방에는 신호가 가지 않습니다

`npm run start:both` 은 터미널에서 `Ctrl+C` 한 번이면 둘 다 함께 종료됩니다.

> 두 인스턴스가 같은 Supabase 프로젝트를 보므로 접속 정보 파일은 하나만 있으면 됩니다.

### Supabase 없이 화면만 둘러보기

```bash
SIMSIM_FAKE_NET=1 npm start
```

메모리 안의 가짜 서버를 씁니다. 방 만들기·캐릭터 고르기 같은 화면을 전부 눌러볼 수
있지만, 같은 프로세스 안에서만 통하므로 인스턴스 사이 통신은 되지 않습니다.

### 눈으로 확인하기

화면을 고쳤으면 `npm run start:both` 로 두 명인 척 띄워 직접 눌러 보세요 (위 "혼자서
두 명인 척 테스트하기"). 신호·재우기·캐릭터 바꾸기를 실제로 주고받아 볼 수 있습니다.
화면만 둘러볼 때는 가짜 서버로 띄웁니다.

```bash
SIMSIM_PROFILE=look SIMSIM_FAKE_NET=1 npm start
SIMSIM_METRICS=5 npm start   # 5초마다 CPU·메모리·보이는 창 수를 찍는다
```

**환경변수로 상황을 만들어 스크린샷을 남기던 캡처 도구(`dev-capture.ts`)는 2026-11 에
걷어 냈습니다.** 옛 문서에 `SIMSIM_CAPTURE` · `SIMSIM_SEED` · `SIMSIM_POKE` 가 남아 있으면
지금은 동작하지 않는 것입니다.

---

## 구조

저장소는 **npm workspaces 모노레포**입니다. 설치는 루트에서 `npm ci` 한 번이면 됩니다 —
workspaces 가 의존성을 루트 `node_modules` 로 올려 두기 때문입니다.

**소스가 아니라 빌드 산출물이 돕니다.** `npm start` 가 알아서 먼저 빌드하지만, 소스를
고친 뒤에는 `npm run build` (또는 `npm run dev`) 를 거쳐야 창에 반영됩니다.

```
apps/
└── desktop/           Electron 앱. 이 폴더가 통째로 하나의 앱이다
    ├── src/
    │   ├── main/          메인 프로세스 (타입스크립트 → CommonJS 로 빌드된다)
    │   │   ├── main.ts         진입점 · 방 수에 맞춰 캐릭터 창을 만들고 지운다
    │   │   ├── windows.ts      투명 캐릭터 창 / 방 창 / 크기 조절 패널
    │   │   ├── session.ts      저장소 · 네트워크 · 창을 잇는 상태 한 곳
    │   │   ├── store.ts        userData 안 JSON 한 개
    │   │   ├── ipc.ts          렌더러와의 유일한 통로
    │   │   ├── click-through.ts  캐릭터 위에서만 마우스를 받기, 끌어서 옮기기
    │   │   ├── pet-size.ts     창 크기 계산 (Electron 없이 테스트 가능)
    │   │   ├── tray.ts         메뉴바 아이콘
    │   │   ├── i18n.ts         지금 쓰는 언어 하나를 들고 있는 얇은 껍데기
    │   │   ├── updates.ts      새 버전을 어떻게 가져다줄지 플랫폼 보고 정한다
    │   │   ├── update-schedule.ts  언제 확인할지 (아침에 하루 한 번)
    │   │   ├── auto-update.ts  받아서 설치까지 (Windows)
    │   │   ├── update-check.ts 나왔다고 알리기만 (그 밖 · 내려받기 실패 시)
    │   │   └── config.ts       Supabase 접속 정보 (개발용 파일 / 빌드에 구운 값)
    │   ├── preload/       렌더러에 노출할 좁은 API (CommonJS 로 빌드된다)
    │   ├── renderer/      React + 타입스크립트 + Tailwind
    │   │   ├── theme.css       색·모서리 토큰과 Tailwind 바탕
    │   │   ├── ui.ts           여러 창이 되풀이해 쓰는 유틸리티 묶음
    │   │   ├── pet/            Three.js 캐릭터 창. glb 를 띄우는 `mascot.ts` · 연출 · 렌더 루프 (React 는 껍데기만)
    │   │   ├── public/mascots/ 3D 캐릭터 glb 다섯 개. 빌드하면 `dist-renderer/mascots/` 로 복사된다
    │   │   ├── team/           방 목록 창(TeamList) + 방 상세 창(TeamDetail)
    │   │   ├── settings/       절전 강도·언어를 고르는 창
    │   │   ├── size/           캐릭터 크기 조절 패널
    │   │   ├── icon/           앱 아이콘을 그리는 화면 (배포본에는 안 들어간다)
    │   │   └── demo-video/     예전 랜딩 히어로 영상을 찍던 화면 (지금 랜딩은 안 쓴다, 예전 캐릭터)
    │   └── services/      net.ts 인터페이스 · supabase-net · 테스트용 fake-net
    ├── test/          단위 테스트 (Electron 없이 돈다)
    ├── scripts/       앱에 딸린 도구 (아이콘 · 접속 정보 굽기 · e2e 점검)
    ├── assets/        트레이 아이콘
    ├── build/         앱 아이콘 산출물 (icns · ico · png)
    └── dist-main/ · dist-renderer/ · dist-preload/   빌드 산출물. 실제로 도는 것은 이쪽이다

apps/
└── web/               랜딩페이지 (Next.js · Vercel 로 올라간다)
    ├── app/           (ko) 는 `/`, (en) 은 `/en` — 나라말마다 루트 레이아웃이 하나씩
    ├── components/    마크업 한 벌. 나라말은 밖에서 들어온다
    ├── lib/           문구(copy.*.tsx) · 주소(site.ts) · 구조화 데이터(jsonld.ts)
    ├── public/        그림 · robots.txt · llms.txt
    └── middleware.ts  보안 헤더와 CSP (/admin 일 때만 넓힌다)

packages/
└── shared/            앱·랜딩·어드민이 함께 보는 것 — @simsim-friends/shared
    └── src/           characters · power · i18n/ · state · ipc

scripts/            랜딩 점검 (빌드한 결과를 띄워서 본다)
supabase/           schema.sql — 테이블과 RPC
```

**공유 코드는 `@simsim-friends/shared/…` 로 부릅니다.** 상대경로로 넘나들지 마세요. 이 패키지는
빌드하지 않고 소스를 그대로 내보냅니다 — 부르는 쪽이 전부 번들러라 트랜스파일은 그쪽이
합니다. 타입 검사는 루트 `tsconfig.json` 이 워크스페이스 전부를 한 번에 봅니다.

빌드는 Vite 설정 **세 벌**입니다 — 화면(`vite.config.mts`) · preload
(`vite.preload.config.mts`) · 메인(`vite.main.config.mts`). 메인 설정은 파일 하나를
파일 하나로 떨어뜨립니다. 한 덩어리로 묶으면 `__dirname` 의 깊이가 달라져
`config.ts`·`windows.ts`·`tray.ts` 가 저장소 루트를 찾지 못하는데, 그게 **배포본에서만**
드러납니다.

**랜딩페이지 그림은 Blender 원본에서 렌더합니다** (2026-11 미니룸 랜딩). 다섯 마리를 같은 키 ·
같은 바닥선으로 찍는 틀과 그 방법은 [apps/web/DESIGN.md](../apps/web/DESIGN.md) 에 있습니다.

**앱 아이콘 · 메뉴바 아이콘 · 랜딩 파비콘은 "빼꼼" 마크입니다** (`renderer/icon/logo.ts`, 기획서 "앱 아이콘은
빼꼼 마크"). 모양을 고치면 `npm run app-icon` 을 다시 돌립니다. 노랑 판이 기본이고 다크
모드에서는 검정 판인데, macOS 에서 그렇게 바뀌는 아이콘은 Icon Composer 형식으로만 만들 수
있어서 `build/Icon.icon` 을 Xcode 의 `actool` 로 `build/Assets.car` 에 컴파일해 커밋합니다.
앱은 그 파일을 품고 나가고(`mac.extraResources`) Info.plist 의 `CFBundleIconName` 이
그것을 가리킵니다. **CI 러너의 Xcode 판에 기대지 않으려고** 빌드 때 컴파일하지 않습니다.
`build/icon.icns` 는 macOS 25 이하가 쓰는 노랑 한 벌입니다.

메뉴바 아이콘은 같은 마크를 한 가지 색으로 줄인 `assets/trayTemplate*.png`(검정)와
`assets/trayDark*.png`(흰색)입니다. 맥은 검정을 템플릿으로 넘겨 운영체제가 메뉴바 색에 맞춰
뒤집고, 윈도우 · 리눅스는 시스템 테마를 보고 둘 중 하나를 고릅니다(`main/tray-icon.ts`).
`npm run app-icon` 을 다시 돌리면 `Assets.car` 는 그림이
같아도 바이트가 달라지니, 마크를 고친 게 아니면 그 파일은 커밋에서 빼세요.

**창 안의 작은 아이콘은 여기 해당하지 않습니다** — 그것들은 lucide 세트에서
꺼내 쓰고 `renderer/icons.tsx` 가 크기·굵기만 씌웁니다
([library-icons.md](design/library-icons.md)).

---

## 여러 나라 말

문자열은 `packages/shared/src/i18n/` 안에 언어별 JSON 한 벌씩(`ko`·`en`·`ja`·`zh`)
있습니다. 열쇠(key)는 네 언어가 똑같아야 하고, 하나라도 어긋나면 테스트가 잡아냅니다 —
빠진 열쇠·남는 열쇠·`{빈칸}` 불일치·빈 문장까지 검사합니다.

처음 실행하면 **운영체제 언어를 따라가고**, 설정 창에서 직접 고를 수도 있습니다.
바꾸면 트레이·우클릭 메뉴까지 함께 바뀝니다.

한국어·일본어·중국어는 그릇을 **방**(ルーム·房间), 사람을 **멤버**(メンバー·成员)로
부릅니다. **영어만 `team`·`teammate` 를 그대로 씁니다** — `roommate` 는 뜻이 아예
다르고 `room member` 는 한 낱말이던 자리가 두 낱말이 되기 때문입니다. 왜 그렇게
정했는지는 [PRODUCT.md](PRODUCT.md) 의 1단계에 있습니다.

오류 메시지는 통신 계층에서 문장을 만들지 않고 `error.INVITE_EXPIRED` 같은
**열쇠만 넘깁니다.** 그 계층은 지금 어떤 말을 쓰는지 모르기 때문입니다.

---

## 캐릭터는 3D 모델(glb)입니다

캐릭터 창과 팀 창의 썸네일은 `apps/desktop/src/renderer/public/mascots/<동물>.glb` 를
불러 그립니다. **동작과 표정은 Blender 에서 만들어 glb 에 담고, 앱은 신호마다 어느 동작을
틀지만 고릅니다** (`pet/mascot.ts`). 왜 그렇게 정했는지는 [PRODUCT.md](PRODUCT.md) "캐릭터는
Blender 에서 만든다" 에 있습니다.

### 신호와 동작

| 앱에서 | glb 동작 | 길이 | 비고 |
|---|---|---|---|
| 가만히 | `idle` | 2초 반복 | |
| 콕 (받음) | `dance` | 0.83초 × 2 | 눈웃음 |
| 내가 누름 | `poke` | 1.2초 | 다른 동작 중이면 건너뜀 |
| 폴짝 | `hop` | 1초 × 3 | |
| 손 흔들기 | `wave` | 2초 | 눈웃음 |
| 하트 | `shy` | 1.7초 | 볼 붉힘 + 하트 말풍선 |
| 앙탈 | `sulk` | 1.7초 | 눈 `> <` |
| 재우기 | `doze` → `sleep` | 1.5초 → 2.4초 반복 | 감은 눈 + Z 말풍선 (`pet/sleep-bubble.ts`) |
| 깨우기 | `wake` | 2.8초 | |

`REACTIONS`(`mascot.ts`)가 이 표의 코드 판입니다. 앞의 클립이 없는 모델은 뒤의 것으로
내려갑니다 — 예를 들어 `wake` 가 없으면 `cheer` 를 틉니다.

**동작은 겹쳐 재생하지 않습니다.** 신호 하나가 동작 하나를 틀고, 끝나면 0.2초 크로스페이드로
`idle` 에 돌아갑니다. 재우기는 `doze` 가 끝나면 `sleep` 반복으로 넘어가 깨울 때까지
그대로입니다.

### 표정 부품은 뼈로 꺼내고 숨긴다

glb 안에 눈웃음(`*_smile_eyes`) · `> <`(`*_squint_eyes`) · 감은 눈(`*_sleep_eyes`) ·
볼 붉힘(`*_blush`) 부품이 들어 있고, 각각 뼈(`eye_smile.*` · `eye_squint.*` · `eye_sleep.*` ·
`blush.*`)에 붙어 있습니다. 평소에는 머리 속에 숨거나 크기가 0 이고, 그 표정을 쓰는 동작만
꺼냅니다. 눈 표정을 꺼낼 때는 `face_in` · `face_out` 뼈가 눈동자와 눈두덩을 함께 펴서
덮개가 평평하게 얹히게 합니다.

**그래서 쉬는 자세(바인드 포즈)로 그리면 표정 부품이 얼굴에 드러납니다.** 썸네일처럼
멈춘 그림을 그릴 때는 `idle` 첫 프레임으로 세웁니다 (`team/thumbnails.ts`).

### glb 를 바꾸는 법

원본 `.blend` 는 저장소 밖에 있습니다. Blender 에서 고친 뒤 이 설정으로 내보내 `public/mascots/` 에 덮어씁니다.

- glTF Binary(.glb) · Animation **Actions** 모드 · **Force Sampling** 켜기
- 정점 색 **`Col` 이름으로** 내보내기 — 표정 덮개의 털색이 정점 색이라, 빠지면 덮개가 흰색으로 나옵니다
- 텍스처 **1024px · WebP(품질 85)**, 메시 **meshopt**(`EXT_meshopt_compression`)

**meshopt 로 압축한 glb 는 디코더 없이는 아예 뜨지 않습니다.** `mascot.ts` 의 로더에
`MeshoptDecoder` 가 꽂혀 있으니 지우지 마세요.

### 예전 캐릭터 코드는 데모 영상 도구만 씁니다

`pet/critter.ts`(구·캡슐·원뿔로 조립) · `pet/animations.ts`(키프레임 겹) 와 그 테스트는
**예전 랜딩 히어로 영상을 찍던 `npm run demo-video` 만** 씁니다. 앱 화면에는 나오지 않고,
2026-11 미니룸 랜딩부터는 그 영상도 쓰지 않습니다. 도구와 함께 걷어 낼지는 나중에 정합니다.

---

## 배포하기

저장소를 만드는 것부터 랜딩페이지를 올리는 것까지 [RELEASE.md](RELEASE.md) 에
순서대로 있습니다. 키 관리, 받는 사람이 겪는 보안 경고 안내, 앞으로 코드 서명과
자동 업데이트를 붙일 때 짚을 곳까지 정리되어 있습니다.

```
main 에 머지 → 랜딩페이지는 바로 배포되고,
               앱은 "다음 릴리스" PR 이 쌓인다 → 그 PR 을 머지하면 릴리스
```

새 버전을 내는 데 필요한 것은 **PR 하나를 머지하는 일**뿐입니다. release-please 가
커밋 메시지의 `feat:` / `fix:` 를 읽어 버전을 정하고 변경 목록을 적어 둡니다.

핵심만 요약하면:

- **anon 키는 앱 안에 들어갑니다.** 저장소를 비공개로 해도 숨겨지지 않으니,
  키가 알려져도 안전한 구조(RLS + security definer 함수)에 기대야 합니다.
- 키는 커밋하지 말고 **GitHub Actions 시크릿**으로 넣으세요. 태그를 밀면
  `.github/workflows/release.yml` 이 빌드해 Releases 에 올립니다.
- **비공개 저장소의 릴리스 파일은 외부인이 받을 수 없습니다.**
- **코드 서명이 없어 처음 열 때 경고가 뜹니다.** 넘기는 방법을 README·랜딩페이지·
  릴리스 노트에 함께 적어 두었습니다. 이 안내가 없으면 대부분 여기서 포기합니다.
- **Windows 와 Linux 는 자동으로 업데이트됩니다.** 조용히 받아 두었다가 방 창의
  배너를 누르면 적용되고, 안 눌러도 다음에 종료할 때 갈아끼워집니다. **Linux 는
  조건부입니다** — 받은 AppImage 를 그대로 실행 중이고 그 폴더를 손댈 수 있을 때만
  이 길로 가고, 아니면 macOS 와 같은 알림 길로 갑니다(자세한 근거는
  [design/linux-build-pipeline.md](design/linux-build-pipeline.md)). macOS 는 코드
  서명이 없으면 구조적으로 불가능해서 "새 버전이 나왔어요" 안내만 띄웁니다.

### 랜딩페이지

`apps/web/` 의 Next.js 앱이고 Vercel 로 올라갑니다. **`main` 에 머지하면 바로
배포되므로 손으로 올릴 일이 없습니다.**

마크업은 `components/Landing.tsx` 한 벌이고 한국어와 영어는 `lib/copy.ko.tsx`·
`copy.en.tsx` 에서 들어옵니다. 받기 버튼은 열릴 때 GitHub 의 최신 릴리스를 읽어 파일
하나로 좁혀 주고, 자바스크립트가 꺼져 있어도 릴리스 목록 페이지로 갑니다.

```bash
npm run site        # Vercel 과 같은 규칙으로 로컬에서 띄운다
npm run check:site  # 스스로 어긋나지 않았는지 (CI 도 이걸 돌린다)
```

---

## 기능별 설계 문서

기획서에서 정해진 것을 **어떻게 만들지**는 기능마다 문서 하나로 둡니다.

| 기능 | 문서 | 상태 |
|---|---|---|
| 알림 화면 | [docs/design/notifications-screen.md](design/notifications-screen.md) | 구현 완료 (리뷰 대기) |
| 인터넷이 없을 때 | [docs/design/offline-screen.md](design/offline-screen.md) | 구현 완료 (리뷰 대기) |
| 화면 속 아이콘을 라이브러리 것으로 | [docs/design/library-icons.md](design/library-icons.md) | 구현 완료 (리뷰 대기) |
| 종료가 앱을 완전히 끝내게 | [docs/design/quit-fully-terminates.md](design/quit-fully-terminates.md) | 구현 완료 (리뷰 대기) |
| 캐릭터를 한 마리씩 숨기기 | [docs/design/pet-hide-individual.md](design/pet-hide-individual.md) | 구현 완료 (리뷰 대기) |
| 리눅스 빌드·배포 파이프라인 | [docs/design/linux-build-pipeline.md](design/linux-build-pipeline.md) | 구현 완료 (리뷰 대기) |
| 이름을 SimSim Friends 로 | [docs/design/rename-simsim-friends.md](design/rename-simsim-friends.md) | 구현 완료 (리뷰 대기) |
| 캐릭터 캡쳐 스튜디오 | [docs/design/character-capture-studio.md](design/character-capture-studio.md) | **걷어 냄** (2026-11, 3D 캐릭터로 바뀌며 함께 지움) |

**위 문서들에 나오는 `BUDDLING_*` 환경변수와 `buddling-…` 파일 이름은 옛 이름입니다**
(2026-09 에 `SIMSIM_*` · `simsim-friends-…` 로 옮겼습니다 —
[rename-simsim-friends.md](design/rename-simsim-friends.md) 참고). 이 문서들은 "그때
이렇게 만들기로 했다" 는 기록이라 새 이름으로 덮지 않습니다. 그중 하나
([notifications-screen.md](design/notifications-screen.md) 1.5절)는 **이름을 옮기는
일 자체를 적은 절**이라, 덮으면 일어나지 않은 일을 적는 셈이 됩니다. 지금 도는 이름은
언제나 이 문서 위쪽(["자주 쓰는 명령"](#자주-쓰는-명령)·["눈으로 확인하기"](#눈으로-확인하기))이
기준입니다.

---

## 알아두면 좋은 점

- 로그인 화면이 없습니다. 대신 Supabase 익명 로그인으로 기기마다 계정을 하나 만들어 두고,
  서버는 클라이언트가 넘긴 값이 아니라 `auth.uid()` 로 누가 부르는지를 가립니다.
  테이블은 RLS로 잠겨 있고 모든 접근은 `security definer` 함수로만 이루어집니다.
- 실시간 채널은 private 채널입니다. `realtime.messages` 정책이 "그 방 멤버인가"를 확인하므로
  방 ID를 알아도 멤버가 아니면 붙을 수 없고, 방을 나가면 그 즉시 끊깁니다.
- 세션이 곧 신원입니다. 잃어버리면 속한 방과 남남이 되고, 되찾는 길은 초대코드로 다시
  들어오는 것뿐입니다.
- 한 사람이 최대 3개 방에 속할 수 있고, 방마다 별도의 멤버 신분(닉네임·캐릭터)을 갖습니다.
  이미 들어와 있는 방에 초대코드로 다시 참여하면 정원을 더 쓰지 않고 닉네임만 갱신됩니다.
- 멤버가 모두 나가면 그 방은 DB에서 삭제되고 초대코드도 함께 사라집니다.
  아무도 없는 방은 되살릴 방법이 없으므로 빈 껍데기를 남기지 않습니다.
- **데이터베이스와 코드 식별자는 여전히 `teams` · `team_id` 입니다.** 사용자에게 보이는
  말만 방·멤버로 바꾸기로 했습니다 — 마이그레이션 비용만 크고 사용자가 볼 일이 없습니다.
