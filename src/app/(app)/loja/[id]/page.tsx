import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, MessageCircle, Phone, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/ui/button'
import { SuplementoCard } from '@/components/loja/SuplementoCard'
import type { Loja, Suplemento } from '@/types/database'

export default async function LojaDetalhePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: lojaData }, { data: produtosData }, { data: suplementosData }] = await Promise.all([
    supabase.from('lojas').select('*').eq('id', id).single(),
    supabase.from('produtos_saude').select('*').eq('loja_id', id).order('nome'),
    supabase.from('suplementos').select('*').eq('loja_id', id).order('nome'),
  ])

  const loja = lojaData as Loja | null
  if (!loja) notFound()

  const suplementos = (suplementosData ?? []) as Suplemento[]

  const whatsappUrl = loja.whatsapp
    ? `https://wa.me/55${loja.whatsapp.replace(/\D/g, '')}?text=Olá, vi sua loja no BoiHub`
    : null

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/loja"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <h1 className="display-sm text-ink">{loja.nome}</h1>
      </div>

      <Card variant="dark">
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="display-xs">{loja.nome}</p>
              <Badge variant="mute" className="mt-2">
                {loja.tipo === 'fabricante' ? 'Fabricante' : 'Revenda'}
              </Badge>
            </div>
            {loja.premium && <Badge variant="primary">Premium</Badge>}
          </div>
          {loja.descricao && <p className="text-sm opacity-70">{loja.descricao}</p>}
          <div className="flex flex-col gap-2 text-sm">
            {loja.cidade && (
              <div className="flex items-center gap-2 opacity-70">
                <MapPin className="h-4 w-4" /> {loja.cidade}, {loja.estado}
              </div>
            )}
            {loja.horario_funcionamento && (
              <div className="flex items-center gap-2 opacity-70">
                <Clock className="h-4 w-4" /> {loja.horario_funcionamento}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {whatsappUrl && (
              <Button variant="primary" size="sm" asChild>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
            )}
            {loja.telefone && (
              <Button variant="secondary" size="sm" asChild>
                <a href={`tel:${loja.telefone}`}><Phone className="h-4 w-4" /> Ligar</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {produtosData && produtosData.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="display-xs text-ink">Produtos de saúde</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {produtosData.map((p: Record<string, unknown>) => (
              <Card key={p.id as string} variant="default">
                <CardContent>
                  <p className="font-semibold text-ink">{p.nome as string}</p>
                  <p className="text-sm text-mute">{p.marca as string}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {suplementos.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="display-xs text-ink">Suplementos</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {suplementos.map(s => <SuplementoCard key={s.id} suplemento={s} />)}
          </div>
        </div>
      )}
    </div>
  )
}
