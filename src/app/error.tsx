'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-canvas-soft flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="display-sm text-ink">Algo deu errado</h2>
      <p className="body-md text-mute max-w-sm">
        Ocorreu um erro inesperado. Tente novamente ou volte mais tarde.
      </p>
      <Button variant="primary" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  )
}
