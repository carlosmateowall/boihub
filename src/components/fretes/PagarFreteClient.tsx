'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Copy, Check, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import type { Frete } from '@/types/database'

interface CheckoutResult {
  transactionId: string
  qrCode: string
  qrCodeBase64: string
  ticketUrl?: string
  expiresAt: string
  valor: number
}

interface Props { frete: Frete }

export function PagarFreteClient({ frete }: Props) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [checkout, setCheckout] = useState<CheckoutResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [paid, setPaid] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    iniciarCheckout()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!checkout) return
    intervalRef.current = setInterval(() => verificarPagamento(checkout.transactionId), 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkout?.transactionId])

  async function iniciarCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/checkout/frete/${frete.id}`, { method: 'POST' })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Erro ao iniciar pagamento.')
        return
      }
      setCheckout(json)
    } catch {
      setError('Não foi possível iniciar o pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function verificarPagamento(transactionId: string) {
    const { data } = await supabase
      .from('transactions')
      .select('status, paid_at')
      .eq('id', transactionId)
      .single()
    if (data?.status === 'paid') {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setPaid(true)
      setTimeout(() => {
        router.push(`/fretes/${frete.id}`)
        router.refresh()
      }, 2000)
    } else if (data?.status === 'failed' || data?.status === 'expired') {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setError('Pagamento não foi concluído. Gere um novo PIX.')
      setCheckout(null)
    }
  }

  async function copiar() {
    if (!checkout) return
    await navigator.clipboard.writeText(checkout.qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (paid) {
    return (
      <div className="bg-canvas rounded-xl p-8 flex flex-col items-center text-center gap-4 border border-border">
        <CheckCircle2 className="h-14 w-14 text-positive" strokeWidth={1.5} />
        <div>
          <p className="display-sm text-ink">Pagamento confirmado!</p>
          <p className="body-md text-mute mt-1">Redirecionando para o frete...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <Link
        href={`/fretes/${frete.id}`}
        className="flex items-center gap-2 text-sm text-mute hover:text-ink w-fit"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar ao frete
      </Link>

      <div>
        <h1 className="display-sm text-ink">Pagar frete via PIX</h1>
        <p className="body-md text-mute mt-1">
          {frete.origem} → {frete.destino}
        </p>
      </div>

      <div className="bg-canvas rounded-xl p-6 border border-border flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="text-mute text-sm">Valor a pagar</span>
          <span className="display-xs text-ink">
            {frete.preco_total ? formatCurrency(frete.preco_total) : '—'}
          </span>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-mute" />
            <p className="text-sm text-mute">Gerando QR Code...</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center gap-3 py-8">
            <AlertCircle className="h-10 w-10 text-negative" strokeWidth={1.5} />
            <p className="text-sm text-negative text-center max-w-sm">{error}</p>
            <Button variant="secondary" size="sm" onClick={iniciarCheckout}>
              Tentar novamente
            </Button>
          </div>
        )}

        {checkout && !error && (
          <>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white p-4 rounded-lg border border-border">
                <Image
                  src={`data:image/png;base64,${checkout.qrCodeBase64}`}
                  alt="QR Code PIX"
                  width={240}
                  height={240}
                  unoptimized
                />
              </div>
              <p className="text-xs text-mute text-center max-w-xs">
                Abra o app do seu banco, escolha pagar por QR Code e aponte
                a câmera, ou copie o código abaixo.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-mute uppercase tracking-wider">PIX Copia e Cola</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={checkout.qrCode}
                  className="flex-1 bg-canvas-soft text-ink border border-border rounded-md px-3 py-2 text-xs font-mono truncate"
                />
                <Button variant="secondary" size="sm" onClick={copiar}>
                  {copied ? (
                    <><Check className="h-4 w-4" /> Copiado</>
                  ) : (
                    <><Copy className="h-4 w-4" /> Copiar</>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-canvas-soft border border-border rounded-lg px-4 py-3 text-xs text-mute flex items-start gap-2">
              <Loader2 className="h-4 w-4 animate-spin shrink-0 mt-0.5" />
              <p>
                Aguardando confirmação do pagamento. Esta tela vai atualizar
                sozinha assim que o PIX cair. PIX expira em 30 minutos.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="text-xs text-mute leading-relaxed">
        Ao concluir o pagamento, o BoiHub libera o frete para o motorista
        e repassa o valor líquido ao prestador após a conclusão. Comissão
        da plataforma: 10% sobre o valor bruto.
      </div>
    </div>
  )
}
