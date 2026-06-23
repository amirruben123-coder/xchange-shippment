import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { fmtDateTime } from '@/lib/utils'

export default async function NotificationsPage() {
  const session = await auth()
  const user = session!.user as any
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  const notifs = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
  const unread = notifs.filter(n => !n.isRead).length
  const ICONS: Record<string,string> = { SHIPMENT:'📦', WALLET:'💳', BOOKING:'✈️', TICKET:'🎫', SYSTEM:'🔔', ADMIN:'⚙️' }

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={{ ...user, wallet: dbUser?.wallet, points: dbUser?.points }} unread={unread} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="font-display text-2xl font-bold">Notifications</h1><p className="text-sm text-muted mt-1">{unread} unread</p></div>
          </div>
          <div className="card overflow-hidden">
            {notifs.length ? notifs.map(n=>(
              <div key={n.id} className={`flex gap-4 p-5 border-b border-white/[0.06] last:border-0 ${!n.isRead?'bg-accent/[0.03]':''}`}>
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-lg shrink-0">{ICONS[n.type]||'🔔'}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm flex items-center gap-2">
                    {n.title}
                    {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />}
                  </div>
                  <div className="text-xs text-muted mt-0.5">{n.message}</div>
                  <div className="text-[10px] text-muted font-mono mt-1">{fmtDateTime(n.createdAt)}</div>
                </div>
              </div>
            )) : <div className="text-center py-16 text-muted text-sm">No notifications yet.</div>}
          </div>
        </main>
      </div>
    </div>
  )
}
