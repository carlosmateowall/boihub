import { createClient } from '@/lib/supabase/server'
import { SuplementoCard } from '@/components/loja/SuplementoCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Package } from 'lucide-react'
import type { Suplemento } from '@/types/database'

export const metadata = { title: 'Suplementos — BoiHub' }

export default async function SuplementosPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('suplementos')
    .select('*')
    .order('categoria')
    .order('nome')

  const suplementos = (data ?? []) as Suplemento[]

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="display-sm text-ink">Suplementos</h1>
        <p className="body-md text-mute mt-1">Minerais, proteinados, energéticos e premix</p>
      </div>

      {suplementos.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nenhum suplemento cadastrado"
          description="O catálogo de suplementos estará disponível em breve."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suplementos.map(s => <SuplementoCard key={s.id} suplemento={s} />)}
        </div>
      )}
    </div>
  )
}
