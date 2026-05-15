'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Loader2, ArrowLeft, MailCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PerfilSelector } from './PerfilSelector'
import { createClient } from '@/lib/supabase/client'
import type { PerfilTipo } from '@/types/database'

const step1Schema = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

export function CadastroForm() {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [step, setStep] = useState(1)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [perfil, setPerfil] = useState<PerfilTipo | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const result = step1Schema.safeParse({ nome, email, senha })
    if (!result.success) {
      setError(result.error.errors[0].message)
      return
    }
    setStep(2)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!perfil) { setError('Selecione um perfil.'); return }
    setError('')
    setLoading(true)
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome, perfil } },
    })
    setLoading(false)
    if (authError) { setError(authError.message); return }
    if (!data.session) {
      setEmailSent(true)
      return
    }
    router.push('/onboarding')
  }

  if (emailSent) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-canvas rounded-xl p-8 flex flex-col gap-6 items-center text-center">
          <MailCheck className="h-12 w-12 text-primary" strokeWidth={1.5} />
          <div className="flex flex-col gap-2">
            <h1 className="display-sm text-ink">Confirme seu email</h1>
            <p className="body-md text-mute">
              Enviamos um link de confirmação para <strong>{email}</strong>. Clique no link para ativar sua conta.
            </p>
          </div>
          <p className="text-sm text-mute">
            Já confirmou?{' '}
            <Link href="/login" className="font-semibold text-ink hover:text-primary">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-canvas rounded-xl p-8 flex flex-col gap-6">
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-sm text-mute hover:text-ink transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
        )}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            {[1, 2].map(n => (
              <div
                key={n}
                className={`h-1.5 flex-1 rounded-pill ${n <= step ? 'bg-primary' : 'bg-canvas-soft'}`}
              />
            ))}
          </div>
          <h1 className="display-sm text-ink mt-2">
            {step === 1 ? 'Criar conta' : 'Seu perfil'}
          </h1>
          <p className="body-md text-mute">
            {step === 1 ? 'Preencha seus dados de acesso' : 'Como você vai usar o BoiHub?'}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleStep1} className="flex flex-col gap-4">
            <Input label="Nome completo" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" required />
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
            <Input label="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" required />
            {error && <p className="text-sm text-negative">{error}</p>}
            <Button type="submit" variant="primary" size="md" className="w-full mt-2">Continuar</Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <PerfilSelector value={perfil} onChange={setPerfil} />
            {error && <p className="text-sm text-negative">{error}</p>}
            <Button type="submit" variant="primary" size="md" className="w-full mt-2" disabled={loading || !perfil}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Criar conta'}
            </Button>
          </form>
        )}

        {step === 1 && (
          <p className="text-center text-sm text-mute">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-semibold text-ink hover:text-primary">
              Entrar
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
