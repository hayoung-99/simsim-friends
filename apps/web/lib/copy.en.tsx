import type { Copy } from './copy'
import { RELEASES_PAGE } from './site'

/**
 * 영어판. 설치 안내 · 궁금한 것 · 받기 화면 문장은 예전 `site/en/index.html` 에서 옮겨 온
 * 그대로이고, 나머지는 2026-09 베이지 랜딩 시안을 옮긴 것이다. 부르는 말은 기획서대로
 * team · teammate 다.
 */
export const en: Copy = {
  locale: 'en',
  other: { href: '/', lang: 'ko', short: '한국어', long: '한국어' },

  skipToContent: 'Skip to content',
  nav: { signals: 'Signals', friends: 'Friends', start: 'Get started', download: 'Download' },

  hero: {
    lead: 'On your desktops,',
    tail: 'a tap for ',
    emphasis: 'a tap',
    sub: "Tap the characters on each other's screens. No words needed — just a little move to say hi.",
    download: 'Download',
    howTo: 'How it works',
    warns: 'Your computer will warn you once, the first time.',
    warnsLink: 'How to get past it',
    note: 'Your teammates need it too. Free, no sign up.',
  },

  demo: {
    label: "Tap the white cat on your desktop and the brown dog on your friend's desktop dances. When your friend taps the dog, your cat blushes with a little heart",
  },

  quiet: {
    heading: 'Too small for a message, too nice to skip',
    stickers: ['Read', 'You there?', 'Ding!', '12 unread'],
    bodyStrong: 'No read receipts, no replies, no sounds.',
    body: 'Something moves in the corner of their screen for a moment, and they know it was you.',
  },

  signals: {
    heading: 'Five moves, one per team',
    sub: 'You only ever tap once, so the move you pick becomes your way of saying hi.',
    pickerLabel: 'Pick a move',
    items: [
      { id: 'poke', name: 'Nudge', meaning: "I'm here", motion: 'Sways and dances', alt: 'A dog dancing among music notes' },
      { id: 'hop', name: 'Hop', meaning: 'Hey, yay!', motion: 'Bounces on the spot', alt: 'A cat jumping on the spot' },
      { id: 'wave', name: 'Wave', meaning: 'Hello', motion: 'Lifts an arm and waves', alt: 'A panda waving one arm' },
      { id: 'heart', name: 'Heart', meaning: 'Thanks, love you', motion: 'Pops a heart and blushes', alt: 'A duck blushing under a heart bubble' },
      { id: 'sulk', name: 'Sulk', meaning: 'Look at me', motion: 'Flops down and flails', alt: 'A bunny flopped down and fussing' },
    ],
  },

  friends: {
    heading: 'Which one comes home with you?',
    sub: 'Give each team a different animal and you can tell where a signal came from at a glance.',
    items: [
      { id: 'cat', name: 'Shy Cat', trait: 'A little bashful' },
      { id: 'dog', name: 'Crazy Dog', trait: 'Always excited' },
      { id: 'panda', name: 'Cozy Panda', trait: 'Takes it easy' },
      { id: 'duck', name: 'Whisky Duck', trait: 'Slightly spaced out' },
      { id: 'bunny', name: 'Just Bunny', trait: 'Just a bunny' },
    ],
  },

  start: {
    heading: 'No sign up, just one invite code',
    steps: [
      { title: 'Download and open', body: 'Grab the one file that fits your computer.' },
      { title: 'Create a team, share the code', body: 'Pick a nickname and your team is ready. Send the code to your teammates.' },
      { title: 'Give it a tap', body: 'When a teammate joins, one more animal shows up on your desktop.' },
    ],
    codeSample: 'K7QX2MPA',
    codeNote: 'Works for 24 hours',
  },

  room: {
    members: { big: '5', title: 'Just your people', body: 'Up to five per team. Thirty people poking each other is a screen you would switch off.' },
    rooms: { big: '3', title: 'Up to three teams', body: 'Friends, family, just the two of you.' },
    sleep: { title: 'Need quiet? Let it sleep', body: "A sleeping team's animal curls up. Your own signals still go out." },
    clear: { title: 'Never in your way', body: 'Clicks around the animal pass straight through, and it saves battery when idle.' },
  },

  final: {
    headingTop: 'Who will you',
    headingBottom: 'poke today?',
    note: 'Free on macOS and Windows. In English, 한국어, 日本語 and 中文.',
  },

  download: {
    label: 'Download',
    heading: 'The file for your machine',
    sub: 'Every version stays here. Most people just want the latest one.',
    metaTitle: 'SimSim Friends · Download',
    metaDescription: 'Download SimSim Friends for macOS and Windows. Older versions stay available too.',
    ogDescription: 'Pick the file for your machine. Older versions are still here if you need them.',
    backHome: 'Back to SimSim Friends',
    latest: 'Latest',
    releaseNotes: 'View release notes',
    button: 'Download',
    rows: [
      { asset: 'mac-arm64', label: 'macOS', name: 'Mac (ARM64)' },
      { asset: 'mac-x64', label: 'macOS', name: 'Mac (x64)' },
      { asset: 'windows', label: 'Windows', name: 'Windows (x64)' },
    ],
    mobileGateHeading: 'Open this on a computer',
    mobileGateBody:
      'SimSim Friends is a macOS and Windows desktop app, and the files here only open on a computer. Send yourself this link and open it there.',
    pending: (
      <>
        Nothing has been published yet. It will show up here as soon as it is ready.{' '}
        <a href={RELEASES_PAGE}>Check the releases page</a>
      </>
    ),
  },

  install: {
    label: 'First launch',
    heading: 'Once, the first time',
    sub: 'Your computer checks with you once. Do this and it opens normally from then on.',
    macos: {
      title: 'macOS',
      howToName: 'Open SimSim Friends for the first time on macOS',
      steps: [
        ['Move the app into your ', { strong: 'Applications' }, ' folder.'],
        ['Double click it. When the warning appears, press ', { strong: 'Done' }, '.'],
        [
          'Open ',
          { strong: 'System Settings → Privacy & Security' },
          ' and press ',
          { strong: 'Open Anyway' },
          ' near the bottom.',
        ],
        ['Press ', { strong: 'Open' }, ' once more and it opens normally from then on.'],
      ],
    },
    windows: {
      title: 'Windows',
      howToName: 'Install SimSim Friends on Windows',
      steps: [
        ['Double click the file you downloaded.'],
        ['When the blue box appears, click ', { strong: 'More info' }, '.'],
        ['Click ', { strong: 'Run anyway' }, ' and the install continues.'],
      ],
      hint: 'It never asks for administrator rights.',
    },
  },

  faq: {
    label: 'Questions',
    heading: 'Things you might wonder',
    items: [
      {
        id: 'faq-what',
        question: 'What is SimSim Friends?',
        answer:
          'A macOS and Windows app that keeps a 3D animal character on your desktop. Tap your own and everyone on that team sees theirs dance. It is free and there is no sign up.',
      },
      {
        id: 'faq-teammates',
        question: 'Do my teammates need it too?',
        answer:
          'Yes. The character has to be on their desktop for the nudge to land. One person creates a team, gets an eight character invite code, and everyone else types it in.',
      },
      {
        id: 'faq-free',
        question: 'Is it really free?',
        answer: 'Yes. No ads, no paid tier. No email and no password either.',
      },
      {
        id: 'faq-alone',
        question: 'Can I use it alone?',
        answer:
          'A character appears for each team you are in, so you need at least one team. A team of one is still a team and the character lives on your desktop just the same. There is simply nobody to nudge yet. Up to three teams, five people each.',
      },
      {
        id: 'faq-work',
        question: 'Can I install it on a work computer?',
        answer:
          'All that travels is the fact that somebody tapped, plus a name. Nothing on your screen and none of your files goes anywhere. It never asks for administrator rights either.',
      },
      {
        id: 'faq-first-open',
        question: 'A box appears the first time. What if it will not open?',
        answer:
          'That happens once. Follow the steps above and it opens normally from then on. If you would rather check for yourself, all the code that makes it is public.',
      },
    ],
  },

  footer: {
    github: 'GitHub',
    releases: 'Releases',
  },

  downloadStrings: {
    pending: 'Coming soon',
    heroFor: 'Download for {target}',
    copied: 'Copied',
    sendToComputer: 'Send to my computer',
  },

  app: {
    description:
      "A desktop app that puts a 3D animal friend on your screen. Tap your own character and your teammates' characters dance on theirs.",
    subCategory: 'Desktop pet app',
    featureList: [
      'A 3D animal character lives on your desktop',
      'Tap your own character and everyone on that team sees theirs dance',
      'No sign up: join with a nickname and an eight character invite code',
      'Clicks in the empty space around the character pass through to the desktop',
      'Remembers where you dragged it and how big you made it',
      'Makes no sound, and the menu bar icon hides every character at once',
      'Up to 3 teams per person, up to 5 people per team',
      'Free on macOS and Windows',
    ],
  },

  meta: {
    title: 'SimSim Friends · A free desktop pet your teammates can feel',
    description:
      "Put a 3D animal friend on your desktop. Tap yours and your teammates' characters dance on theirs. Free for macOS and Windows, no sign up needed.",
    ogDescription:
      'Tap your own character and your teammates’ characters dance. The lightest way to say I am here without saying anything.',
    imageAlt: 'Five characters standing in a row: a cat, a dog, a panda, a duck and a bunny',
  },
}
