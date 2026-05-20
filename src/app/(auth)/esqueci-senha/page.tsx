import type { Metadata } from 'next'
import { EsqueciSenhaForm } from '@/components/auth/EsqueciSenhaForm'

export const metadata: Metadata = {
  title: 'Esqueci minha senha — BoiHub',
}

export default function EsqueciSenhaPage() {
  return <EsqueciSenhaForm />
}
