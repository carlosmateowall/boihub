import Link from 'next/link'
import {
  Beef, Sprout, Truck, Star, Stethoscope, Video, ArrowRight, MapPin, Sparkles,
} from 'lucide-react'
import { Greeting } from '@/components/shared/Greeting'
import { StatCard } from '@/components/shared/StatCard'
import { SectionHead } from '@/components/shared/SectionHead'
import { ActionCard } from '@/components/shared/ActionCard'
import { ListContainer, ListRow } from '@/components/shared/ListContainer'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FRETE_STATUS_LABELS, GADO_TIPO_LABELS } from '@/lib/constants'
import type { Profile, Frete, ConsultaVet } from '@/types/database'

interface Props {
  profile: Profile
  fretes: Frete[]
  consultas: ConsultaVet[]
}

const freteStatusVariant: Record<
  string,
  'positive' | 'warning' | 'negative' | 'primary' | 'neutral' | 'info'
> = {
  pendente: 'warning',
  confirmado: 'positive',
  em_andamento: 'info',
  concluido: 'neutral',
  cancelado: 'negative',
}

export function DashboardProdutor({ profile, fretes, consultas }: Props) {
  const fretesAtivos = fretes.filter(f =>
    ['pendente', 'confirmado', 'em_andamento'].includes(f.status),
  )
  const fmt = new Intl.NumberFormat('pt-BR')
  const sub = [profile.fazenda ?? 'Sua fazenda', profile.cidade]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="flex flex-col gap-7">
      <Greeting
        nome={profile.nome.split(' ')[0]}
        sub={sub}
        eyebrow="Produtor rural"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-4">
        <StatCard
          icon={Beef}
          label="cabeças"
          value={fmt.format(profile.cabecas ?? 0)}
          sub="rebanho atual"
          emphasis="hero"
        />
        <StatCard
          icon={Sprout}
          label="hectares"
          value={fmt.format(profile.hectares ?? 0)}
          sub={`${fmt.format(Math.round((profile.hectares ?? 0) * 0.4))} ha pasto`}
        />
        <StatCard
          icon={Truck}
          label="fretes"
          value={fretesAtivos.length}
          sub="ativos agora"
        />
        <StatCard
          icon={Star}
          label="avaliação"
          value={(profile.avaliacao ?? 0).toFixed(1)}
          suffix="/5"
          sub={`de ${profile.fretes_count ?? 0} negócios`}
        />
      </div>

      <section>
        <SectionHead eyebrow="atalhos" title="Ações rápidas" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ActionCard
            icon={Truck}
            title="Solicitar frete"
            sub="Combine valor com motoristas e pague via PIX"
            tone="dark"
            href="/fretes/novo"
          />
          <ActionCard
            icon={Stethoscope}
            title="Saúde animal"
            sub="Catálogo de vacinas, vermífugos e mineral"
            tone="light"
            href="/saude"
          />
          <ActionCard
            icon={Video}
            title="Encontrar veterinário"
            sub="Teleconsulta ou visita presencial"
            tone="light"
            href="/saude/veterinarios"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <section>
          <SectionHead
            title="Seus fretes"
            count={`${fretesAtivos.length} ativos`}
            action={fretes.length > 0 ? 'Ver todos' : undefined}
            actionHref="/fretes"
          />
          {fretes.length === 0 ? (
            <div className="rounded-lg border border-border bg-canvas p-6 text-center">
              <Truck className="h-7 w-7 mx-auto text-mute mb-3" strokeWidth={1.5} />
              <p className="font-semibold text-ink text-[14px]">Sem fretes ainda</p>
              <p className="text-[13px] text-mute mt-1 mb-4 max-w-xs mx-auto">
                Solicite seu primeiro frete e combine valor diretamente com o motorista.
              </p>
              <Button variant="primary" size="sm" asChild>
                <Link href="/fretes/novo">Solicitar frete</Link>
              </Button>
            </div>
          ) : (
            <ListContainer>
              {fretes.slice(0, 5).map(f => (
                <ListRow key={f.id}>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-canvas-warm border border-border text-mute shrink-0">
                    <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-ink truncate">
                      {f.origem} → {f.destino}
                    </p>
                    <p className="text-[12px] text-mute mt-0.5">
                      {f.cabecas} {GADO_TIPO_LABELS[f.tipo_gado]} ·{' '}
                      {formatDate(f.data_embarque)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {f.preco_total != null && (
                      <span className="bh-num text-[15px] text-ink">
                        {formatCurrency(f.preco_total)}
                      </span>
                    )}
                    <Badge variant={freteStatusVariant[f.status] ?? 'neutral'} size="sm">
                      {FRETE_STATUS_LABELS[f.status]}
                    </Badge>
                  </div>
                </ListRow>
              ))}
            </ListContainer>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <SectionHead
              title="Próximas consultas"
              count={consultas.length}
              action={consultas.length > 0 ? 'Agenda' : undefined}
              actionHref="/saude/consultas"
            />
            {consultas.length === 0 ? (
              <div className="rounded-lg border border-border bg-canvas p-5 text-center">
                <Stethoscope className="h-6 w-6 mx-auto text-mute mb-2" strokeWidth={1.5} />
                <p className="text-[13px] text-mute mb-3">Nenhuma consulta agendada.</p>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/saude/veterinarios">Buscar veterinário</Link>
                </Button>
              </div>
            ) : (
              <ListContainer>
                {consultas.slice(0, 3).map(c => (
                  <ListRow key={c.id}>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-canvas-warm border border-border text-mute shrink-0">
                      <Stethoscope className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold text-ink truncate">
                        {c.veterinarios?.nome ?? 'Veterinário'}
                      </p>
                      <p className="text-[12px] text-mute mt-0.5 truncate">
                        {c.data_consulta
                          ? new Date(c.data_consulta).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'a definir'}
                      </p>
                    </div>
                    <Badge variant={c.tipo === 'online' ? 'info' : 'neutral'} size="sm">
                      {c.tipo}
                    </Badge>
                  </ListRow>
                ))}
              </ListContainer>
            )}
          </div>

          <Link
            href="/fretes/novo"
            className="hidden lg:flex items-center gap-3.5 rounded-lg bg-ouro-soft border border-ouro/30 px-5 py-4 hover:border-ouro/50 transition-colors"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-ouro/20 text-warning-deep shrink-0">
              <Sparkles className="h-5 w-5" strokeWidth={1.5} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold text-warning-content">BoiHub Premium</p>
              <p className="text-[12.5px] text-warning-deep mt-0.5">
                0% de comissão em fretes acima de R$ 5 mil.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-warning-deep" strokeWidth={2} />
          </Link>
        </section>
      </div>
    </div>
  )
}

export type { Props as DashboardProdutorProps }
