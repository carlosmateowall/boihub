import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { VeterinarioCard } from '@/components/saude/VeterinarioCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Stethoscope, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { whatsappLink } from '@/lib/constants'
import type { Veterinario } from '@/types/database'

export const metadata = { title: 'Veterinários — BoiHub' }

export default async function VeterinariosPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('veterinarios')
    .select('*')
    .order('avaliacao', { ascending: false })

  const vets = (data ?? []) as Veterinario[]

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-sm text-ink">Veterinários</h1>
          <p className="body-md text-mute mt-1">Consultas online e presenciais</p>
        </div>
        <Button variant="secondary" asChild>
          <Link href="/saude/consultas">
            <History className="h-4 w-4" /> Minhas consultas
          </Link>
        </Button>
      </div>

      {vets.length === 0 ? (
        <EmptyState
          icon={Stethoscope}
          title="Seja um dos primeiros veterinários do BoiHub"
          description="Estamos abrindo cadastros para profissionais que querem oferecer teleconsultas a produtores rurais do Centro-Oeste. Fale com a gente."
          actionLabel="Quero me cadastrar"
          actionHref={whatsappLink('Olá! Sou veterinário e quero me cadastrar no BoiHub.')}
          actionExternal
          secondaryLabel="Ver como funciona"
          secondaryHref="/"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {vets.map(v => <VeterinarioCard key={v.id} vet={v} />)}
        </div>
      )}
    </div>
  )
}
