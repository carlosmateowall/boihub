import Link from 'next/link'
import {
  CalendarCheck, Star, TrendingUp, Hourglass, Inbox, Stethoscope, MapPin, Video,
} from 'lucide-react'
import { Greeting } from '@/components/shared/Greeting'
import { StatCard } from '@/components/shared/StatCard'
import { SectionHead } from '@/components/shared/SectionHead'
import { ListContainer, ListRow } from '@/components/shared/ListContainer'
import { Avatar } from '@/components/shared/Avatar'
import { Badge } from '@/components/shared/Badge'
import { Dot } from '@/components/shared/Dot'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import type { Profile, ConsultaVet } from '@/types/database'

interface Props {
  profile: Profile
  consultas: ConsultaVet[]
}

export function DashboardVet({ profile, consultas }: Props) {
  const agendadas = consultas.filter(c => c.status === 'agendada')
  const concluidas = consultas.filter(c => c.status === 'concluida')
  const receitaMes = concluidas.reduce((acc, c) => acc + (c.preco ?? 0), 0)
  const totalConsultas = consultas.length
  const avgRating = (() => {
    const rated = concluidas.filter(c => c.avaliacao != null)
    if (rated.length === 0) return profile.avaliacao ?? 0
    return rated.reduce((acc, c) => acc + (c.avaliacao ?? 0), 0) / rated.length
  })()

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <Greeting
          nome={profile.nome.split(' ').slice(-1)[0] || profile.nome}
          sub={profile.cidade ?? '—'}
          eyebrow="Veterinário"
          info={
            agendadas.length > 0
              ? `${agendadas.length} ${agendadas.length === 1 ? 'consulta marcada' : 'consultas marcadas'}`
              : 'Nenhuma consulta aguardando confirmação no momento'
          }
        />
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-verde-400/[0.12] border border-verde-400/25">
          <Dot tone="positive" size={7} />
          <span className="text-[12px] font-semibold text-verde-700">Aceitando</span>
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-4">
        <StatCard
          icon={CalendarCheck}
          label="consultas"
          value={totalConsultas}
          sub="no total"
        />
        <StatCard
          icon={Star}
          label="avaliação"
          value={avgRating.toFixed(1)}
          suffix="/5"
          sub={`de ${concluidas.length} atend.`}
        />
        <StatCard
          icon={TrendingUp}
          label="receita"
          value={(receitaMes / 1000).toFixed(1)}
          suffix="mil"
          sub="R$ acumulado"
        />
        <StatCard
          icon={Hourglass}
          label="pendentes"
          value={agendadas.length}
          sub="aguard. resp."
        />
      </div>

      <section>
        <SectionHead
          eyebrow="ouro · responda em 4h"
          title="Solicitações aguardando confirmação"
          count={agendadas.length}
          action={agendadas.length > 0 ? 'Ver tudo' : undefined}
          actionHref="/saude/consultas"
        />
        {agendadas.length === 0 ? (
          <div className="rounded-lg border border-border bg-canvas p-8 text-center">
            <Inbox className="h-8 w-8 mx-auto text-mute mb-3" strokeWidth={1.5} />
            <p className="font-semibold text-ink">Nenhuma solicitação no momento</p>
            <p className="text-[13px] text-mute mt-1 max-w-md mx-auto">
              Quando produtores agendarem consultas pelo BoiHub, elas aparecem aqui pra você
              aceitar ou recusar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {agendadas.slice(0, 4).map(c => (
              <div
                key={c.id}
                className="rounded-lg border border-border bg-canvas p-4 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <Avatar name="Produtor" tone="sand" size={40} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-ink truncate">
                      Produtor BoiHub
                    </p>
                    <p className="text-[12px] text-mute mt-0.5 truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3" strokeWidth={1.5} />{' '}
                      {c.veterinarios?.nome ? '—' : 'detalhes na consulta'}
                    </p>
                  </div>
                  <Badge variant={c.tipo === 'online' ? 'info' : 'neutral'} size="sm">
                    {c.tipo === 'online' ? (
                      <><Video className="h-3 w-3" /> online</>
                    ) : (
                      <><Stethoscope className="h-3 w-3" /> presencial</>
                    )}
                  </Badge>
                </div>
                {c.motivo && (
                  <p className="text-[13px] text-ink-soft leading-snug line-clamp-2">
                    “{c.motivo}”
                  </p>
                )}
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="bh-num text-[15px] text-ink">
                    {c.preco ? formatCurrency(c.preco) : 'A combinar'}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Recusar</Button>
                    <Button variant="primary" size="sm">Aceitar</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        <section>
          <SectionHead title="Histórico recente" eyebrow="ultimas consultas" />
          {concluidas.length === 0 ? (
            <div className="rounded-lg border border-border bg-canvas p-5 text-center">
              <p className="text-[13px] text-mute">
                Histórico fica disponível depois das primeiras consultas concluídas.
              </p>
            </div>
          ) : (
            <ListContainer>
              {concluidas.slice(0, 5).map(c => (
                <ListRow key={c.id}>
                  <Avatar name="Produtor" tone="terra" size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-ink truncate">
                      Produtor BoiHub
                    </p>
                    <p className="text-[12px] text-mute truncate">
                      {c.motivo ?? 'consulta concluída'}
                    </p>
                  </div>
                  <span className="text-[11.5px] text-mute shrink-0">
                    {c.data_consulta
                      ? new Date(c.data_consulta).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })
                      : '—'}
                  </span>
                </ListRow>
              ))}
            </ListContainer>
          )}
        </section>

        <section>
          <SectionHead title="Sua agenda" eyebrow="próximos compromissos" />
          <div className="rounded-lg border border-border bg-canvas p-5 flex flex-col gap-3">
            <p className="text-[13px] text-mute">
              A integração com calendário externo está em desenvolvimento. Por enquanto, as
              consultas aceitas aparecem em <Link href="/saude/consultas" className="text-ink underline font-semibold">Minhas consultas</Link>.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
