import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Pencil, FileText, Shield, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/shared/Badge'
import { Rating } from '@/components/shared/Rating'
import { PERFIL_LABELS } from '@/lib/constants'
import type { Profile } from '@/types/database'

export const metadata = { title: 'Perfil — BoiHub' }

export default async function PerfilPage() {
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
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="display-sm text-ink">Meu perfil</h1>
        <Button variant="secondary" asChild>
          <Link href="/perfil/editar"><Pencil className="h-4 w-4" /> Editar</Link>
        </Button>
      </div>

      <Card variant="dark">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="display-xs">{profile.nome}</p>
              <p className="text-sm opacity-70 mt-1">{user.email}</p>
            </div>
            <Badge variant="primary">{PERFIL_LABELS[profile.perfil]}</Badge>
          </div>
          <Rating value={profile.avaliacao} className="text-primary" />
        </CardContent>
      </Card>

      <Card variant="default">
        <CardContent className="flex flex-col gap-4">
          {profile.fazenda && (
            <div className="flex justify-between">
              <span className="text-mute text-sm">Fazenda</span>
              <span className="font-semibold text-ink text-sm">{profile.fazenda}</span>
            </div>
          )}
          {profile.cidade && (
            <div className="flex justify-between">
              <span className="text-mute text-sm">Cidade</span>
              <span className="font-semibold text-ink text-sm">{profile.cidade}, {profile.estado}</span>
            </div>
          )}
          {profile.perfil === 'produtor' && (
            <>
              <div className="flex justify-between">
                <span className="text-mute text-sm">Cabeças de gado</span>
                <span className="font-semibold text-ink text-sm">{(profile.cabecas ?? 0).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mute text-sm">Área</span>
                <span className="font-semibold text-ink text-sm">{(profile.hectares ?? 0).toLocaleString('pt-BR')} ha</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mute text-sm">Fretes realizados</span>
                <span className="font-semibold text-ink text-sm">{profile.fretes_count}</span>
              </div>
            </>
          )}
          {profile.whatsapp && (
            <div className="flex justify-between">
              <span className="text-mute text-sm">WhatsApp</span>
              <span className="font-semibold text-ink text-sm">{profile.whatsapp}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card variant="default">
        <CardContent className="flex flex-col p-0">
          <Link
            href="/termos"
            className="flex items-center justify-between px-5 py-4 border-b border-ink/10 hover:bg-canvas-soft transition-colors"
          >
            <span className="flex items-center gap-3 text-sm text-ink">
              <FileText className="h-4 w-4 text-mute" /> Termos de Uso
            </span>
            <ChevronRight className="h-4 w-4 text-mute" />
          </Link>
          <Link
            href="/privacidade"
            className="flex items-center justify-between px-5 py-4 hover:bg-canvas-soft transition-colors"
          >
            <span className="flex items-center gap-3 text-sm text-ink">
              <Shield className="h-4 w-4 text-mute" /> Política de Privacidade
            </span>
            <ChevronRight className="h-4 w-4 text-mute" />
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
