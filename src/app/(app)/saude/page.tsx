import { createClient } from '@/lib/supabase/server'
import { SaudeClient } from '@/components/saude/SaudeClient'
import type { ProdutoSaude } from '@/types/database'

export const metadata = { title: 'Saúde Animal — BoiHub' }

export default async function SaudePage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('produtos_saude')
    .select('*, lojas(nome, cidade)')
    .order('nome')

  const produtos = (data ?? []) as ProdutoSaude[]

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="display-sm text-ink">Saúde Animal</h1>
        <p className="body-md text-mute mt-1">Vacinas, antiparasitários, antibióticos e vitaminas</p>
      </div>
      <SaudeClient produtos={produtos} />
    </div>
  )
}
