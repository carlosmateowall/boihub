import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas-soft flex items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-1">
            <span className="font-display font-extrabold text-2xl text-ink">Boi</span>
            <span className="font-display font-extrabold text-2xl text-primary">Hub</span>
          </Link>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
