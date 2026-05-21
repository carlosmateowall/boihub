import Link from 'next/link'
import {
  Truck, Wallet, Star, MapPin, ArrowDown, ChevronRight, SlidersHorizontal,
} from 'lucide-react'
import { Greeting } from '@/components/shared/Greeting'
import { StatCard } from '@/components/shared/StatCard'
import { SectionHead } from '@/components/shared/SectionHead'
import { ListContainer, ListRow } from '@/components/shared/ListContainer'
import { Dot } from '@/components/shared/Dot'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import type { Profile, Frete } from '@/types/database'

interface Props {
  profile: Profile
  /** Fretes disponíveis pra esse motorista pegar (sem motorista_id ainda) */
  disponiveis: Frete[]
  /** Fretes onde esse motorista está atribuído e em andamento */
  emAndamento: Frete | null
  /** Fretes concluídos aguardando payout */
  pendingPayouts: Frete[]
}

export function DashboardMotorista({
  profile,
  disponiveis,
  emAndamento,
  pendingPayouts,
}: Props) {
  const totalPayout = pendingPayouts.reduce((acc, f) => acc + (f.preco_total ?? 0), 0)

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <Greeting
          nome={profile.nome.split(' ')[0]}
          sub={profile.cidade ?? '—'}
          eyebrow="Motorista"
          info={
            disponiveis.length > 0
              ? `${disponiveis.length} fretes disponíveis na sua região`
              : 'Sem fretes disponíveis no momento'
          }
        />
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-verde-400/[0.12] border border-verde-400/25">
          <Dot tone="positive" size={7} />
          <span className="text-[12px] font-semibold text-verde-700">Disponível</span>
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-4">
        <StatCard
          icon={Truck}
          label="viagens"
          value={profile.fretes_count ?? 0}
          sub="total no app"
        />
        <StatCard
          icon={Wallet}
          label="a receber"
          value={(totalPayout / 1000).toFixed(1)}
          suffix="mil"
          sub={`${pendingPayouts.length} fretes`}
        />
        <StatCard
          icon={Star}
          label="avaliação"
          value={(profile.avaliacao ?? 0).toFixed(1)}
          suffix="/5"
          sub="média geral"
        />
        <StatCard
          icon={Truck}
          label="ativos"
          value={emAndamento ? 1 : 0}
          sub="em andamento"
        />
      </div>

      {emAndamento && (
        <Card variant="dark" padding="lg">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Dot tone="positive" size={8} />
              <span className="bh-eyebrow text-verde-400">em andamento agora</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">
              <div>
                <p className="bh-display text-[22px] lg:text-[26px] leading-tight text-ink-on-dark">
                  {emAndamento.origem}
                </p>
                <div className="flex items-center gap-2 my-2 text-verde-400 text-[12px] font-semibold">
                  <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                  <span>
                    {emAndamento.cabecas} cabeças · {emAndamento.tipo_gado}
                  </span>
                </div>
                <p className="bh-display text-[22px] lg:text-[26px] leading-tight text-ink-on-dark">
                  {emAndamento.destino}
                </p>
                <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
                  <div>
                    <p className="text-[11px] text-ink-on-dark-mute uppercase tracking-wider font-semibold">
                      Embarque
                    </p>
                    <p className="text-[13.5px] font-semibold mt-0.5">
                      {emAndamento.data_embarque
                        ? new Date(emAndamento.data_embarque).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                          })
                        : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-on-dark-mute uppercase tracking-wider font-semibold">
                      Valor
                    </p>
                    <p className="bh-num text-[22px] text-verde-400 mt-0">
                      {emAndamento.preco_total
                        ? formatCurrency(emAndamento.preco_total)
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <Button variant="accent" size="lg" className="w-full" asChild>
                  <Link href={`/fretes/${emAndamento.id}`}>
                    Atualizar etapa <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <section>
        <div className="flex items-end justify-between gap-4 mb-3.5">
          <div className="flex flex-col gap-1">
            <span className="bh-eyebrow text-mute">na sua região</span>
            <h2 className="bh-display text-[22px] leading-tight text-ink m-0">
              Fretes disponíveis{' '}
              <span className="text-mute font-normal">· {disponiveis.length}</span>
            </h2>
          </div>
          <Button variant="secondary" size="sm" className="hidden lg:inline-flex">
            <SlidersHorizontal className="h-4 w-4" /> Filtros
          </Button>
        </div>

        {disponiveis.length === 0 ? (
          <div className="rounded-lg border border-border bg-canvas p-8 text-center">
            <Truck className="h-7 w-7 mx-auto text-mute mb-3" strokeWidth={1.5} />
            <p className="font-semibold text-ink">Nenhum frete disponível</p>
            <p className="text-[13px] text-mute mt-1 max-w-md mx-auto">
              Quando produtores criarem fretes na sua região, eles aparecem aqui pra você
              aceitar.
            </p>
          </div>
        ) : (
          <ListContainer>
            {disponiveis.slice(0, 5).map(f => (
              <ListRow key={f.id}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-canvas-warm border border-border text-mute shrink-0">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink truncate">
                    {f.origem} → {f.destino}
                  </p>
                  <p className="text-[12px] text-mute mt-0.5">
                    {f.cabecas} cab · {f.tipo_gado} ·{' '}
                    {f.data_embarque
                      ? new Date(f.data_embarque).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })
                      : '—'}
                  </p>
                </div>
                {f.preco_total != null && (
                  <span className="bh-num text-[16px] text-ink">
                    {formatCurrency(f.preco_total)}
                  </span>
                )}
                <Button variant="primary" size="sm">Aceitar</Button>
              </ListRow>
            ))}
          </ListContainer>
        )}
      </section>

      {pendingPayouts.length > 0 && (
        <section>
          <SectionHead
            title="Pagamentos a receber"
            count={formatCurrency(totalPayout)}
            eyebrow="aguardando payout"
          />
          <ListContainer>
            {pendingPayouts.slice(0, 5).map(f => (
              <ListRow key={f.id}>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-verde-400/[0.12] text-verde-700 shrink-0">
                  <Wallet className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-ink truncate">
                    {f.origem} → {f.destino}
                  </p>
                  <p className="text-[12px] text-mute mt-0.5">
                    Concluído em{' '}
                    {new Date(f.updated_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </p>
                </div>
                <span className="bh-num text-[17px] text-ink">
                  {f.preco_total ? formatCurrency(f.preco_total) : '—'}
                </span>
              </ListRow>
            ))}
          </ListContainer>
        </section>
      )}
    </div>
  )
}
