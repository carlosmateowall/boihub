import type { Metadata, Viewport } from 'next'
import { Manrope, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://boihub.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BoiHub — O super app do pecuarista',
    template: '%s · BoiHub',
  },
  description:
    'Conectamos produtores rurais a veterinários, motoristas de frete e revendas de insumos agropecuários. Cadastre-se grátis.',
  keywords: [
    'pecuária', 'agronegócio', 'gado', 'veterinário', 'frete bovino',
    'insumos agropecuários', 'produtor rural', 'fazenda', 'BoiHub',
  ],
  applicationName: 'BoiHub',
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
  },
  appleWebApp: {
    capable: true,
    title: 'BoiHub',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: 'BoiHub — O super app do pecuarista',
    description:
      'Conectamos produtores rurais a veterinários, motoristas de frete e revendas de insumos agropecuários.',
    url: siteUrl,
    siteName: 'BoiHub',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og.svg',
        width: 1200,
        height: 630,
        alt: 'BoiHub — O super app do pecuarista brasileiro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BoiHub — O super app do pecuarista',
    description: 'Veterinários, frete de gado e revendas em um só lugar.',
    images: ['/og.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0d2818',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${inter.variable}`}>
      <body className="bg-canvas-soft text-ink font-body antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
