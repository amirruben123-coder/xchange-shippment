import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { fmtMoney, fmtDateTime, STATUS_BADGE } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  const user = session!.user as any
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  const ship = await prisma.shipment.findUnique({
    where: { id },
    include: { events: { orderBy: { createdAt: 'asc' } }, owner: { select: { name: true, email: true } } },
  })
  if (!ship) notFound()
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } })

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={{ ...user, wallet: dbUser?.wallet, points: dbUser?.points }} unread={unread} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6">
          <div className="mb-4"><Link href="/shipments" className="text-sm text-muted hover:text-white">← Back to shipments</Link></div>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold font-mono">{ship.trackingNumber}</h1>
              <p className="text-sm text-muted mt-1">Created {fmtDateTime(ship.createdAt)}</p>
            </div>
            <span className={`badge text-sm py-1.5 px-4 ${STATUS_BADGE[ship.status]||''}`}>{ship.status.replace(/_/g,' ')}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <div className="card p-6">
                <h3 className="font-display font-semibold mb-4">Shipment Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    ['From', ship.origin],
                    ['To', ship.destination],
                    ['Description', ship.description || '—'],
                    ['Weight', `${ship.weightKg} kg`],
                    ['Cost', fmtMoney(ship.cost)],
                    ['Points Used', `${ship.pointsUsed} pts`],
                  ].map(([l,v])=>(
                    <div key={l}>
                      <div className="text-xs text-muted uppercase tracking-wider mb-1">{l}</div>
                      <div className="text-sm font-medium">{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-display font-semibold mb-5">Shipment Timeline</h3>
                <div className="border-l-2 border-white/[0.08] pl-5 space-y-5">
                  {ship.events.map((e, i) => (
                    <div key={e.id} className="relative">
                      <div className={`absolute -left-[25px] w-3 h-3 rounded-full border-2 border-accent ${i===ship.events.length-1?'bg-accent shadow-[0_0_0_4px_rgba(255,138,61,0.2)]':'bg-bg'}`} />
                      <div className="font-semibold text-sm">{e.status.replace(/_/g,' ')}</div>
                      {e.location && <div className="text-xs text-muted mt-0.5">📍 {e.location}</div>}
                      {e.note && <div className="text-xs text-muted mt-0.5">{e.note}</div>}
                      <div className="text-xs text-muted font-mono mt-1">{fmtDateTime(e.createdAt)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="card p-5">
                <h3 className="font-display font-semibold mb-3">Share Tracking</h3>
                <p className="text-xs text-muted mb-3">Anyone with this number can track this shipment.</p>
                <div className="bg-bg2 border border-white/[0.08] rounded-lg p-3 font-mono text-sm text-accent2 mb-3">{ship.trackingNumber}</div>
                <button
                  onClick={() => {}}
                  className="btn btn-outline w-full btn-sm"
                  id="copyBtn"
                >
                  📋 Copy Tracking Number
                </button>
              </div>

              {(user.id === ship.ownerId || user.role === 'SUPER_ADMIN') && (
                <div className="card p-5">
                  <h3 className="font-display font-semibold mb-4">Update Status</h3>
                  <form action={`/api/shipments/${id}`} method="PATCH" className="space-y-3">
                    <div>
                      <label className="label">New Status</label>
                      <select name="status" className="select">
                        {['PENDING','CONFIRMED','PICKED_UP','IN_TRANSIT','AT_EXCHANGE_HUB','OUT_FOR_DELIVERY','DELIVERED','CANCELLED','RETURNED'].map(s=>(
                          <option key={s} value={s} selected={s===ship.status}>{s.replace(/_/g,' ')}</option>
                        ))}
                      </select>
                    </div>
                    <div><label className="label">Location (optional)</label><input name="location" className="input" placeholder="e.g. Exchange Hub B, Lagos" /></div>
                    <div><label className="label">Note (optional)</label><input name="note" className="input" placeholder="Additional details" /></div>
                    <p className="text-xs text-muted">Use the API endpoint directly or build a client-side form to update status.</p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
