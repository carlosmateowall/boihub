import { MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Rating } from '@/components/shared/Rating'
import { Button } from '@/components/ui/button'
import type { Veterinario } from '@/types/database'
import { formatCurrency } from '@/lib/utils'

interface Props { vet: Veterinario }

export function VeterinarioCard({ vet }: Props) {
  const whatsappMsg = encodeURIComponent(
    `Olá, Dr(a). ${vet.nome.split(' ').slice(1).join(' ')}! Vi seu perfil no BoiHub e gostaria de agendar uma teleconsulta.`
  )
  const whatsappUrl = vet.whatsapp
    ? `https://wa.me/55${vet.whatsapp.replace(/\D/g, '')}?text=${whatsappMsg}`
    : null

  return (
    <Card variant="default" className="flex flex-col gap-0">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-ink">{vet.nome}</p>
              {vet.online && <Badge variant="positive">Online</Badge>}
            </div>
            <p className="text-sm text-mute mt-0.5">{vet.crmv}</p>
          </div>
          <Rating value={vet.avaliacao} count={vet.total_consultas} />
        </div>

        {vet.especialidades && vet.especialidades.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {vet.especialidades.map(e => (
              <Badge key={e} variant="mute">{e}</Badge>
            ))}
          </div>
        )}

        {vet.bio && (
          <p className="text-sm text-mute leading-relaxed line-clamp-2">{vet.bio}</p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border">
          {vet.preco_consulta ? (
            <div>
              <p className="font-semibold text-ink">{formatCurrency(vet.preco_consulta)}</p>
              <p className="text-xs text-mute">por consulta</p>
            </div>
          ) : (
            <span className="text-sm text-mute">Consulte o preço</span>
          )}
          {whatsappUrl ? (
            <Button variant="primary" size="sm" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> Contatar
              </a>
            </Button>
          ) : (
            <Button variant="secondary" size="sm">Agendar</Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
