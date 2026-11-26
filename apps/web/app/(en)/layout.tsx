import '@simsim-friends/shared/design/tokens.css'
import '../globals.css'
import type { ReactNode } from 'react'
import { RootHtml } from '../../components/RootHtml'
import { en } from '../../lib/copy.en'
import { buildMetadata } from '../../lib/metadata'

export const metadata = buildMetadata(en)

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#cfe9f7' },
    { media: '(prefers-color-scheme: dark)', color: '#1b2230' },
  ],
}

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootHtml copy={en}>{children}</RootHtml>
}
