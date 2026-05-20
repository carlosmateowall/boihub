'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowLeft, Stethoscope, MessageCircle, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/shared/Badge'
import { Rating } from '@/components/shared/Rating'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import type { Veterinario } from '@/types/database'

interface Props { vet: Veterinario }

const TIPOS = [
  { id: 'online', label: 'Teleconsulta', icon: Video, desc: 'Video chamada' },
  { id: 'presencial', label: 'Visita técnica', icon: Stethoscope, desc: 'Vet vai até a fazenda' },
] as const

type TipoId = (typeof TIPOS)[number]['id']

function minDateLocal() {
  // 2 horas a partir de agora, formato yyyy-MM-ddTHH:mm para input datetime-local
  const d = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function AgendarConsultaForm({ vet }: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const minDate = useMemo(() => minDateLocal(), [])

  const [tipo, setTipo] = useState<TipoId>('online')
  const [motivo, setMotivo] = useState('')
  const [dataConsulta, setDataConsulta] = useState(minDate)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!motivo.trim()) {
      setError('Descreva o motivo da consulta.')
      return
    }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Sessão expirada. Faça login novamente.')
      setSaving(false)
      return
    }
    const isoData = new Date(dataConsulta).toISOString()
    const { error: dbError } = await supabase.from('consultas_vet').insert({
      produtor_id: user.id,
      veterinario_id: vet.id,
      tipo,
      motivo: motivo.trim(),
      data_consulta: isoData,
      preco: vet.preco_consulta,
      status: 'agendada',
    })
    setSaving(false)
    if (dbError) {
      setError('Não foi possível agendar. Tente novamente.')
      return
    }
    router.push('/saude/consultas?novo=1')
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Link
        href="/saude/veterinarios"
        className="flex items-center gap-2 text-sm text-mute hover:text-ink w-fit"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar para veterinários
      </Link>

      <div className="bg-canvas rounded-xl p-6 flex flex-col gap-4 border border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-ink">{vet.nome}</p>
              {vet.online && <Badge variant="positive">Online agora</Badge>}
            </div>
            <p className="text-sm text-mute mt-0.5">{vet.crmv}</p>
          </div>
          <Rating value={vet.avaliacao} count={vet.total_consultas} />
        </div>
        {vet.especialidades && vet.especialidades.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {vet.especialidades.map(e => (
              <Badge key={e} variant="mute">{e}</Badge>
            ))}
          </div>
        )}
        {vet.bio && <p className="text-sm text-mute leading-relaxed">{vet.bio}</p>}
      </div>

      <form onSubmit={handleSubmit} className="bg-canvas rounded-xl p-6 flex flex-col gap-5 border border-border">
        <div>
          <h2 className="display-xs text-ink">Agendar consulta</h2>
          <p className="text-sm text-mute mt-1">Preencha os dados e o profissional confirmará o atendimento.</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-ink">Tipo de atendimento</label>
          <div className="grid grid-cols-2 gap-3">
            {TIPOS.map(t => {
              const Icon = t.icon
              const active = tipo === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTipo(t.id)}
                  className={
                    'flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors ' +
                    (active
                      ? 'border-ink bg-canvas-soft'
                      : 'border-border hover:border-ink/30')
                  }
                >
                  <Icon className="h-5 w-5 text-ink" strokeWidth={1.5} />
                  <span className="font-semibold text-ink text-sm">{t.label}</span>
                  <span className="text-xs text-mute">{t.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-ink">Motivo da consulta</label>
          <textarea
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            placeholder="Descreva sintomas, número de cabeças afetadas, histórico recente..."
            rows={4}
            required
            className="w-full bg-canvas text-ink border border-ink rounded-md px-4 py-3 text-base placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
          <p className="text-xs text-mute">Quanto mais detalhe, melhor o vet se prepara.</p>
        </div>

        <Input
          label="Data e horário"
          type="datetime-local"
          value={dataConsulta}
          min={minDate}
          onChange={e => setDataConsulta(e.target.value)}
          required
        />

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-sm text-mute">Valor da consulta</p>
            <p className="display-xs text-ink">
              {vet.preco_consulta ? formatCurrency(vet.preco_consulta) : 'A combinar'}
            </p>
          </div>
          {vet.whatsapp && (
            <a
              href={`https://wa.me/55${vet.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Estou agendando uma consulta pelo BoiHub.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-mute hover:text-ink flex items-center gap-1"
            >
              <MessageCircle className="h-4 w-4" /> Tirar dúvida
            </a>
          )}
        </div>

        {error && <p className="text-sm text-negative">{error}</p>}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="primary" size="md" className="flex-1" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar agendamento'}
          </Button>
        </div>
      </form>
    </div>
  )
}
