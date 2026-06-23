import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { fmtMoney, fmtDateTime } from '@/lib/utils'
import Link from 'next/link'

export default async function WalletPage() {
  const session = await auth()
  const user = session!.user as any
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  const txns = await prisma.transaction.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } })
  const credits = txns.filter(t=>t.type==='CREDIT').reduce((s,t)=>s+Number(t.amount),0)
  const debits = txns.filter(t=>t.type==='DEBIT').reduce((s,t)=>s+Number(t.amount),0)

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={{ ...user, wallet: dbUser?.wallet, points: dbUser?.points }} unread={unread} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div><h1 className="font-display text-2xl font-bold">Wallet & Points</h1><p className="text-sm text-muted mt-1">Manage your balance and view transaction history.</p></div>
            <Link href="/buy-points" className="btn btn-primary">🪙 Buy Points</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {label:'Wallet Balance',val:fmtMoney(dbUser?.wallet||0),icon:'💳'},
              {label:'Points Balance',val:`${Number(dbUser?.points||0).toLocaleString()} pts`,icon:'🪙'},
              {label:'Total Funded',val:fmtMoney(credits),icon:'📈'},
              {label:'Total Spent',val:fmtMoney(debits),icon:'📉'},
            ].map(s=>(
              <div key={s.label} className="card p-5">
                <div className="text-xl mb-2">{s.icon}</div>
                <div className="text-xs text-muted mb-1">{s.label}</div>
                <div className="font-display text-2xl font-bold">{s.val}</div>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <h3 className="font-display font-semibold mb-4">Transaction History</h3>
            {txns.length ? (
              <div className="overflow-x-auto">
                <table className="tbl">
                  <thead><tr><th>Description</th><th>Type</th><th>Points</th><th>Amount</th><th>Balance After</th><th>Date</th></tr></thead>
                  <tbody>
                    {txns.map(t=>(
                      <tr key={t.id}>
                        <td className="text-sm">{t.description||t.source.replace(/_/g,' ')}</td>
                        <td><span className={`badge ${t.type==='CREDIT'?'bg-green-500/10 text-green-400 border border-green-500/20':'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{t.type}</span></td>
                        <td className="font-mono text-xs text-warning">{t.points>0?t.points:'—'}</td>
                        <td className={`font-mono text-xs ${t.type==='CREDIT'?'text-success':'text-danger'}`}>{t.type==='CREDIT'?'+':'-'}{fmtMoney(t.amount)}</td>
                        <td className="font-mono text-xs">{fmtMoney(t.balanceAfter)}</td>
                        <td className="text-xs text-muted">{fmtDateTime(t.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-center py-12 text-sm text-muted">No transactions yet. <Link href="/buy-points" className="text-accent2 hover:underline">Buy points to get started.</Link></div>}
          </div>
        </main>
      </div>
    </div>
  )
}
