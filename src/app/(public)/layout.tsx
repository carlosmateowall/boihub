import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas-soft">
      <header className="bg-canvas border-b border-ink/10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="display-xs text-ink hover:text-primary">
            BoiHub
          </Link>
          <Link
            href="/login"
            className="text-sm text-mute hover:text-ink flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">{children}</main>
      <footer className="border-t border-ink/10 mt-12">
        <div className="max-w-3xl mx-auto px-6 py-6 text-sm text-mute flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} BoiHub. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <Link href="/termos" className="hover:text-ink">Termos</Link>
            <Link href="/privacidade" className="hover:text-ink">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
