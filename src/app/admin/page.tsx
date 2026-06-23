import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { fmtMoney, fmtDate, STATUS_BADGE } from '@/lib/utils'

export default async function AdminPage() {
  const session = await auth()
  const user = session?.user as any
  if (!user || user.role !== 'SUPER_ADMIN') redirect('/dashboard')

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } })

  const [users, shipments, tickets, txns] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.shipment.findMany({
      include: { owner: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.ticket.findMany({
      include: { requester: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.transaction.findMany({
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
  ])

  const revenue = txns
    .filter((t) => t.type === 'CREDIT')
    .reduce((s, t) => s + Number(t.amount), 0)
  const openTickets = tickets.filter(
    (t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS'
  ).length

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={{ ...user, wallet: dbUser?.wallet, points: dbUser?.points }} unread={unread} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold">⚙️ Admin Panel</h1>
            <p className="text-sm text-muted mt-1">Full platform management — {user.email}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Users', val: users.length, icon: '👥' },
              { label: 'Total Shipments', val: shipments.length, icon: '📦' },
              { label: 'Total Revenue', val: fmtMoney(revenue), icon: '💰' },
              { label: 'Open Tickets', val: openTickets, icon: '🎫' },
            ].map((s) => (
              <div key={s.label} className="card p-5">
                <div className="text-xl mb-2">{s.icon}</div>
                <div className="text-xs text-muted mb-1">{s.label}</div>
                <div className="font-display text-2xl font-bold">{s.val}</div>
              </div>
            ))}
          </div>

          {/* Users */}
          <div className="card p-5 mb-5">
            <h3 className="font-display font-semibold mb-4">All Users ({users.length})</h3>
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Role</th>
                    <th>Status</th><th>Wallet</th><th>Points</th><th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="font-medium text-sm">{u.name}</td>
                      <td className="text-xs text-muted">{u.email}</td>
                      <td><span className={`badge ${STATUS_BADGE[u.role] || ''}`}>{u.role.replace(/_/g, ' ')}</span></td>
                      <td><span className={`badge ${STATUS_BADGE[u.status] || ''}`}>{u.status}</span></td>
                      <td className="font-mono text-xs">{fmtMoney(u.wallet)}</td>
                      <td className="text-xs text-warning">{u.points.toLocaleString()}</td>
                      <td className="text-xs text-muted">{fmtDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Shipments */}
          <div className="card p-5 mb-5">
            <h3 className="font-display font-semibold mb-4">All Shipments ({shipments.length})</h3>
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Tracking #</th><th>Owner</th><th>Destination</th>
                    <th>Status</th><th>Cost</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((s) => (
                    <tr key={s.id}>
                      <td className="font-mono text-accent2 text-xs">{s.trackingNumber}</td>
                      <td className="text-sm">{s.owner.name}</td>
                      <td className="text-xs text-muted max-w-[160px] truncate">{s.destination}</td>
                      <td><span className={`badge ${STATUS_BADGE[s.status] || ''}`}>{s.status.replace(/_/g, ' ')}</span></td>
                      <td className="font-mono text-xs">{fmtMoney(s.cost)}</td>
                      <td className="text-xs text-muted">{fmtDate(s.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tickets */}
          <div className="card p-5 mb-5">
            <h3 className="font-display font-semibold mb-4">Support Tickets ({tickets.length})</h3>
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Ticket #</th><th>Subject</th><th>Requester</th>
                    <th>Priority</th><th>Status</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td className="font-mono text-xs">{t.number}</td>
                      <td className="text-sm max-w-[180px] truncate">{t.subject}</td>
                      <td className="text-xs text-muted">{t.requester.name}</td>
                      <td><span className={`badge ${STATUS_BADGE[t.priority] || ''}`}>{t.priority}</span></td>
                      <td><span className={`badge ${STATUS_BADGE[t.status] || ''}`}>{t.status.replace(/_/g, ' ')}</span></td>
                      <td className="text-xs text-muted">{fmtDate(t.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transactions */}
          <div className="card p-5">
            <h3 className="font-display font-semibold mb-4">Recent Transactions</h3>
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>User</th><th>Type</th><th>Source</th>
                    <th>Amount</th><th>Points</th><th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {txns.map((t) => (
                    <tr key={t.id}>
                      <td className="text-sm">{t.user.name}</td>
                      <td>
                        <span className={`badge ${t.type === 'CREDIT' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="text-xs text-muted">{t.source.replace(/_/g, ' ')}</td>
                      <td className={`font-mono text-xs ${t.type === 'CREDIT' ? 'text-success' : 'text-danger'}`}>
                        {t.type === 'CREDIT' ? '+' : '-'}{fmtMoney(t.amount)}
                      </td>
                      <td className="text-xs text-warning">{t.points > 0 ? t.points : '—'}</td>
                      <td className="text-xs text-muted">{fmtDate(t.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
