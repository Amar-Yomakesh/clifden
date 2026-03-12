import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Clifden Beauty & Laser Clinic | Beauty That Never Ages',
  description: 'Advanced skin solutions and bespoke beauty treatments in Clifden, Co. Galway. Over 20 years of trusted expertise in laser hair removal, IPL, facials, and cosmetic injectables.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
