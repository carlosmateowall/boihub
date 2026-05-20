import { createClient } from '@/lib/supabase/server'
import { LojaCard } from '@/components/loja/LojaCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { ShoppingBag } from 'lucide-react'
import { whatsappLink } from '@/lib/constants'
import type { Loja } from '@/types/database'

export const metadata = { title: 'Loja — BoiHub' }

export default async function LojaPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('lojas')
    .select('*')
    .order('premium', { ascending: false })
    .order('nome')

  const lojas = (data ?? []) as Loja[]

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="display-sm text-ink">Loja</h1>
        <p className="body-md text-mute mt-1">Revendas e fabricantes de insumos agropecuários</p>
      </div>

      {lojas.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Sua loja merece estar aqui"
          description="Revendas e fabricantes do Centro-Oeste: estamos abrindo cadastros. Apareça para produtores que precisam de insumos agropecuários todo mês."
          actionLabel="Cadastrar minha loja"
          actionHref={whatsappLink('Olá! Tenho uma loja agropecuária e quero cadastrar no BoiHub.')}
          actionExternal
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lojas.map(l => <LojaCard key={l.id} loja={l} />)}
        </div>
      )}
    </div>
  )
}
