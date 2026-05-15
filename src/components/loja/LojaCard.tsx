import Link from 'next/link'
import { MapPin, MessageCircle, Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import type { Loja } from '@/types/database'

interface Props { loja: Loja }

export function LojaCard({ loja }: Props) {
  const whatsappUrl = loja.whatsapp
    ? `https://wa.me/55${loja.whatsapp.replace(/\D/g, '')}?text=Olá, encontrei sua loja no BoiHub`
    : null

  return (
    <Card variant="default" className="flex flex-col gap-0">
      <CardContent className="flex flex-col gap-3 h-full">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-ink">{loja.nome}</p>
              {loja.premium && (
                <Badge variant="primary">
                  <Star className="h-3 w-3 mr-1" /> Premium
                </Badge>
              )}
            </div>
            <Badge variant="mute" className="mt-1">
              {loja.tipo === 'fabricante' ? 'Fabricante' : 'Revenda'}
            </Badge>
          </div>
        </div>

        {loja.cidade && (
          <div className="flex items-center gap-1.5 text-sm text-mute">
            <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
            {loja.cidade}, {loja.estado}
          </div>
        )}

        {loja.categorias && loja.categorias.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {loja.categorias.map(c => (
              <span key={c} className="text-xs bg-canvas-soft text-ink border border-ink/15 px-2 py-1 rounded-sm w-fit">
                {c}
              </span>
            ))}
          </div>
        )}

        {loja.descricao && (
          <p className="text-sm text-mute leading-relaxed line-clamp-2 flex-1">{loja.descricao}</p>
        )}

        <div className="pt-2 border-t border-canvas-soft flex gap-2">
          {whatsappUrl && (
            <Button variant="primary" size="sm" className="flex-1" asChild>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
            </Button>
          )}
          <Button variant="secondary" size="sm" className={whatsappUrl ? '' : 'flex-1'} asChild>
            <Link href={`/loja/${loja.id}`}>Ver loja</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
