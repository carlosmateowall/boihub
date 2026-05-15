import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardProdutor } from '@/components/dashboard/DashboardProdutor'
import { DashboardGenerico } from '@/components/dashboard/DashboardGenerico'
import type { Profile, Frete, ConsultaVet } from '@/types/database'

export const metadata = { title: 'Dashboard — BoiHub' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as Profile | null
  if (!profile?.onboarding_completo) redirect('/onboarding')

  if (profile.perfil === 'produtor') {
    const [{ data: fretesData }, { data: consultasData }] = await Promise.all([
      supabase
        .from('fretes')
        .select('*, motoristas(nome, caminhao, avaliacao)')
        .eq('produtor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('consultas_vet')
        .select('*, veterinarios(nome, crmv)')
        .eq('produtor_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3),
    ])

    return (
      <DashboardProdutor
        profile={profile}
        fretes={(fretesData ?? []) as Frete[]}
        consultas={(consultasData ?? []) as ConsultaVet[]}
      />
    )
  }

  return <DashboardGenerico profile={profile} />
}
