import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { fmtMoney, fmtDate, STATUS_BADGE } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  const user = session!.user as any
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  const shipments = await prisma.shipment.findMany({ where: { ownerId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 })
  const txns = await prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, take: 5 })
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } })
  const activeShips = await prisma.shipment.count({ where: { ownerId: user.id, status: { notIn: ['DELIVERED','CANCELLED','RETURNED'] } } })
  const bookingCount = await prisma.booking.count({ where: { userId: user.id } })

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={{ ...user, wallet: dbUser?.wallet, points: dbUser?.points }} unread={unread} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold">Welcome back, {user.name?.split(' ')[0]} 👋</h1>
              <p className="text-sm text-muted mt-1">Here's your account overview.</p>
            </div>
            <Link href="/shipments/new" className="btn btn-primary">➕ New Shipment</Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {label:'Wallet Balance',val:fmtMoney(dbUser?.wallet||0),sub:'Available balance',icon:'💳',color:'si-o'},
              {label:'Points Balance',val:`${Number(dbUser?.points||0).toLocaleString()} pts`,sub:'Available points',icon:'🪙',color:'si-y'},
              {label:'Active Shipments',val:activeShips,sub:'In progress',icon:'📦',color:'si-b'},
              {label:'Travel Bookings',val:bookingCount,sub:'Total bookings',icon:'✈️',color:'si-g'},
            ].map(s=>(
              <div key={s.label} className="card p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-muted mb-1.5">{s.label}</div>
                    <div className="font-display text-2xl font-bold">{s.val}</div>
                    <div className="text-xs text-muted mt-1.5">{s.sub}</div>
                  </div>
                  <div className="text-xl p-2 bg-accent/10 rounded-xl">{s.icon}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5 mb-5">
            <div className="card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">Recent Shipments</h3>
                <Link href="/shipments" className="text-xs text-accent2 hover:underline">View all →</Link>
              </div>
              {shipments.length ? (
                <table className="tbl">
                  <thead><tr><th>Tracking #</th><th>Destination</th><th>Status</th><th>Created</th></tr></thead>
                  <tbody>
                    {shipments.map(s=>(
                      <tr key={s.id} className="cursor-pointer" onClick={()=>{}}>
                        <td><Link href={`/shipments/${s.id}`} className="font-mono text-accent2 text-xs">{s.trackingNumber}</Link></td>
                        <td className="text-sm max-w-[140px] truncate">{s.destination}</td>
                        <td><span className={`badge ${STATUS_BADGE[s.status]||''}`}>{s.status.replace(/_/g,' ')}</span></td>
                        <td className="text-xs text-muted">{fmtDate(s.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10 text-sm text-muted">
                  No shipments yet. <Link href="/shipments/new" className="text-accent2 hover:underline">Create your first →</Link>
                </div>
              )}
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold">Recent Transactions</h3>
                <Link href="/wallet" className="text-xs text-accent2 hover:underline">All →</Link>
              </div>
              {txns.length ? txns.map(t=>(
                <div key={t.id} className="flex justify-between items-center py-2.5 border-b border-white/[0.06] last:border-0">
                  <div>
                    <div className="text-xs font-medium">{t.description || t.source.replace(/_/g,' ')}</div>
                    <div className="text-[10px] text-muted mt-0.5">{fmtDate(t.createdAt)}</div>
                  </div>
                  <span className={`font-mono text-xs font-semibold ${t.type==='CREDIT'?'text-success':'text-danger'}`}>
                    {t.type==='CREDIT'?'+':'-'}{fmtMoney(t.amount)}
                  </span>
                </div>
              )) : <p className="text-sm text-muted text-center py-8">No transactions yet.</p>}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {href:'/shipments/new',icon:'📦',label:'Create Shipment'},
                {href:'/buy-points',icon:'🪙',label:'Buy Points'},
                {href:'/bookings',icon:'✈️',label:'Book Travel'},
                {href:'/support',icon:'🛟',label:'Get Support'},
              ].map(a=>(
                <Link key={a.href} href={a.href} className="flex flex-col items-center gap-2 p-4 bg-bg2 border border-white/[0.08] rounded-xl hover:border-accent/30 hover:bg-accent/5 transition-all text-sm font-medium">
                  <span className="text-2xl">{a.icon}</span>{a.label}
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
