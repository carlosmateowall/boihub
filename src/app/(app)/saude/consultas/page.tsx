import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Calendar, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConsultaCard } from '@/components/saude/ConsultaCard'
import { EmptyState } from '@/components/shared/EmptyState'
import type { ConsultaVet } from '@/types/database'

export const metadata = { title: 'Minhas consultas — BoiHub' }

export default async function ConsultasPage({
  searchParams,
}: {
  searchParams: Promise<{ novo?: string }>
}) {
  const sp = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('consultas_vet')
    .select('*, veterinarios(nome, crmv, especialidades)')
    .eq('produtor_id', user.id)
    .order('data_consulta', { ascending: false })

  const consultas = (data ?? []) as ConsultaVet[]

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-sm text-ink">Minhas consultas</h1>
          <p className="body-md text-mute mt-1">Teleconsultas e visitas técnicas</p>
        </div>
        <Button variant="primary" asChild>
          <Link href="/saude/veterinarios">
            <Calendar className="h-4 w-4" /> Nova consulta
          </Link>
        </Button>
      </div>

      {sp.novo === '1' && consultas.length > 0 && (
        <div className="bg-canvas-soft border border-border rounded-lg px-4 py-3 text-sm text-ink">
          Consulta agendada. O veterinário entrará em contato para confirmar
          o horário.
        </div>
      )}

      {consultas.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="Nenhuma consulta ainda"
          description="Agende uma teleconsulta ou visita técnica com um dos veterinários disponíveis."
          actionLabel="Ver veterinários"
          actionHref="/saude/veterinarios"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {consultas.map(c => <ConsultaCard key={c.id} consulta={c} />)}
        </div>
      )}
    </div>
  )
}
