import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { PagarFreteClient } from '@/components/fretes/PagarFreteClient'
import type { Frete } from '@/types/database'

export const metadata = { title: 'Pagar frete — BoiHub' }

interface Params { id: string }

export default async function PagarFretePage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: freteData } = await supabase
    .from('fretes')
    .select('*')
    .eq('id', id)
    .single()

  const frete = freteData as Frete | null
  if (!frete) notFound()
  if (frete.produtor_id !== user.id) redirect('/fretes')

  // Se já estiver pago/em andamento, não permite pagar de novo
  if (!['pendente', 'confirmado'].includes(frete.status)) {
    redirect(`/fretes/${id}`)
  }

  return <PagarFreteClient frete={frete} />
}
