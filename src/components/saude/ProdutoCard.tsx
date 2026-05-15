'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Package } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import type { ProdutoSaude } from '@/types/database'
import { formatCurrency } from '@/lib/utils'
import { PRODUTO_TIPO_LABELS } from '@/lib/constants'

const estoqueVariant: Record<string, 'positive' | 'warning' | 'negative'> = {
  ok: 'positive',
  low: 'warning',
  out: 'negative',
}
const estoqueLabel: Record<string, string> = {
  ok: 'Em estoque',
  low: 'Pouco estoque',
  out: 'Sem estoque',
}

interface Props { produto: ProdutoSaude }

export function ProdutoCard({ produto }: Props) {
  const [peso, setPeso] = useState('')
  const [doseCalc, setDoseCalc] = useState<string | null>(null)

  function calcularDose() {
    const p = parseFloat(peso)
    if (isNaN(p) || p <= 0) { setDoseCalc('Informe um peso válido'); return }
    const formula = produto.dose_formula
    if (formula.includes('ml para cada')) {
      const match = formula.match(/(\d+(?:\.\d+)?)ml para cada (\d+)kg/)
      if (match) {
        const dose = (p * parseFloat(match[1])) / parseFloat(match[2])
        setDoseCalc(`${dose.toFixed(1)} ml · Via ${produto.via}`)
        return
      }
    }
    setDoseCalc(`${formula} · Via ${produto.via}`)
  }

  return (
    <Card variant="default" className="flex flex-col gap-0">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink leading-tight">{produto.nome}</p>
            {produto.marca && <p className="text-sm text-mute">{produto.marca}</p>}
          </div>
          <Badge variant={estoqueVariant[produto.estoque]}>{estoqueLabel[produto.estoque]}</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="mute">{PRODUTO_TIPO_LABELS[produto.tipo]}</Badge>
          {produto.via && <span className="text-xs text-mute">Via {produto.via}</span>}
        </div>

        {produto.descricao && (
          <p className="text-sm text-mute leading-relaxed">{produto.descricao}</p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-canvas-soft">
          <div>
            <p className="font-semibold text-ink">{formatCurrency(produto.preco)}</p>
            <p className="text-xs text-mute">por {produto.preco_unidade}</p>
          </div>
          {produto.lojas && (
            <p className="text-xs text-mute text-right">{(produto.lojas as { nome: string; cidade: string }).nome}</p>
          )}
        </div>

        <details className="group">
          <summary className="flex items-center gap-1 text-sm font-semibold text-ink cursor-pointer list-none">
            <Package className="h-4 w-4" strokeWidth={1.5} />
            Calcular dose
            <ChevronDown className="h-4 w-4 ml-auto group-open:hidden" />
            <ChevronUp className="h-4 w-4 ml-auto hidden group-open:block" />
          </summary>
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-xs text-mute">Fórmula: {produto.dose_formula}</p>
            <div className="flex gap-2">
              <input
                type="number"
                value={peso}
                onChange={e => setPeso(e.target.value)}
                placeholder="Peso do animal (kg)"
                className="flex-1 bg-canvas-soft text-ink rounded-md px-4 py-3 text-sm border border-canvas-soft focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={calcularDose}
                className="px-4 py-3 bg-primary text-ink text-sm font-semibold rounded-xl hover:bg-primary-hover transition-colors"
              >
                Calcular
              </button>
            </div>
            {doseCalc && (
              <p className="text-sm font-semibold text-positive-deep bg-primary-pale px-3 py-2 rounded-md">
                {doseCalc}
              </p>
            )}
          </div>
        </details>
      </CardContent>
    </Card>
  )
}
