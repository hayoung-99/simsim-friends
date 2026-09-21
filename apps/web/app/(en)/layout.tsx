import '../globals.css'
import type { ReactNode } from 'react'
import { RootHtml } from '../../components/RootHtml'
import { en } from '../../lib/copy.en'
import { buildMetadata } from '../../lib/metadata'

export const metadata = buildMetadata(en)

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6eddc' },
    { media: '(prefers-color-scheme: dark)', color: '#231a13' },
  ],
}

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootHtml copy={en}>{children}</RootHtml>
}
