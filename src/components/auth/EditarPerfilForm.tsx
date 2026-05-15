'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types/database'

interface Props { profile: Profile }

export function EditarPerfilForm({ profile }: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState({
    nome: profile.nome,
    fazenda: profile.fazenda ?? '',
    cidade: profile.cidade ?? '',
    estado: profile.estado,
    cabecas: String(profile.cabecas),
    hectares: String(profile.hectares),
    whatsapp: profile.whatsapp ?? '',
  })

  function set(key: string, value: string) {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    const { error: dbError } = await supabase
      .from('profiles')
      .update({
        nome: fields.nome,
        fazenda: fields.fazenda || null,
        cidade: fields.cidade || null,
        estado: fields.estado,
        cabecas: parseInt(fields.cabecas) || 0,
        hectares: parseInt(fields.hectares) || 0,
        whatsapp: fields.whatsapp || null,
      })
      .eq('id', profile.id)
    setSaving(false)
    if (dbError) { setError('Erro ao salvar. Tente novamente.'); return }
    router.push('/perfil')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-canvas rounded-xl p-6 flex flex-col gap-4">
      <Input label="Nome completo" value={fields.nome} onChange={e => set('nome', e.target.value)} required />
      <Input label="WhatsApp" value={fields.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="(34) 99999-0000" />

      {profile.perfil === 'produtor' && (
        <>
          <Input label="Nome da fazenda" value={fields.fazenda} onChange={e => set('fazenda', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cidade" value={fields.cidade} onChange={e => set('cidade', e.target.value)} />
            <Input label="Estado (sigla)" value={fields.estado} onChange={e => set('estado', e.target.value)} maxLength={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Cabeças" type="number" value={fields.cabecas} onChange={e => set('cabecas', e.target.value)} />
            <Input label="Hectares" type="number" value={fields.hectares} onChange={e => set('hectares', e.target.value)} />
          </div>
        </>
      )}

      {profile.perfil !== 'produtor' && (
        <div className="grid grid-cols-2 gap-4">
          <Input label="Cidade" value={fields.cidade} onChange={e => set('cidade', e.target.value)} />
          <Input label="Estado (sigla)" value={fields.estado} onChange={e => set('estado', e.target.value)} maxLength={2} />
        </div>
      )}

      {error && <p className="text-sm text-negative">{error}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="secondary" size="md" className="flex-1" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" size="md" className="flex-1" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}
