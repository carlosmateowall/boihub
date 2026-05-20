'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

export function LoginForm() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const result = schema.safeParse({ email, senha })
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password: senha })
    setLoading(false)
    if (authError) {
      setError('Email ou senha incorretos.')
      return
    }
    router.refresh()
    router.push('/dashboard')
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-canvas rounded-xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="display-sm text-ink">Entrar</h1>
          <p className="body-md text-mute">Acesse sua conta BoiHub</p>
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
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-ink">Senha</label>
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

          {error && <p className="text-sm text-negative">{error}</p>}

          <Button type="submit" variant="primary" size="md" className="w-full mt-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Entrar'}
          </Button>

          <Link
            href="/esqueci-senha"
            className="text-center text-sm text-mute hover:text-ink"
          >
            Esqueci minha senha
          </Link>
        </form>

        <p className="text-center text-sm text-mute">
          Não tem uma conta?{' '}
          <Link href="/cadastro" className="font-semibold text-ink hover:text-primary">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
