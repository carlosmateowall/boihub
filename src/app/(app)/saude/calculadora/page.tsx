import Link from 'next/link'
import { ArrowLeft, Calculator } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CalculadoraDosagem } from '@/components/saude/CalculadoraDosagem'
import type { ProdutoSaude } from '@/types/database'

export const metadata = {
  title: 'Calculadora de dosagem — BoiHub',
  description:
    'Calcule a dose certa de vacinas, vermífugos, antibióticos e vitaminas para o seu rebanho.',
}

interface SearchParams {
  produto?: string
  preset?: string
}

export default async function CalculadoraPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const supabase = await createClient()
  const { data } = await supabase
    .from('produtos_saude')
    .select('*, lojas(nome, cidade)')
    .order('nome')

  const produtos = (data ?? []) as ProdutoSaude[]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/saude"
          className="flex items-center gap-1.5 text-[13px] text-mute hover:text-ink w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar para Saúde animal
        </Link>
        <div className="flex items-start gap-3">
          <span className="hidden lg:inline-flex h-11 w-11 items-center justify-center rounded-md bg-verde-900 text-verde-400 shrink-0">
            <Calculator className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <span className="bh-eyebrow text-mute">Saúde animal</span>
            <h1 className="bh-display text-[30px] lg:text-[36px] text-ink leading-tight mt-1">
              Calculadora de dosagem
            </h1>
            <p className="text-[14px] text-ink-soft mt-1 max-w-2xl">
              Calcule rapidamente quanto aplicar por animal, volume total do lote,
              frascos necessários e custo. Funciona para vacinas, vermífugos,
              antibióticos e vitaminas — tanto do catálogo da sua região quanto
              fórmulas personalizadas.
            </p>
          </div>
        </div>
      </div>

      <CalculadoraDosagem
        produtos={produtos}
        initialProdutoId={sp.produto}
        initialPresetId={sp.preset}
      />

      <p className="text-[11.5px] text-mute text-center max-w-2xl mx-auto leading-relaxed">
        Os valores apresentados são estimativas técnicas baseadas nas bulas mais
        comuns do mercado brasileiro. <strong>Sempre consulte a bula do produto
        específico</strong> e um médico veterinário habilitado antes de aplicar.
        A BoiHub não se responsabiliza por aplicações feitas sem orientação
        profissional.
      </p>
    </div>
  )
}
