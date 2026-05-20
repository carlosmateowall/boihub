import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { AgendarConsultaForm } from '@/components/saude/AgendarConsultaForm'
import type { Veterinario } from '@/types/database'

export const metadata = { title: 'Agendar consulta — BoiHub' }

interface Params { id: string }

export default async function AgendarConsultaPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('veterinarios')
    .select('*')
    .eq('id', id)
    .single()

  const vet = data as Veterinario | null
  if (!vet) notFound()

  return <AgendarConsultaForm vet={vet} />
}
