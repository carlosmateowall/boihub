import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { criarCobrancaPix } from '@/lib/mercadopago'
import type { Frete } from '@/types/database'

const COMISSAO_PERCENTUAL = 10 // 10%

/**
 * POST /api/checkout/frete/{id}
 *
 * Cria (ou retorna a existente, se ainda válida) uma transação PIX pro
 * pagamento de um frete. Exige usuário autenticado = produtor do frete.
 *
 * Body: nenhum.
 * Response: { transactionId, qrCode, qrCodeBase64, ticketUrl?, expiresAt }
 */
export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id: freteId } = await ctx.params

  // 1. Verifica auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Busca o frete e valida ownership + status
  const { data: freteData, error: freteErr } = await supabase
    .from('fretes')
    .select('*')
    .eq('id', freteId)
    .single()
  if (freteErr || !freteData) {
    return NextResponse.json({ error: 'Frete não encontrado' }, { status: 404 })
  }
  const frete = freteData as Frete
  if (frete.produtor_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (!frete.preco_total || frete.preco_total <= 0) {
    return NextResponse.json(
      { error: 'Este frete não tem valor definido. Combine com o motorista antes.' },
      { status: 400 },
    )
  }
  if (!['pendente', 'confirmado'].includes(frete.status)) {
    return NextResponse.json(
      { error: 'Frete já não pode ser pago neste status.' },
      { status: 400 },
    )
  }

  const admin = createAdminClient()

  // 3. Reaproveita transação válida se já existir
  const { data: existing } = await admin
    .from('transactions')
    .select('*')
    .eq('frete_id', freteId)
    .in('status', ['created', 'pending'])
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({
      transactionId: existing.id,
      qrCode: existing.gateway_qr_code,
      qrCodeBase64: existing.gateway_qr_code_base64,
      ticketUrl: existing.gateway_ticket_url,
      expiresAt: existing.expires_at,
      valor: existing.valor_bruto,
    })
  }

  // 4. Calcula valores
  const valorBruto = Number(frete.preco_total)
  const comissaoValor = Math.round(valorBruto * (COMISSAO_PERCENTUAL / 100) * 100) / 100
  const valorLiquido = Math.round((valorBruto - comissaoValor) * 100) / 100

  // 5. Cria registro pendente
  const { data: inserted, error: insertErr } = await admin
    .from('transactions')
    .insert({
      kind: 'frete',
      frete_id: freteId,
      produtor_id: frete.produtor_id,
      prestador_id: null,
      valor_bruto: valorBruto,
      comissao_percentual: COMISSAO_PERCENTUAL,
      comissao_valor: comissaoValor,
      valor_liquido: valorLiquido,
      gateway: 'mercadopago',
      status: 'created',
    })
    .select('id')
    .single()
  if (insertErr || !inserted) {
    return NextResponse.json({ error: 'Erro ao registrar transação.' }, { status: 500 })
  }

  // 6. Cria cobrança no Mercado Pago
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://boihub.com.br'
  try {
    const pix = await criarCobrancaPix({
      transactionAmount: valorBruto,
      description: `Frete ${frete.origem} → ${frete.destino} (${frete.cabecas} cab.)`,
      payerEmail: user.email ?? `produtor-${user.id}@boihub.com.br`,
      externalReference: inserted.id,
      notificationUrl: `${siteUrl}/api/webhooks/mercadopago`,
      expiresInMinutes: 30,
    })

    await admin
      .from('transactions')
      .update({
        gateway_transaction_id: pix.gatewayId,
        gateway_qr_code: pix.qrCode,
        gateway_qr_code_base64: pix.qrCodeBase64,
        gateway_ticket_url: pix.ticketUrl,
        expires_at: pix.expiresAt,
        status: 'pending',
        updated_at: new Date().toISOString(),
      })
      .eq('id', inserted.id)

    return NextResponse.json({
      transactionId: inserted.id,
      qrCode: pix.qrCode,
      qrCodeBase64: pix.qrCodeBase64,
      ticketUrl: pix.ticketUrl,
      expiresAt: pix.expiresAt,
      valor: valorBruto,
    })
  } catch (err) {
    await admin
      .from('transactions')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', inserted.id)
    const message = err instanceof Error ? err.message : 'Erro no gateway de pagamento.'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
