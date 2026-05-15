import { EditarPerfilForm } from '@/components/auth/EditarPerfilForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { Profile } from '@/types/database'

export const metadata = { title: 'Editar perfil — BoiHub' }

export default async function EditarPerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = profileData as Profile | null
  if (!profile) redirect('/onboarding')

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="display-sm text-ink">Editar perfil</h1>
        <p className="body-md text-mute mt-1">Atualize suas informações</p>
      </div>
      <EditarPerfilForm profile={profile} />
    </div>
  )
}
