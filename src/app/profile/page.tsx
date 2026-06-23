import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { fmtMoney, fmtDate } from '@/lib/utils'

export default async function ProfilePage() {
  const session = await auth()
  const user = session!.user as any
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  const shipCount = await prisma.shipment.count({ where: { ownerId: user.id } })
  const bookCount = await prisma.booking.count({ where: { userId: user.id } })
  const txCount = await prisma.transaction.count({ where: { userId: user.id } })
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } })

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={{ ...user, wallet: dbUser?.wallet, points: dbUser?.points }} unread={unread} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6 max-w-3xl">
          <div className="mb-6"><h1 className="font-display text-2xl font-bold">Profile</h1><p className="text-sm text-muted mt-1">Your account details and statistics.</p></div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="card p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-[#E8643A] flex items-center justify-center font-display font-bold text-2xl text-[#0B1320]">
                  {dbUser?.name.charAt(0)||'U'}
                </div>
                <div>
                  <div className="font-display text-xl font-bold">{dbUser?.name}</div>
                  <div className="text-sm text-muted">{dbUser?.email}</div>
                  <span className={`badge mt-1 ${dbUser?.role==='SUPER_ADMIN'?'bg-red-500/10 text-red-400 border border-red-500/20':'bg-white/5 text-white/40 border border-white/10'}`}>{dbUser?.role.replace(/_/g,' ')}</span>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {[['Email',dbUser?.email||'—'],['Phone',dbUser?.phone||'—'],['Member since',fmtDate(dbUser?.createdAt||new Date())],['Status',dbUser?.status||'—']].map(([l,v])=>(
                  <div key={l} className="flex justify-between py-2 border-b border-white/[0.06] last:border-0">
                    <span className="text-muted">{l}</span><span className="font-medium">{v as string}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted mt-4 p-3 bg-bg2 rounded-lg">To update your profile details, contact support at brightolisaeneh@gmail.com</p>
            </div>
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-display font-semibold mb-4">Account Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {label:'Shipments',val:shipCount,color:'text-accent2'},
                    {label:'Bookings',val:bookCount,color:'text-blue-400'},
                    {label:'Transactions',val:txCount,color:'text-warning'},
                    {label:'Points',val:Number(dbUser?.points||0).toLocaleString(),color:'text-success'},
                  ].map(s=>(
                    <div key={s.label} className="bg-bg2 border border-white/[0.08] rounded-xl p-4 text-center">
                      <div className={`font-display text-2xl font-bold ${s.color}`}>{s.val}</div>
                      <div className="text-xs text-muted mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-5">
                <h3 className="font-display font-semibold mb-4">Wallet Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted">Wallet Balance</span><span className="font-mono text-success">{fmtMoney(dbUser?.wallet||0)}</span></div>
                  <div className="flex justify-between"><span className="text-muted">Points Balance</span><span className="font-mono text-warning">{Number(dbUser?.points||0).toLocaleString()} pts</span></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
