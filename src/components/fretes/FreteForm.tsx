'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  origem: z.string().min(3, 'Informe a origem'),
  destino: z.string().min(3, 'Informe o destino'),
  cabecas: z.number().min(1, 'Mínimo 1 cabeça'),
  tipo_gado: z.enum(['corte', 'leite', 'bezerro', 'touro']),
  data_embarque: z.string().min(1, 'Informe a data'),
  peso_medio_kg: z.number().optional(),
  observacoes: z.string().optional(),
})

const tiposGado = [
  { value: 'corte', label: 'Corte' },
  { value: 'leite', label: 'Leite' },
  { value: 'bezerro', label: 'Bezerro' },
  { value: 'touro', label: 'Touro' },
]

export function FreteForm() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState({
    origem: '', destino: '', cabecas: '', tipo_gado: 'corte',
    data_embarque: '', peso_medio_kg: '', observacoes: '',
  })

  function set(key: string, value: string) {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const parsed = schema.safeParse({
      ...fields,
      cabecas: parseInt(fields.cabecas),
      peso_medio_kg: fields.peso_medio_kg ? parseFloat(fields.peso_medio_kg) : undefined,
    })
    if (!parsed.success) { setError(parsed.error.errors[0].message); return }

    setLoading(true)
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
    if (!profile) { setError('Perfil não encontrado.'); setLoading(false); return }

    const { error: dbError } = await supabase.from('fretes').insert({
      produtor_id: profile.id,
      origem: parsed.data.origem,
      destino: parsed.data.destino,
      cabecas: parsed.data.cabecas,
      tipo_gado: parsed.data.tipo_gado,
      data_embarque: parsed.data.data_embarque,
      peso_medio_kg: parsed.data.peso_medio_kg ?? null,
      observacoes: parsed.data.observacoes ?? null,
      status: 'pendente',
    })
    setLoading(false)
    if (dbError) { setError('Erro ao criar frete. Tente novamente.'); return }
    router.push('/fretes')
  }

  return (
    <form onSubmit={handleSubmit} className="bg-canvas rounded-xl p-6 flex flex-col gap-4">
      <Input label="Origem" value={fields.origem} onChange={e => set('origem', e.target.value)} placeholder="Fazenda Santa Bárbara, Uberaba MG" required />
      <Input label="Destino" value={fields.destino} onChange={e => set('destino', e.target.value)} placeholder="Frigorífico Marfrig, Uberlândia MG" required />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Cabeças" type="number" value={fields.cabecas} onChange={e => set('cabecas', e.target.value)} placeholder="100" required />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-ink">Tipo de gado</label>
          <select
            value={fields.tipo_gado}
            onChange={e => set('tipo_gado', e.target.value)}
            className="bg-canvas text-ink border border-ink rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {tiposGado.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Data de embarque" type="date" value={fields.data_embarque} onChange={e => set('data_embarque', e.target.value)} required />
        <Input label="Peso médio (kg)" type="number" value={fields.peso_medio_kg} onChange={e => set('peso_medio_kg', e.target.value)} placeholder="400" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-ink">Observações</label>
        <textarea
          value={fields.observacoes}
          onChange={e => set('observacoes', e.target.value)}
          placeholder="Informações adicionais sobre o transporte..."
          rows={3}
          className="bg-canvas text-ink border border-ink rounded-md px-4 py-3 text-base placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {error && <p className="text-sm text-negative">{error}</p>}

      <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Solicitar frete'}
      </Button>
    </form>
  )
}
