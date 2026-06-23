import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { fmtMoney, fmtDate, STATUS_BADGE } from '@/lib/utils'

export default async function BillingPage() {
  const session = await auth()
  const user = session!.user as any
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  const invoices = await prisma.invoice.findMany({ where: { userId: user.id }, include: { items: true, receipts: true }, orderBy: { createdAt: 'desc' } })
  const receipts = await prisma.receipt.findMany({ where: { invoice: { userId: user.id } }, include: { invoice: { select: { number: true } } }, orderBy: { createdAt: 'desc' } })
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } })

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={{ ...user, wallet: dbUser?.wallet, points: dbUser?.points }} unread={unread} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6">
          <div className="mb-6"><h1 className="font-display text-2xl font-bold">Invoices & Receipts</h1><p className="text-sm text-muted mt-1">Your complete financial records.</p></div>
          <div className="card p-5 mb-5">
            <h3 className="font-display font-semibold mb-4">🧾 Invoices ({invoices.length})</h3>
            {invoices.length ? (
              <div className="overflow-x-auto">
                <table className="tbl">
                  <thead><tr><th>Invoice #</th><th>Items</th><th>Status</th><th>Total</th><th>Date</th></tr></thead>
                  <tbody>
                    {invoices.map(inv=>(
                      <tr key={inv.id}>
                        <td className="font-mono text-accent2 text-xs">{inv.number}</td>
                        <td className="text-xs text-muted max-w-[200px] truncate">{inv.items.map(i=>i.label).join(', ')}</td>
                        <td><span className={`badge ${STATUS_BADGE[inv.status]||''}`}>{inv.status}</span></td>
                        <td className="font-mono text-xs">{fmtMoney(inv.total)}</td>
                        <td className="text-xs text-muted">{fmtDate(inv.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-center py-8 text-sm text-muted">No invoices yet.</div>}
          </div>
          <div className="card p-5">
            <h3 className="font-display font-semibold mb-4">📄 Receipts ({receipts.length})</h3>
            {receipts.length ? (
              <div className="overflow-x-auto">
                <table className="tbl">
                  <thead><tr><th>Receipt #</th><th>Invoice</th><th>Amount</th><th>Method</th><th>Date</th></tr></thead>
                  <tbody>
                    {receipts.map(r=>(
                      <tr key={r.id}>
                        <td className="font-mono text-accent2 text-xs">{r.number}</td>
                        <td className="font-mono text-xs text-muted">{r.invoice.number}</td>
                        <td className="font-mono text-xs">{fmtMoney(r.amount)}</td>
                        <td><span className="badge bg-white/5 text-white/40 border border-white/10">{r.method}</span></td>
                        <td className="text-xs text-muted">{fmtDate(r.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <div className="text-center py-8 text-sm text-muted">No receipts yet.</div>}
          </div>
        </main>
      </div>
    </div>
  )
}
