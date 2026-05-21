import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppBottomNav } from '@/components/layout/AppBottomNav'
import { AppTopBar } from '@/components/layout/AppTopBar'
import type { Profile } from '@/types/database'

export const dynamic = 'force-dynamic'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let profile: Profile | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = (data as Profile) ?? null
  }

  return (
    <div className="flex min-h-screen bg-creme">
      <AppSidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader profile={profile} />
        <AppTopBar profile={profile} />
        <main className="flex-1 px-4 pt-5 pb-28 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl w-full">
            {children}
          </div>
        </main>
      </div>
      <AppBottomNav profile={profile} />
    </div>
  )
}
