import { OnboardingForm } from '@/components/auth/OnboardingForm'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Bem-vindo ao BoiHub' }

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-canvas-soft flex items-center justify-center p-6">
      <OnboardingForm />
    </div>
  )
}
