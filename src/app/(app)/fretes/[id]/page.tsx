import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Truck, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { FreteActions } from '@/components/fretes/FreteActions'
import { formatDate, formatCurrency } from '@/lib/utils'
import { FRETE_STATUS_LABELS, GADO_TIPO_LABELS } from '@/lib/constants'
import type { Frete } from '@/types/database'

export default async function FreteDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: freteData } = await supabase
    .from('fretes')
    .select('*, motoristas(nome, caminhao, avaliacao, whatsapp)')
    .eq('id', id)
    .single()

  const frete = freteData as Frete | null
  if (!frete) notFound()

  const statusVariant: Record<string, 'positive' | 'warning' | 'negative' | 'mute'> = {
    pendente: 'warning', confirmado: 'positive', em_andamento: 'positive', concluido: 'mute', cancelado: 'negative',
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/fretes"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="display-sm text-ink">Detalhes do frete</h1>
      </div>

      <Card variant="default">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 font-semibold text-ink">
              <MapPin className="h-5 w-5 text-mute" strokeWidth={1.5} />
              {frete.origem} → {frete.destino}
            </div>
            <Badge variant={statusVariant[frete.status] ?? 'mute'}>
              {FRETE_STATUS_LABELS[frete.status]}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-mute">Cabeças</p>
              <p className="font-semibold text-ink mt-1">{frete.cabecas} cab.</p>
            </div>
            <div>
              <p className="text-mute">Tipo</p>
              <p className="font-semibold text-ink mt-1">{GADO_TIPO_LABELS[frete.tipo_gado]}</p>
            </div>
            <div>
              <p className="text-mute">Embarque</p>
              <p className="font-semibold text-ink mt-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {formatDate(frete.data_embarque)}
              </p>
            </div>
            {frete.peso_medio_kg && (
              <div>
                <p className="text-mute">Peso médio</p>
                <p className="font-semibold text-ink mt-1">{frete.peso_medio_kg} kg</p>
              </div>
            )}
          </div>

          {frete.observacoes && (
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-mute">{frete.observacoes}</p>
            </div>
          )}

          {frete.preco_total && (
            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-mute text-sm">Valor total</span>
              <span className="display-xs text-ink">{formatCurrency(frete.preco_total)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {frete.motoristas && (
        <Card variant="sage">
          <CardContent className="flex flex-col gap-3">
            <p className="font-semibold text-ink flex items-center gap-2">
              <Truck className="h-5 w-5" strokeWidth={1.5} /> Motorista
            </p>
            <div>
              <p className="font-semibold text-ink">{frete.motoristas.nome}</p>
              <p className="text-sm text-mute">{frete.motoristas.caminhao}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {frete.avaliacao_produtor && (
        <Card variant="default">
          <CardContent className="flex items-center justify-between">
            <p className="font-semibold text-ink flex items-center gap-2">
              <Star className="h-5 w-5 text-primary fill-primary" strokeWidth={1.5} /> Sua avaliação
            </p>
            <p className="display-xs text-ink">
              {frete.avaliacao_produtor.toFixed(1)}
              <span className="text-sm text-mute font-normal"> / 5</span>
            </p>
          </CardContent>
        </Card>
      )}

      <FreteActions frete={frete} />
    </div>
  )
}
