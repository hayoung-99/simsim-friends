import '@simsim-friends/shared/design/tokens.css'
import '../globals.css'
import '../pretendard.css'
import type { ReactNode } from 'react'
import { RootHtml } from '../../components/RootHtml'
import { ko } from '../../lib/copy.ko'
import { buildMetadata } from '../../lib/metadata'

export const metadata = buildMetadata(ko)

export const viewport = {
  // 바탕색. 주소창이 페이지와 이어져 보이게 한다.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#cfe9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#1b2230' },
  ],
}

export default function KoreanLayout({ children }: { children: ReactNode }) {
  return <RootHtml copy={ko}>{children}</RootHtml>
}
