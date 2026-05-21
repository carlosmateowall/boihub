import Link from 'next/link'
import {
  Package, MessageCircle, Sparkles, Plus, ShoppingBag, Store, ArrowRight,
} from 'lucide-react'
import { Greeting } from '@/components/shared/Greeting'
import { StatCard } from '@/components/shared/StatCard'
import { SectionHead } from '@/components/shared/SectionHead'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { whatsappLink } from '@/lib/constants'
import type { Profile } from '@/types/database'

interface Props {
  profile: Profile
  /** Loja vinculada ao user_id, se já cadastrada */
  loja?: { id: string; nome: string; premium: boolean } | null
  /** Quantidade de produtos cadastrados nessa loja */
  produtosCount?: number
}

export function DashboardRevenda({ profile, loja, produtosCount = 0 }: Props) {
  const isFabricante = profile.perfil === 'fabricante'
  const label = isFabricante ? 'Fabricante' : 'Revenda'

  return (
    <div className="flex flex-col gap-7">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <Greeting
          nome={profile.nome.split(' ')[0]}
          sub={loja?.nome ?? profile.cidade ?? '—'}
          eyebrow={label}
          info={
            loja
              ? `${produtosCount} ${produtosCount === 1 ? 'produto cadastrado' : 'produtos cadastrados'}`
              : 'Cadastre sua loja para começar a aparecer pros produtores'
          }
        />
        {loja?.premium && (
          <Badge variant="gold" size="md">
            <Sparkles className="h-3 w-3" /> Destaque ativo
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-4">
        <StatCard
          icon={Package}
          label="produtos"
          value={produtosCount}
          sub="no catálogo"
        />
        <StatCard
          icon={ShoppingBag}
          label="visualizações"
          value="—"
          sub="em breve"
        />
        <StatCard
          icon={MessageCircle}
          label="mensagens"
          value="—"
          sub="via WhatsApp"
        />
        <StatCard
          icon={Sparkles}
          label="status"
          value={loja?.premium ? 'Premium' : 'Free'}
          sub={loja?.premium ? 'destaque ativo' : 'sem destaque'}
        />
      </div>

      {!loja ? (
        <section className="rounded-xl border border-border bg-canvas p-8 lg:p-10 text-center flex flex-col items-center gap-4">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-md bg-verde-900/[0.06] text-verde-900">
            <Store className="h-7 w-7" strokeWidth={1.5} />
          </span>
          <div className="max-w-md">
            <h2 className="bh-display text-[22px] text-ink">Cadastre sua {label.toLowerCase()}</h2>
            <p className="text-[13.5px] text-ink-soft mt-1.5">
              Pra aparecer pros produtores do Centro-Oeste e receber pedidos de orçamento via
              WhatsApp, abra um chamado pra equipe BoiHub te onboardar.
            </p>
          </div>
          <Button variant="primary" size="md" asChild>
            <Link
              href={whatsappLink(`Olá! Sou ${label.toLowerCase()} e quero cadastrar no BoiHub.`)}
              target="_blank"
            >
              <MessageCircle className="h-4 w-4" /> Falar com a equipe
            </Link>
          </Button>
        </section>
      ) : (
        <section>
          <div className="flex items-end justify-between gap-4 mb-3.5">
            <div className="flex flex-col gap-1">
              <span className="bh-eyebrow text-mute">catálogo</span>
              <h2 className="bh-display text-[22px] leading-tight text-ink m-0">
                Meus produtos{' '}
                <span className="text-mute font-normal">· {produtosCount}</span>
              </h2>
            </div>
            <Button variant="primary" size="sm" asChild>
              <Link href="/loja">
                <Plus className="h-4 w-4" /> Adicionar produto
              </Link>
            </Button>
          </div>
          <div className="rounded-lg border border-border bg-canvas p-6 text-center">
            <p className="text-[13px] text-mute">
              Edição de catálogo direto pelo app vai chegar nos próximos sprints. Por
              enquanto, fala com a equipe via WhatsApp pra incluir/atualizar produtos.
            </p>
          </div>
        </section>
      )}

      <section>
        <SectionHead title="Patrocínio" eyebrow="visibilidade extra" />
        <div className="rounded-lg bg-verde-900 text-ink-on-dark p-5 lg:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-ouro">
              <Sparkles className="h-3.5 w-3.5" /> Premium · Centro-Oeste
            </span>
            {loja?.premium ? (
              <Badge variant="positive" size="sm">Ativo</Badge>
            ) : (
              <Badge variant="onDark" size="sm">Inativo</Badge>
            )}
          </div>
          <div>
            <p className="bh-display text-[22px] text-ink-on-dark">R$ 199<span className="text-[14px] text-ink-on-dark-mute font-normal">/mês</span></p>
            <p className="text-[12.5px] text-ink-on-dark-mute mt-1 max-w-md leading-relaxed">
              Sua loja aparece no topo das buscas de produtores no DF, GO, MT e MG. Cancele
              quando quiser.
            </p>
          </div>
          <Button variant="accent" size="md" className="w-full lg:w-auto" asChild>
            <Link
              href={whatsappLink('Olá! Quero ativar/saber mais sobre o BoiHub Premium pra minha loja.')}
              target="_blank"
            >
              {loja?.premium ? 'Ver relatório' : 'Ativar Premium'}{' '}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
