import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase com SERVICE ROLE.
 *
 * **NUNCA importar em código que roda no browser.** Service role bypassa
 * RLS e tem privilégios totais sobre o banco. Usar apenas em:
 *   - app/api/* (route handlers)
 *   - Server actions de Next.js
 *   - Scripts CLI
 *
 * Env esperada:
 *  - NEXT_PUBLIC_SUPABASE_URL
 *  - SUPABASE_SERVICE_ROLE_KEY (somente no servidor)
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error(
      'Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias para o admin client.',
    )
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
