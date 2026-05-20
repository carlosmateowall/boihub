import Link from 'next/link'
import { ArrowRight, MapPin, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import type { Frete } from '@/types/database'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FRETE_STATUS_LABELS, GADO_TIPO_LABELS } from '@/lib/constants'

const statusVariant: Record<string, 'positive' | 'warning' | 'negative' | 'mute'> = {
  pendente: 'warning',
  confirmado: 'positive',
  em_andamento: 'positive',
  concluido: 'mute',
  cancelado: 'negative',
}

interface Props { frete: Frete }

export function FreteCard({ frete }: Props) {
  return (
    <Link href={`/fretes/${frete.id}`}>
      <Card variant="default" className="hover:bg-canvas-soft transition-colors cursor-pointer">
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 text-ink font-semibold">
              <MapPin className="h-4 w-4 text-mute shrink-0" strokeWidth={1.5} />
              <span className="truncate">{frete.origem} → {frete.destino}</span>
            </div>
            <Badge variant={statusVariant[frete.status] ?? 'mute'}>
              {FRETE_STATUS_LABELS[frete.status]}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-mute">
            <span>{frete.cabecas} cab. · {GADO_TIPO_LABELS[frete.tipo_gado]}</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(frete.data_embarque)}
            </div>
          </div>

          {frete.preco_total && (
            <div className="flex items-center justify-between pt-1 border-t border-border">
              <span className="text-sm text-mute">Valor total</span>
              <span className="font-semibold text-ink">{formatCurrency(frete.preco_total)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
