import { OnboardingForm } from '@/components/auth/OnboardingForm'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Bem-vindo ao BoiHub' }

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-canvas-soft flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
        <OnboardingForm />
      </div>
    </div>
  )
}
