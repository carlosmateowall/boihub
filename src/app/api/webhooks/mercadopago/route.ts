import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { consultarPagamento } from '@/lib/mercadopago'

/**
 * POST /api/webhooks/mercadopago
 *
 * Webhook do Mercado Pago. Recebe notificação de pagamento e atualiza
 * o status da transaction correspondente. Atualiza também o frete/consulta
 * relacionado quando o pagamento é aprovado.
 *
 * O Mercado Pago manda topic=payment e data.id=<payment_id>.
 * Consultamos o payment via API com nosso access_token pra confirmar
 * (não confiamos só no body do webhook).
 *
 * Configuração no Mercado Pago Dashboard:
 * - URL: https://boihub.com.br/api/webhooks/mercadopago
 * - Eventos: Pagamentos (payment.created, payment.updated)
 */
export async function POST(req: Request) {
  let body: { type?: string; topic?: string; data?: { id?: string | number } }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const topic = body.type ?? body.topic
  const paymentId = body.data?.id
  if (topic !== 'payment' || !paymentId) {
    return NextResponse.json({ ok: true, ignored: true }, { status: 200 })
  }

  let payment
  try {
    payment = await consultarPagamento(String(paymentId))
  } catch (err) {
    console.error('Falha ao consultar pagamento MP', err)
    return NextResponse.json({ error: 'lookup_failed' }, { status: 502 })
  }

  const externalReference = payment.external_reference
  if (!externalReference) {
    return NextResponse.json({ ok: true, no_ref: true }, { status: 200 })
  }

  // Status do MP: pending, approved, authorized, in_process, in_mediation,
  // rejected, cancelled, refunded, charged_back
  const mpStatus = payment.status
  const mappedStatus =
    mpStatus === 'approved'
      ? 'paid'
      : mpStatus === 'refunded' || mpStatus === 'charged_back'
        ? 'refunded'
        : mpStatus === 'rejected' || mpStatus === 'cancelled'
          ? 'failed'
          : 'pending'

  const admin = createAdminClient()

  // Atualiza transação
  const { data: tx, error: txErr } = await admin
    .from('transactions')
    .update({
      status: mappedStatus,
      paid_at: mappedStatus === 'paid' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
      metadata: { mp_status: mpStatus, mp_payment_id: payment.id },
    })
    .eq('id', externalReference)
    .select('*')
    .single()

  if (txErr || !tx) {
    console.error('Transaction não encontrada', externalReference, txErr)
    return NextResponse.json({ error: 'transaction_not_found' }, { status: 404 })
  }

  // Se pago, marca o frete como confirmado (próximo passo: motorista
  // pega o gado). Pra consulta, mantém status agendada.
  if (mappedStatus === 'paid' && tx.kind === 'frete' && tx.frete_id) {
    await admin
      .from('fretes')
      .update({ status: 'confirmado', updated_at: new Date().toISOString() })
      .eq('id', tx.frete_id)
      .in('status', ['pendente'])
  }

  return NextResponse.json({ ok: true })
}
