import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Profile } from '@/types/database'
import { PERFIL_LABELS } from '@/lib/constants'

interface Props { profile: Profile }

export function DashboardGenerico({ profile }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="display-sm text-ink">Olá, {profile.nome.split(' ')[0]}</h1>
        <p className="body-md text-mute mt-1">{PERFIL_LABELS[profile.perfil]}</p>
      </div>
      <Card variant="dark">
        <CardContent className="flex flex-col gap-4">
          <p className="font-semibold text-xl">Seu painel está chegando</p>
          <p className="text-sm opacity-70">
            O dashboard para {PERFIL_LABELS[profile.perfil].toLowerCase()} está em desenvolvimento.
            Por enquanto, explore a plataforma pelo menu.
          </p>
          <Button variant="primary" size="sm" asChild>
            <Link href="/perfil">Ver meu perfil <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
