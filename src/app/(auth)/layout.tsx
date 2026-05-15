import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas-soft flex flex-col">
      <header className="flex items-center p-6">
        <Link href="/" className="flex items-center gap-1">
          <span className="font-display font-extrabold text-2xl text-ink">Boi</span>
          <span className="font-display font-extrabold text-2xl text-primary">Hub</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
    </div>
  )
}
