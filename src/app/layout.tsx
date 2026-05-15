import type { Metadata } from 'next'
import { Manrope, Inter } from 'next/font/google'
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

export const metadata: Metadata = {
  title: 'BoiHub — O super app do pecuarista',
  description: 'Conectamos produtores rurais a veterinários, motoristas de frete e revendas de insumos agropecuários.',
  keywords: ['pecuária', 'agronegócio', 'gado', 'veterinário', 'frete bovino', 'insumos agropecuários'],
  openGraph: {
    title: 'BoiHub',
    description: 'O super app do pecuarista brasileiro',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${inter.variable}`}>
      <body className="bg-canvas-soft text-ink font-body antialiased">
        {children}
      </body>
    </html>
  )
}
