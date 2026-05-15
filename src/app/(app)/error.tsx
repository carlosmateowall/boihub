'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AppError({
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
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <h2 className="display-sm text-ink">Algo deu errado</h2>
      <p className="body-md text-mute max-w-sm">
        Ocorreu um erro ao carregar esta página. Tente novamente.
      </p>
      <div className="flex gap-3">
        <Button variant="primary" onClick={reset}>Tentar novamente</Button>
        <Button variant="secondary" asChild>
          <Link href="/dashboard">Ir ao início</Link>
        </Button>
      </div>
    </div>
  )
}
