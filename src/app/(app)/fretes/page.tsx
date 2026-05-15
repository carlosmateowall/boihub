import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Truck, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FreteCard } from '@/components/fretes/FreteCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { Frete } from '@/types/database'

export const metadata = { title: 'Fretes — BoiHub' }

export default async function FretesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: fretesData } = await supabase
    .from('fretes')
    .select('*, motoristas(nome, caminhao, avaliacao)')
    .eq('produtor_id', user.id)
    .order('created_at', { ascending: false })

  const fretes = (fretesData ?? []) as Frete[]

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-sm text-ink">Fretes</h1>
          <p className="body-md text-mute mt-1">Histórico e fretes ativos</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/fretes/novo"><Plus className="h-4 w-4" /> Solicitar frete</Link>
        </Button>
      </div>

      {fretes.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="Nenhum frete ainda"
          description="Solicite seu primeiro frete e encontre motoristas disponíveis na sua região."
          actionLabel="Solicitar frete"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {fretes.map(f => <FreteCard key={f.id} frete={f} />)}
        </div>
      )}
    </div>
  )
}
