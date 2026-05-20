'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatedHero } from '@/components/ui/animated-hero-section-1'
import { Button } from '@/components/ui/button'
import {
  Truck, Stethoscope, ShoppingBag, Package, Tractor, Factory, Star, Users
} from 'lucide-react'

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
  },
  {
    icon: Stethoscope,
    title: 'Veterinários online',
    desc: 'Consultas com especialistas em bovinos de corte e leite sem sair da fazenda.',
  },
  {
    icon: ShoppingBag,
    title: 'Marketplace agro',
    desc: 'Revendas e fabricantes de insumos direto no seu celular, com entrega na fazenda.',
  },
  {
    icon: Package,
    title: 'Suplementação',
    desc: 'Catálogo completo de suplementos minerais, proteinados e energéticos com comparação de preços.',
  },
  {
    icon: Tractor,
    title: 'Saúde animal',
    desc: 'Vacinas, antiparasitários e antibióticos com calculadora de dosagem integrada.',
  },
  {
    icon: Star,
    title: 'Avaliações',
    desc: 'Sistema de reputação para produtores, motoristas e veterinários — confiança em cada transação.',
  },
]

const perfis = [
  { icon: Tractor, label: 'Produtor Rural', desc: 'Gerencie sua fazenda, contrate fretes e compre insumos.' },
  { icon: Stethoscope, label: 'Veterinário', desc: 'Ofereça consultas online e presenciais para produtores.' },
  { icon: Truck, label: 'Motorista', desc: 'Encontre fretes de gado e aumente sua rota.' },
  { icon: ShoppingBag, label: 'Revenda', desc: 'Venda seus produtos para produtores rurais.' },
  { icon: Factory, label: 'Fabricante', desc: 'Distribua seus insumos diretamente ao produtor.' },
]

const navLinks = [
  { label: 'Fretes', href: '#features' },
  { label: 'Veterinários', href: '#features' },
  { label: 'Loja', href: '#features' },
  { label: 'Saúde Animal', href: '#features' },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-canvas-soft">
      <AnimatedHero
        backgroundImageUrl="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&auto=format&fit=crop&q=80"
        logo={
          <Link href="/" className="flex items-center gap-1">
            <span className="font-display font-extrabold text-2xl text-white">Boi</span>
            <span className="font-display font-extrabold text-2xl text-primary">Hub</span>
          </Link>
        }
        navLinks={navLinks}
        topRightAction={
          <Button variant="glass" size="sm" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
        }
        title="Sua fazenda na palma da mão."
        description="O super app do pecuarista brasileiro. Fretes, veterinários, insumos e muito mais — tudo em um só lugar."
        ctaButton={{
          text: 'Começar grátis',
          onClick: () => router.push('/cadastro'),
        }}
        secondaryCta={{
          text: 'Já tenho conta',
          onClick: () => router.push('/login'),
        }}
      />

      {/* Stats */}
      <section className="bg-canvas border-b border-border px-6 lg:px-16 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col gap-1">
              <p className="display-md text-primary">{s.value}</p>
              <p className="body-sm text-mute">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 lg:px-16 py-20 bg-canvas-soft">
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
                className="bg-canvas border border-border rounded-xl p-6 flex flex-col gap-4"
              >
                <f.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                <div>
                  <p className="font-semibold text-lg text-ink">{f.title}</p>
                  <p className="text-sm text-mute mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfis */}
      <section className="px-6 lg:px-16 py-20 bg-canvas">
        <div className="max-w-5xl mx-auto flex flex-col gap-12">
          <div className="text-center">
            <h2 className="display-md text-ink">Para quem é o BoiHub?</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perfis.map(p => (
              <div
                key={p.label}
                className="bg-canvas-soft border border-border rounded-xl p-6 flex flex-col gap-3"
              >
                <p.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
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
      <section className="bg-canvas-soft border-t border-border px-6 lg:px-16 py-20">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-8">
          <h2 className="display-md text-primary">Pronto para modernizar sua operação?</h2>
          <p className="body-lg text-mute">
            Junte-se a mais de 2.400 produtores rurais que já usam o BoiHub para gerir sua pecuária com mais eficiência.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/cadastro">Criar conta grátis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-canvas border-t border-border px-6 lg:px-16 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <span className="font-display font-extrabold text-xl text-ink">Boi</span>
            <span className="font-display font-extrabold text-xl text-primary">Hub</span>
          </div>
          <p className="text-sm text-mute">© 2026 BoiHub. Todos os direitos reservados.</p>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm text-mute">boihub.com.br</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
