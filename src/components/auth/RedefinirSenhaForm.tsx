'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  confirmar: z.string(),
}).refine(d => d.senha === d.confirmar, {
  message: 'As senhas não conferem',
  path: ['confirmar'],
})

export function RedefinirSenhaForm() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState('')

  useEffect(() => {
    // O fluxo do Supabase usa um "recovery" event: o usuário chega aqui
    // com a sessão temporária ativada pelo link do email.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSessionReady(true)
      } else {
        setSessionError(
          'Link inválido ou expirado. Solicite uma nova recuperação de senha.'
        )
      }
    })
  }, [supabase])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const result = schema.safeParse({ senha, confirmar })
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }
    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password: senha })
    setLoading(false)
    if (updateError) {
      setError('Não foi possível atualizar a senha. Tente novamente.')
      return
    }
    setDone(true)
    setTimeout(() => router.push('/login'), 2500)
  }

  if (sessionError) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-canvas rounded-xl p-8 flex flex-col gap-4 text-center">
          <h1 className="display-sm text-ink">Link inválido</h1>
          <p className="body-md text-mute">{sessionError}</p>
          <Link
            href="/esqueci-senha"
            className="text-sm font-semibold text-ink hover:text-primary mt-2"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    )
  }

  if (!sessionReady) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-canvas rounded-xl p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-mute" />
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-canvas rounded-xl p-8 flex flex-col gap-6 items-center text-center">
          <CheckCircle2 className="h-12 w-12 text-primary" strokeWidth={1.5} />
          <div className="flex flex-col gap-2">
            <h1 className="display-sm text-ink">Senha redefinida!</h1>
            <p className="body-md text-mute">
              Sua nova senha foi salva. Redirecionando para o login...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-canvas rounded-xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="display-sm text-ink">Nova senha</h1>
          <p className="body-md text-mute">
            Crie uma nova senha para acessar sua conta BoiHub.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">Nova senha</label>
            <div className="relative">
              <input
                type={showSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-canvas text-ink border border-ink rounded-md px-4 py-3 pr-12 text-base placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowSenha(!showSenha)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-mute hover:text-ink"
              >
                {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">Confirmar senha</label>
            <input
              type={showSenha ? 'text' : 'password'}
              value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-canvas text-ink border border-ink rounded-md px-4 py-3 text-base placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {error && <p className="text-sm text-negative">{error}</p>}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar nova senha'}
          </Button>
        </form>
      </div>
    </div>
  )
}
