import Link from 'next/link'
import { Truck, HeartPulse, ShoppingBag, Plus, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import type { Profile, Frete, ConsultaVet } from '@/types/database'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FRETE_STATUS_LABELS, GADO_TIPO_LABELS } from '@/lib/constants'

interface Props {
  profile: Profile
  fretes: Frete[]
  consultas: ConsultaVet[]
}

const freteStatusVariant: Record<string, 'positive' | 'warning' | 'negative' | 'mute'> = {
  pendente: 'warning',
  confirmado: 'positive',
  em_andamento: 'primary' as 'positive',
  concluido: 'mute',
  cancelado: 'negative',
}

export function DashboardProdutor({ profile, fretes, consultas }: Props) {
  const fretesAtivos = fretes.filter(f => ['pendente', 'confirmado', 'em_andamento'].includes(f.status))

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="display-sm text-ink">Olá, {profile.nome.split(' ')[0]}</h1>
        <p className="body-md text-mute mt-1">{profile.fazenda ?? 'Sua fazenda'} · {profile.cidade}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Cabeças', value: profile.cabecas.toLocaleString('pt-BR'), icon: '🐄' },
          { label: 'Hectares', value: profile.hectares.toLocaleString('pt-BR'), icon: '🌾' },
          { label: 'Fretes ativos', value: fretesAtivos.length, icon: '🚛' },
          { label: 'Avaliação', value: `${profile.avaliacao.toFixed(1)} ★`, icon: '⭐' },
        ].map(stat => (
          <Card key={stat.label} variant="default">
            <CardContent>
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="display-xs text-ink">{stat.value}</p>
              <p className="caption text-mute mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="dark">
          <CardContent className="flex flex-col gap-4">
            <Truck className="h-8 w-8" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-lg">Solicitar frete</p>
              <p className="text-sm opacity-70 mt-1">Encontre motoristas disponíveis</p>
            </div>
            <Button variant="primary" size="sm" asChild>
              <Link href="/fretes/novo"><Plus className="h-4 w-4" /> Novo frete</Link>
            </Button>
          </CardContent>
        </Card>

        <Card variant="sage">
          <CardContent className="flex flex-col gap-4">
            <HeartPulse className="h-8 w-8 text-ink" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-lg text-ink">Saúde animal</p>
              <p className="text-sm text-mute mt-1">Vacinas, antiparasitários e mais</p>
            </div>
            <Button variant="tertiary" size="sm" asChild>
              <Link href="/saude">Ver produtos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card variant="sage">
          <CardContent className="flex flex-col gap-4">
            <ShoppingBag className="h-8 w-8 text-ink" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-lg text-ink">Loja</p>
              <p className="text-sm text-mute mt-1">Revendas e fabricantes perto de você</p>
            </div>
            <Button variant="tertiary" size="sm" asChild>
              <Link href="/loja">Explorar</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Últimos fretes */}
      {fretes.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="display-xs text-ink">Seus fretes</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/fretes" className="flex items-center gap-1">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {fretes.map(f => (
              <Card key={f.id} variant="default">
                <CardContent className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{f.origem} → {f.destino}</p>
                    <p className="text-sm text-mute mt-0.5">
                      {f.cabecas} {GADO_TIPO_LABELS[f.tipo_gado]} · {formatDate(f.data_embarque)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {f.preco_total && (
                      <p className="font-semibold text-ink">{formatCurrency(f.preco_total)}</p>
                    )}
                    <Badge variant={freteStatusVariant[f.status] ?? 'mute'}>
                      {FRETE_STATUS_LABELS[f.status]}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
