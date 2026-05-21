import Link from 'next/link'
import { Calculator, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import type { ProdutoSaude } from '@/types/database'
import { formatCurrency } from '@/lib/utils'
import { PRODUTO_TIPO_LABELS } from '@/lib/constants'
import { parseDoseFormula, describeFormula } from '@/lib/dosagem'

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
  const formula = parseDoseFormula(produto.dose_formula)
  const lojaNome = (produto.lojas as { nome: string; cidade: string | null } | null)?.nome

  return (
    <Card variant="default" className="flex flex-col gap-0">
      <CardContent className="flex flex-col gap-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink leading-tight">{produto.nome}</p>
            {produto.marca && <p className="text-[12.5px] text-mute mt-0.5">{produto.marca}</p>}
          </div>
          <Badge variant={estoqueVariant[produto.estoque]} size="sm">
            {estoqueLabel[produto.estoque]}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="neutral" size="sm">{PRODUTO_TIPO_LABELS[produto.tipo]}</Badge>
          {produto.via && (
            <Badge variant="info" size="sm">Via {produto.via}</Badge>
          )}
          {produto.carencia_dias > 0 && (
            <Badge variant="warning" size="sm">
              <Clock className="h-3 w-3" /> {produto.carencia_dias}d carência
            </Badge>
          )}
        </div>

        {produto.descricao && (
          <p className="text-[13px] text-mute leading-relaxed line-clamp-2">{produto.descricao}</p>
        )}

        {formula && (
          <p className="text-[12.5px] text-ink-soft border-l-2 border-verde-400 pl-2.5">
            Dose: <span className="font-semibold text-ink">{describeFormula(formula)}</span>
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            <p className="bh-num text-[18px] text-ink leading-none">
              {formatCurrency(produto.preco)}
            </p>
            <p className="text-[11.5px] text-mute mt-0.5">por {produto.preco_unidade}</p>
          </div>
          {lojaNome && (
            <p className="text-[11.5px] text-mute text-right truncate max-w-[120px]">
              {lojaNome}
            </p>
          )}
        </div>

        <Button variant="secondary" size="sm" className="w-full" asChild>
          <Link href={`/saude/calculadora?produto=${produto.id}`}>
            <Calculator className="h-4 w-4" /> Calcular dose
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
