import type { Metadata } from 'next'
import { RedefinirSenhaForm } from '@/components/auth/RedefinirSenhaForm'

export const metadata: Metadata = {
  title: 'Redefinir senha — BoiHub',
}

export default function RedefinirSenhaPage() {
  return <RedefinirSenhaForm />
}
