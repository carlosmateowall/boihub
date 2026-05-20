'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { Loader2, MailCheck, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

export function EsqueciSenhaForm() {
  const supabase = useMemo(() => createClient(), [])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const result = schema.safeParse({ email })
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }
    setLoading(true)
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}/redefinir-senha`
        : undefined
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })
    setLoading(false)
    if (authError) {
      setError('Não foi possível enviar o email. Tente novamente.')
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-canvas rounded-xl p-8 flex flex-col gap-6 items-center text-center">
          <MailCheck className="h-12 w-12 text-primary" strokeWidth={1.5} />
          <div className="flex flex-col gap-2">
            <h1 className="display-sm text-ink">Verifique seu email</h1>
            <p className="body-md text-mute">
              Se houver uma conta vinculada a <strong>{email}</strong>,
              enviaremos um link para você redefinir a senha. O link expira
              em 1 hora.
            </p>
          </div>
          <Link
            href="/login"
            className="text-sm font-semibold text-ink hover:text-primary flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar para o login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-canvas rounded-xl p-8 flex flex-col gap-6">
        <Link
          href="/login"
          className="flex items-center gap-2 text-sm text-mute hover:text-ink transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <div className="flex flex-col gap-2">
          <h1 className="display-sm text-ink">Esqueci minha senha</h1>
          <p className="body-md text-mute">
            Informe seu email cadastrado e enviaremos um link para você criar
            uma nova senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
          {error && <p className="text-sm text-negative">{error}</p>}
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar link'}
          </Button>
        </form>
      </div>
    </div>
  )
}
