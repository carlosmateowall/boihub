import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardProdutor } from '@/components/dashboard/DashboardProdutor'
import { DashboardVet } from '@/components/dashboard/DashboardVet'
import { DashboardMotorista } from '@/components/dashboard/DashboardMotorista'
import { DashboardRevenda } from '@/components/dashboard/DashboardRevenda'
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

  // ─── PRODUTOR ────────────────────────────────────────────────
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
        .order('data_consulta', { ascending: true })
        .limit(5),
    ])

    return (
      <DashboardProdutor
        profile={profile}
        fretes={(fretesData ?? []) as Frete[]}
        consultas={(consultasData ?? []) as ConsultaVet[]}
      />
    )
  }

  // ─── VETERINÁRIO ─────────────────────────────────────────────
  if (profile.perfil === 'veterinario') {
    // Busca o registro de veterinario associado
    const { data: vetRow } = await supabase
      .from('veterinarios')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    let consultas: ConsultaVet[] = []
    if (vetRow?.id) {
      const { data } = await supabase
        .from('consultas_vet')
        .select('*, veterinarios(nome, crmv, especialidades)')
        .eq('veterinario_id', vetRow.id)
        .order('data_consulta', { ascending: false })
        .limit(20)
      consultas = (data ?? []) as ConsultaVet[]
    }

    return <DashboardVet profile={profile} consultas={consultas} />
  }

  // ─── MOTORISTA ───────────────────────────────────────────────
  if (profile.perfil === 'motorista') {
    const { data: motoRow } = await supabase
      .from('motoristas')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    let disponiveis: Frete[] = []
    let emAndamento: Frete | null = null
    let pendingPayouts: Frete[] = []

    if (motoRow?.id) {
      const [
        { data: pendingData },
        { data: emAndData },
        { data: payoutsData },
      ] = await Promise.all([
        supabase
          .from('fretes')
          .select('*')
          .is('motorista_id', null)
          .eq('status', 'pendente')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('fretes')
          .select('*')
          .eq('motorista_id', motoRow.id)
          .in('status', ['confirmado', 'em_andamento'])
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase
          .from('fretes')
          .select('*')
          .eq('motorista_id', motoRow.id)
          .eq('status', 'concluido')
          .order('updated_at', { ascending: false })
          .limit(5),
      ])
      disponiveis = (pendingData ?? []) as Frete[]
      emAndamento = (emAndData ?? null) as Frete | null
      pendingPayouts = (payoutsData ?? []) as Frete[]
    } else {
      // Sem motorista cadastrado ainda — mostra fretes disponíveis públicos
      const { data } = await supabase
        .from('fretes')
        .select('*')
        .is('motorista_id', null)
        .eq('status', 'pendente')
        .order('created_at', { ascending: false })
        .limit(10)
      disponiveis = (data ?? []) as Frete[]
    }

    return (
      <DashboardMotorista
        profile={profile}
        disponiveis={disponiveis}
        emAndamento={emAndamento}
        pendingPayouts={pendingPayouts}
      />
    )
  }

  // ─── REVENDA / FABRICANTE ────────────────────────────────────
  if (profile.perfil === 'revenda' || profile.perfil === 'fabricante') {
    const { data: lojaRow } = await supabase
      .from('lojas')
      .select('id, nome, premium')
      .eq('user_id', user.id)
      .maybeSingle()

    let produtosCount = 0
    if (lojaRow?.id) {
      const { count } = await supabase
        .from('produtos_saude')
        .select('id', { count: 'exact', head: true })
        .eq('loja_id', lojaRow.id)
      produtosCount = count ?? 0
    }

    return (
      <DashboardRevenda
        profile={profile}
        loja={lojaRow ?? null}
        produtosCount={produtosCount}
      />
    )
  }

  // Fallback (não deve cair aqui se enum estiver completo)
  return <DashboardProdutor profile={profile} fretes={[]} consultas={[]} />
}
