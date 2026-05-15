'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import type { PerfilTipo, Profile } from '@/types/database'
import { PERFIL_LABELS } from '@/lib/constants'

export function OnboardingForm() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fields, setFields] = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  function setField(key: string, value: string) {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)

    const update: Partial<Profile> = { onboarding_completo: true }

    if (profile.perfil === 'produtor') {
      update.fazenda = fields.fazenda
      update.cidade = fields.cidade
      update.cabecas = parseInt(fields.cabecas ?? '0')
      update.hectares = parseInt(fields.hectares ?? '0')
    } else if (profile.perfil === 'veterinario') {
      update.cidade = fields.cidade
    } else if (profile.perfil === 'motorista') {
      update.cidade = fields.cidade
    } else {
      update.fazenda = fields.nome_loja
      update.cidade = fields.cidade
    }

    await supabase.from('profiles').update(update).eq('id', profile.id)
    setSaving(false)
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const perfil = profile?.perfil as PerfilTipo

  return (
    <div className="w-full max-w-md">
      <div className="bg-canvas rounded-xl p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-primary">Bem-vindo ao BoiHub!</span>
          <h1 className="display-sm text-ink">Complete seu perfil</h1>
          <p className="body-md text-mute">
            Você entrou como <strong>{PERFIL_LABELS[perfil]}</strong>. Preencha os dados para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {perfil === 'produtor' && (
            <>
              <Input label="Nome da fazenda" value={fields.fazenda ?? ''} onChange={e => setField('fazenda', e.target.value)} placeholder="Fazenda Santa Bárbara" />
              <Input label="Cidade" value={fields.cidade ?? ''} onChange={e => setField('cidade', e.target.value)} placeholder="Uberaba, MG" />
              <Input label="Cabeças de gado" type="number" value={fields.cabecas ?? ''} onChange={e => setField('cabecas', e.target.value)} placeholder="Ex: 200" />
              <Input label="Hectares" type="number" value={fields.hectares ?? ''} onChange={e => setField('hectares', e.target.value)} placeholder="Ex: 400" />
            </>
          )}
          {perfil === 'veterinario' && (
            <>
              <Input label="Cidade de atuação" value={fields.cidade ?? ''} onChange={e => setField('cidade', e.target.value)} placeholder="Uberaba, MG" />
              <Input label="WhatsApp" value={fields.whatsapp ?? ''} onChange={e => setField('whatsapp', e.target.value)} placeholder="(34) 99999-0000" />
            </>
          )}
          {perfil === 'motorista' && (
            <>
              <Input label="Cidade base" value={fields.cidade ?? ''} onChange={e => setField('cidade', e.target.value)} placeholder="Uberaba, MG" />
              <Input label="WhatsApp" value={fields.whatsapp ?? ''} onChange={e => setField('whatsapp', e.target.value)} placeholder="(34) 99999-0000" />
            </>
          )}
          {(perfil === 'revenda' || perfil === 'fabricante') && (
            <>
              <Input label="Nome da empresa" value={fields.nome_loja ?? ''} onChange={e => setField('nome_loja', e.target.value)} placeholder="AgroVet Uberaba" />
              <Input label="Cidade" value={fields.cidade ?? ''} onChange={e => setField('cidade', e.target.value)} placeholder="Uberaba, MG" />
            </>
          )}

          <Button type="submit" variant="primary" size="md" className="w-full mt-2" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Acessar o BoiHub'}
          </Button>
        </form>
      </div>
    </div>
  )
}
