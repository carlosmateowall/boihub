import Link from 'next/link'
import {
  Truck, Stethoscope, ShoppingBag, Package, Tractor, Factory,
  ArrowRight, Users, Star, MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { label: 'Produtores', value: '2.400+' },
  { label: 'Fretes realizados', value: '18.000+' },
  { label: 'Veterinários', value: '340+' },
  { label: 'Lojas parceiras', value: '120+' },
]

const features = [
  {
    icon: Truck,
    title: 'Fretes bovinos',
    desc: 'Encontre motoristas especializados em transporte de gado na sua região com preços competitivos.',
    variant: 'sage' as const,
  },
  {
    icon: Stethoscope,
    title: 'Veterinários online',
    desc: 'Consultas com especialistas em bovinos de corte e leite sem sair da fazenda.',
    variant: 'dark' as const,
  },
  {
    icon: ShoppingBag,
    title: 'Marketplace agro',
    desc: 'Revendas e fabricantes de insumos direto no seu celular, com entrega na fazenda.',
    variant: 'sage' as const,
  },
  {
    icon: Package,
    title: 'Suplementação',
    desc: 'Catálogo completo de suplementos minerais, proteinados e energéticos com comparação de preços.',
    variant: 'dark' as const,
  },
  {
    icon: Tractor,
    title: 'Saúde animal',
    desc: 'Vacinas, antiparasitários e antibióticos com calculadora de dosagem integrada.',
    variant: 'sage' as const,
  },
  {
    icon: Star,
    title: 'Avaliações',
    desc: 'Sistema de reputação para produtores, motoristas e veterinários — confiança em cada transação.',
    variant: 'dark' as const,
  },
]

const perfis = [
  { icon: Tractor, label: 'Produtor Rural', desc: 'Gerencie sua fazenda, contrate fretes e compre insumos.' },
  { icon: Stethoscope, label: 'Veterinário', desc: 'Ofereça consultas online e presenciais para produtores.' },
  { icon: Truck, label: 'Motorista', desc: 'Encontre fretes de gado e aumente sua rota.' },
  { icon: ShoppingBag, label: 'Revenda', desc: 'Venda seus produtos para produtores rurais.' },
  { icon: Factory, label: 'Fabricante', desc: 'Distribua seus insumos diretamente ao produtor.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas-soft">
      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-16 py-6 bg-canvas">
        <div className="flex items-center gap-1">
          <span className="font-display font-extrabold text-2xl text-ink">Boi</span>
          <span className="font-display font-extrabold text-2xl text-primary">Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/cadastro">Criar conta</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-canvas-soft px-6 lg:px-16 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-positive-deep bg-primary-pale px-4 py-2 rounded-pill w-fit">
                  <MapPin className="h-4 w-4" /> Centro-Oeste do Brasil
                </span>
                <h1 className="display-xl text-ink leading-none">
                  Sua fazenda<br />
                  <span className="text-positive-deep">na palma</span><br />
                  da mão.
                </h1>
                <p className="body-lg text-body max-w-md">
                  O super app do pecuarista brasileiro. Fretes, veterinários, insumos e muito mais — tudo em um só lugar.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" size="lg" asChild>
                  <Link href="/cadastro">Começar grátis <ArrowRight className="h-5 w-5" /></Link>
                </Button>
                <Button variant="tertiary" size="lg" asChild>
                  <Link href="/login">Já tenho conta</Link>
                </Button>
              </div>
            </div>

            {/* Quick actions card */}
            <div className="bg-canvas rounded-xl p-6 flex flex-col gap-4">
              <p className="font-semibold text-ink">O que você precisa hoje?</p>
              {[
                { icon: Truck, label: 'Solicitar frete de gado', href: '/cadastro' },
                { icon: Stethoscope, label: 'Falar com veterinário', href: '/cadastro' },
                { icon: ShoppingBag, label: 'Comprar vacinas e insumos', href: '/cadastro' },
                { icon: Package, label: 'Calcular suplementação', href: '/cadastro' },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-xl bg-canvas-soft hover:bg-primary-pale transition-colors group"
                >
                  <div className="p-2 rounded-lg bg-canvas group-hover:bg-primary transition-colors">
                    <item.icon className="h-5 w-5 text-ink" strokeWidth={1.5} />
                  </div>
                  <span className="font-semibold text-sm text-ink">{item.label}</span>
                  <ArrowRight className="h-4 w-4 text-mute ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-ink px-6 lg:px-16 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col gap-1">
              <p className="display-md text-primary">{s.value}</p>
              <p className="body-md text-canvas opacity-60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 lg:px-16 py-12 bg-canvas">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center">
            <h2 className="display-md text-ink">Tudo que sua fazenda precisa</h2>
            <p className="body-lg text-mute mt-4 max-w-xl mx-auto">
              Do frete ao veterinário, do insumo ao suplemento — o BoiHub centraliza o agronegócio bovino.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(f => (
              <div
                key={f.title}
                className={`rounded-xl p-6 flex flex-col gap-4 ${f.variant === 'dark' ? 'bg-ink text-canvas' : 'bg-canvas-soft'}`}
              >
                <f.icon
                  className={`h-8 w-8 ${f.variant === 'dark' ? 'text-primary' : 'text-ink'}`}
                  strokeWidth={1.5}
                />
                <div>
                  <p className={`font-semibold text-lg ${f.variant === 'dark' ? 'text-canvas' : 'text-ink'}`}>
                    {f.title}
                  </p>
                  <p className={`text-sm mt-1 leading-relaxed ${f.variant === 'dark' ? 'opacity-60' : 'text-mute'}`}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfis */}
      <section className="px-6 lg:px-16 py-20 bg-canvas-soft">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center">
            <h2 className="display-md text-ink">Para quem é o BoiHub?</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perfis.map(p => (
              <div key={p.label} className="bg-canvas rounded-xl p-6 flex flex-col gap-3">
                <p.icon className="h-8 w-8 text-ink" strokeWidth={1.5} />
                <div>
                  <p className="font-semibold text-ink">{p.label}</p>
                  <p className="text-sm text-mute mt-1">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-ink px-6 lg:px-16 py-20">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-8">
          <h2 className="display-md text-primary">Pronto para modernizar sua operação?</h2>
          <p className="body-lg text-canvas opacity-70">
            Junte-se a mais de 2.400 produtores rurais que já usam o BoiHub para gerir sua pecuária com mais eficiência.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/cadastro">Criar conta grátis <ArrowRight className="h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink border-t border-canvas/10 px-6 lg:px-16 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="font-display font-extrabold text-xl text-canvas">Boi</span>
            <span className="font-display font-extrabold text-xl text-primary">Hub</span>
          </div>
          <p className="text-sm text-canvas opacity-40">© 2026 BoiHub. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-canvas opacity-60">boihub.com.br</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
