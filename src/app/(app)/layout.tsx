import { Sidebar } from '@/components/layout/Sidebar'
import { MobileNav } from '@/components/layout/MobileNav'
import { Navbar } from '@/components/layout/Navbar'

export const dynamic = 'force-dynamic'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
          <div className="mx-auto max-w-5xl w-full">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
