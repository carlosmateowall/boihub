import { MercadoPagoConfig, Payment } from 'mercadopago'

/**
 * Cliente configurado do Mercado Pago.
 *
 * Variável de ambiente esperada:
 *  - MP_ACCESS_TOKEN  (production ou sandbox).
 *    Obter em https://www.mercadopago.com.br/developers/panel/credentials
 *
 * Esta função joga uma exceção clara se a env não estiver setada — assim
 * o endpoint /api retorna 503 com mensagem útil em vez de stack trace.
 */
function getAccessToken(): string {
  const token = process.env.MP_ACCESS_TOKEN
  if (!token) {
    throw new Error(
      'MP_ACCESS_TOKEN não configurado. Configure no Vercel (ou .env.local) ' +
        'com o access token do Mercado Pago (https://www.mercadopago.com.br/developers/panel/credentials).',
    )
  }
  return token
}

let cachedClient: MercadoPagoConfig | null = null

export function getMercadoPagoClient(): MercadoPagoConfig {
  if (cachedClient) return cachedClient
  cachedClient = new MercadoPagoConfig({
    accessToken: getAccessToken(),
    options: { timeout: 10_000 },
  })
  return cachedClient
}

export function getPaymentClient(): Payment {
  return new Payment(getMercadoPagoClient())
}

export interface CriarPixInput {
  /** Valor total em BRL (ex: 280.00) */
  transactionAmount: number
  /** Descrição que aparece pro pagador */
  description: string
  /** Email do pagador */
  payerEmail: string
  /** Identificador externo (id da transaction do BoiHub) */
  externalReference: string
  /** URL HTTPS pra receber webhook */
  notificationUrl?: string
  /** Tempo de expiração em minutos (default 30 min) */
  expiresInMinutes?: number
}

export interface CriarPixOutput {
  /** ID do payment no Mercado Pago */
  gatewayId: string
  /** Status retornado pelo MP */
  status: string
  /** Código PIX copia-e-cola */
  qrCode: string
  /** PNG base64 do QR Code */
  qrCodeBase64: string
  /** URL alternativa pro ticket */
  ticketUrl?: string
  /** Quando expira (ISO) */
  expiresAt: string
}

/**
 * Cria uma cobrança PIX no Mercado Pago.
 * Retorna QR Code + código copia-e-cola pra exibir pro produtor.
 */
export async function criarCobrancaPix(input: CriarPixInput): Promise<CriarPixOutput> {
  const expiresInMinutes = input.expiresInMinutes ?? 30
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString()

  const payment = getPaymentClient()
  const response = await payment.create({
    body: {
      transaction_amount: Math.round(input.transactionAmount * 100) / 100,
      description: input.description,
      payment_method_id: 'pix',
      payer: { email: input.payerEmail },
      external_reference: input.externalReference,
      notification_url: input.notificationUrl,
      date_of_expiration: expiresAt,
    },
  })

  const trans = response.point_of_interaction?.transaction_data
  if (!trans?.qr_code || !trans?.qr_code_base64) {
    throw new Error('Mercado Pago não retornou QR Code. Resposta inesperada.')
  }

  return {
    gatewayId: String(response.id),
    status: response.status ?? 'pending',
    qrCode: trans.qr_code,
    qrCodeBase64: trans.qr_code_base64,
    ticketUrl: trans.ticket_url,
    expiresAt,
  }
}

/**
 * Consulta status de um pagamento no Mercado Pago pelo gateway id.
 */
export async function consultarPagamento(gatewayId: string) {
  const payment = getPaymentClient()
  return payment.get({ id: gatewayId })
}
