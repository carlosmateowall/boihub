import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas-soft flex flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-6xl font-display font-extrabold text-primary">404</p>
      <h2 className="display-sm text-ink">Página não encontrada</h2>
      <p className="body-md text-mute max-w-sm">
        O conteúdo que você procura não existe ou foi removido.
      </p>
      <Button variant="primary" asChild>
        <Link href="/dashboard">Voltar ao início</Link>
      </Button>
    </div>
  )
}
