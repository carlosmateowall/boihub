import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import type { Suplemento } from '@/types/database'
import { formatCurrency } from '@/lib/utils'
import { SUPLEMENTO_CATEGORIA_LABELS } from '@/lib/constants'

interface Props { suplemento: Suplemento }

export function SuplementoCard({ suplemento: s }: Props) {
  return (
    <Card variant="default">
      <CardContent className="flex flex-col gap-3">
        <div>
          <p className="font-semibold text-ink">{s.nome}</p>
          {s.marca && <p className="text-sm text-mute">{s.marca}</p>}
        </div>

        <Badge variant="mute">{SUPLEMENTO_CATEGORIA_LABELS[s.categoria]}</Badge>

        {s.descricao && (
          <p className="text-sm text-mute leading-relaxed line-clamp-2">{s.descricao}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-canvas-soft">
          <div>
            {s.preco ? (
              <>
                <p className="font-semibold text-ink">{formatCurrency(s.preco)}</p>
                {s.embalagem && <p className="text-xs text-mute">{s.embalagem}</p>}
              </>
            ) : (
              <p className="text-sm text-mute">Consulte o preço</p>
            )}
          </div>
          {s.peso_kg && (
            <span className="text-xs bg-canvas-soft text-mute px-2 py-1 rounded-md">
              {s.peso_kg} kg
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
