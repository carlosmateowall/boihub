'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Video, Stethoscope, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import type { ConsultaVet } from '@/types/database'

interface Props { consulta: ConsultaVet }

const statusVariant: Record<string, 'positive' | 'warning' | 'negative' | 'primary' | 'mute'> = {
  agendada: 'warning',
  em_andamento: 'primary',
  concluida: 'positive',
  cancelada: 'mute',
}

const statusLabel: Record<string, string> = {
  agendada: 'Agendada',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
}

export function ConsultaCard({ consulta }: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [canceling, setCanceling] = useState(false)
  const [error, setError] = useState('')

  const data = consulta.data_consulta ? new Date(consulta.data_consulta) : null
  const dataFmt = data
    ? data.toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    : 'a definir'

  const Icon = consulta.tipo === 'presencial' ? Stethoscope : Video

  async function handleCancelar() {
    if (!confirm('Cancelar esta consulta? O vet será notificado.')) return
    setCanceling(true)
    setError('')
    const { error: dbError } = await supabase
      .from('consultas_vet')
      .update({ status: 'cancelada' })
      .eq('id', consulta.id)
    setCanceling(false)
    if (dbError) {
      setError('Erro ao cancelar. Tente novamente.')
      return
    }
    router.refresh()
  }

  return (
    <Card variant="default">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-mute" strokeWidth={1.5} />
              <p className="font-semibold text-ink truncate">
                {consulta.veterinarios?.nome ?? 'Veterinário'}
              </p>
            </div>
            {consulta.veterinarios?.crmv && (
              <p className="text-xs text-mute mt-0.5">{consulta.veterinarios.crmv}</p>
            )}
          </div>
          <Badge variant={statusVariant[consulta.status] ?? 'mute'}>
            {statusLabel[consulta.status] ?? consulta.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-sm text-mute">
          <Calendar className="h-4 w-4" strokeWidth={1.5} />
          <span>{dataFmt}</span>
          <span aria-hidden="true">·</span>
          <span>{consulta.tipo === 'presencial' ? 'Presencial' : 'Online'}</span>
        </div>

        {consulta.motivo && (
          <p className="text-sm text-mute leading-relaxed line-clamp-2">{consulta.motivo}</p>
        )}

        <div className="flex items-center justify-between border-t border-border pt-3">
          {consulta.preco ? (
            <p className="font-semibold text-ink">{formatCurrency(consulta.preco)}</p>
          ) : (
            <span className="text-sm text-mute">Preço a combinar</span>
          )}
          {consulta.status === 'agendada' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelar}
              disabled={canceling}
              className="text-negative hover:text-negative"
            >
              {canceling ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cancelar consulta'}
            </Button>
          )}
        </div>

        {error && <p className="text-xs text-negative">{error}</p>}
      </CardContent>
    </Card>
  )
}
