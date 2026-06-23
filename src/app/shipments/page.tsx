import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { fmtMoney, fmtDate, STATUS_BADGE } from '@/lib/utils'
import Link from 'next/link'

export default async function ShipmentsPage() {
  const session = await auth()
  const user = session!.user as any
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  const shipments = await prisma.shipment.findMany({ where: { ownerId: user.id }, orderBy: { createdAt: 'desc' } })
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } })

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={{ ...user, wallet: dbUser?.wallet, points: dbUser?.points }} unread={unread} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div><h1 className="font-display text-2xl font-bold">My Shipments</h1><p className="text-sm text-muted mt-1">{shipments.length} total shipments</p></div>
            <Link href="/shipments/new" className="btn btn-primary">➕ Create Shipment</Link>
          </div>
          <div className="card p-5">
            {shipments.length ? (
              <div className="overflow-x-auto">
                <table className="tbl">
                  <thead><tr><th>Tracking #</th><th>Destination</th><th>Status</th><th>Cost</th><th>Points</th><th>Created</th><th></th></tr></thead>
                  <tbody>
                    {shipments.map(s=>(
                      <tr key={s.id}>
                        <td><span className="font-mono text-accent2 text-xs">{s.trackingNumber}</span></td>
                        <td className="text-sm max-w-[180px] truncate">{s.destination}</td>
                        <td><span className={`badge ${STATUS_BADGE[s.status]||''}`}>{s.status.replace(/_/g,' ')}</span></td>
                        <td className="font-mono text-xs">{fmtMoney(s.cost)}</td>
                        <td className="text-xs text-warning">{s.pointsUsed} pts</td>
                        <td className="text-xs text-muted">{fmtDate(s.createdAt)}</td>
                        <td><Link href={`/shipments/${s.id}`} className="btn btn-outline btn-sm">View</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16 text-muted">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-sm">No shipments yet. <Link href="/shipments/new" className="text-accent2 hover:underline">Create your first →</Link></p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
