import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { fmtMoney, fmtDate } from '@/lib/utils'
import Link from 'next/link'

export default async function BookingsPage() {
  const session = await auth()
  const user = session!.user as any
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  const bookings = await prisma.booking.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } })
  const flights = bookings.filter(b=>b.type==='FLIGHT')
  const hotels = bookings.filter(b=>b.type==='HOTEL')

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={{ ...user, wallet: dbUser?.wallet, points: dbUser?.points }} unread={unread} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div><h1 className="font-display text-2xl font-bold">Travel Bookings</h1><p className="text-sm text-muted mt-1">Manage your flight and hotel reservations.</p></div>
            <Link href="/bookings/new" className="btn btn-primary">➕ New Booking</Link>
          </div>
          {['FLIGHT','HOTEL'].map(type=>{
            const list=type==='FLIGHT'?flights:hotels
            return (
              <div key={type} className="card p-5 mb-5">
                <h3 className="font-display font-semibold mb-4">{type==='FLIGHT'?'✈️ Flights':'🏨 Hotels'} ({list.length})</h3>
                {list.length ? (
                  <div className="overflow-x-auto">
                    <table className="tbl">
                      <thead><tr><th>Reference</th><th>{type==='FLIGHT'?'Airline / Flight':'Hotel'}</th><th>{type==='FLIGHT'?'Route':'City'}</th><th>Date</th><th>Status</th><th>Cost</th></tr></thead>
                      <tbody>
                        {list.map(b=>{
                          const d=b.details as any
                          return (
                            <tr key={b.id}>
                              <td className="font-mono text-accent2 text-xs">{b.ref}</td>
                              <td>{type==='FLIGHT'?`${d.airline} ${d.flight}`:d.hotel}</td>
                              <td>{type==='FLIGHT'?`${d.from} → ${d.to}`:d.city}</td>
                              <td className="text-xs text-muted">{fmtDate(type==='FLIGHT'?d.departure:d.checkIn)}</td>
                              <td><span className="badge bg-green-500/10 text-green-400 border border-green-500/20">{b.status}</span></td>
                              <td className="font-mono text-xs">{fmtMoney(b.cost)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : <div className="text-center py-8 text-sm text-muted">No {type.toLowerCase()} bookings yet.</div>}
              </div>
            )
          })}
        </main>
      </div>
    </div>
  )
}
