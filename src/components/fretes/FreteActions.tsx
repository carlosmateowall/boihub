'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, XCircle, Truck, CheckCircle2, Star, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import type { Frete } from '@/types/database'

interface Props { frete: Frete }

export function FreteActions({ frete }: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [loading, setLoading] = useState<null | 'cancelar' | 'embarcar' | 'concluir' | 'avaliar'>(null)
  const [error, setError] = useState('')
  const [showAvaliar, setShowAvaliar] = useState(false)
  const [nota, setNota] = useState<number>(5)
  const [comentario, setComentario] = useState('')

  async function cancelar() {
    if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return
    setLoading('cancelar')
    setError('')
    const { error: dbError } = await supabase
      .from('fretes')
      .delete()
      .eq('id', frete.id)
    setLoading(null)
    if (dbError) { setError('Erro ao cancelar. Tente novamente.'); return }
    router.push('/fretes')
    router.refresh()
  }

  async function marcarEmbarque() {
    setLoading('embarcar')
    setError('')
    const { error: dbError } = await supabase
      .from('fretes')
      .update({ status: 'em_andamento' })
      .eq('id', frete.id)
    setLoading(null)
    if (dbError) { setError('Erro ao atualizar. Tente novamente.'); return }
    router.refresh()
  }

  async function marcarConclusao() {
    setLoading('concluir')
    setError('')
    const { error: dbError } = await supabase
      .from('fretes')
      .update({ status: 'concluido' })
      .eq('id', frete.id)
    setLoading(null)
    if (dbError) { setError('Erro ao concluir. Tente novamente.'); return }
    router.refresh()
  }

  async function salvarAvaliacao() {
    setLoading('avaliar')
    setError('')
    const obs = comentario.trim()
      ? `${frete.observacoes ?? ''}\n[Avaliação produtor]: ${comentario.trim()}`.trim()
      : frete.observacoes
    const { error: dbError } = await supabase
      .from('fretes')
      .update({
        avaliacao_produtor: nota,
        observacoes: obs,
      })
      .eq('id', frete.id)
    setLoading(null)
    if (dbError) { setError('Erro ao salvar. Tente novamente.'); return }
    setShowAvaliar(false)
    router.refresh()
  }

  // Status: pendente | confirmado | em_andamento | concluido | cancelado
  const podePagar = frete.status === 'pendente' && (frete.preco_total ?? 0) > 0
  const podeCancelar = frete.status === 'pendente'
  const podeEmbarcar = frete.status === 'confirmado'
  const podeConcluir = frete.status === 'em_andamento'
  const podeAvaliar = frete.status === 'concluido' && !frete.avaliacao_produtor

  if (!podePagar && !podeCancelar && !podeEmbarcar && !podeConcluir && !podeAvaliar) return null

  return (
    <div className="bg-canvas rounded-xl p-5 border border-border flex flex-col gap-3">
      <p className="font-semibold text-ink">Ações disponíveis</p>

      <div className="flex flex-wrap gap-2">
        {podePagar && (
          <Button variant="primary" size="sm" asChild>
            <Link href={`/fretes/${frete.id}/pagar`}>
              <CreditCard className="h-4 w-4" /> Pagar via PIX
            </Link>
          </Button>
        )}
        {podeCancelar && (
          <Button
            variant="ghost"
            size="sm"
            onClick={cancelar}
            disabled={loading !== null}
            className="text-negative hover:text-negative"
          >
            {loading === 'cancelar' ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Cancelar frete
          </Button>
        )}
        {podeEmbarcar && (
          <Button
            variant="secondary"
            size="sm"
            onClick={marcarEmbarque}
            disabled={loading !== null}
          >
            {loading === 'embarcar' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
            Confirmar embarque
          </Button>
        )}
        {podeConcluir && (
          <Button
            variant="primary"
            size="sm"
            onClick={marcarConclusao}
            disabled={loading !== null}
          >
            {loading === 'concluir' ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Marcar como concluído
          </Button>
        )}
        {podeAvaliar && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAvaliar(true)}
            disabled={loading !== null}
          >
            <Star className="h-4 w-4" />
            Avaliar motorista
          </Button>
        )}
      </div>

      {error && <p className="text-sm text-negative">{error}</p>}

      {showAvaliar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="bg-canvas rounded-xl p-6 max-w-md w-full flex flex-col gap-5 shadow-xl">
            <div>
              <p className="display-xs text-ink">Como foi o frete?</p>
              <p className="text-sm text-mute mt-1">Sua avaliação ajuda outros produtores.</p>
            </div>

            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNota(n)}
                  className="text-3xl"
                  aria-label={`${n} estrelas`}
                >
                  <Star
                    className={`h-8 w-8 ${n <= nota ? 'text-primary fill-primary' : 'text-mute'}`}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-ink">Comentário (opcional)</label>
              <textarea
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                placeholder="Cuidado com o gado, pontualidade, etc."
                rows={3}
                className="w-full bg-canvas text-ink border border-ink rounded-md px-4 py-3 text-sm placeholder:text-mute focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {error && <p className="text-sm text-negative">{error}</p>}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => setShowAvaliar(false)}
                disabled={loading === 'avaliar'}
              >
                Depois
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                className="flex-1"
                onClick={salvarAvaliacao}
                disabled={loading === 'avaliar'}
              >
                {loading === 'avaliar' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar avaliação'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
