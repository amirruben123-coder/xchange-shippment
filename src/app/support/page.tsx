import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { fmtDate, STATUS_BADGE } from '@/lib/utils'
import Link from 'next/link'

export default async function SupportPage() {
  const session = await auth()
  const user = session!.user as any
  const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
  const tickets = await prisma.ticket.findMany({ where: { requesterId: user.id }, include: { messages: { include: { sender: { select: { name: true, role: true } } } } }, orderBy: { createdAt: 'desc' } })
  const unread = await prisma.notification.count({ where: { userId: user.id, isRead: false } })

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={{ ...user, wallet: dbUser?.wallet, points: dbUser?.points }} unread={unread} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div><h1 className="font-display text-2xl font-bold">Support</h1><p className="text-sm text-muted mt-1">Get help with your account, shipments, or payments.</p></div>
            <Link href="/support/new" className="btn btn-primary">🎫 Open Ticket</Link>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Contact info */}
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-display font-semibold mb-4">Contact Us Directly</h3>
                <div className="space-y-3">
                  <a href="mailto:brightolisaeneh@gmail.com" className="flex items-center gap-3 text-sm hover:text-accent2 transition-colors"><span className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">📧</span>brightolisaeneh@gmail.com</a>
                  <a href="tel:09058326972" className="flex items-center gap-3 text-sm hover:text-accent2 transition-colors"><span className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">📞</span>09058326972</a>
                </div>
              </div>
              <div className="card p-5">
                <h3 className="font-display font-semibold mb-3">Response Time</h3>
                <div className="flex items-center gap-2 text-sm text-success"><span className="w-2 h-2 rounded-full bg-success inline-block"></span>Usually responds within a few hours</div>
                <p className="text-xs text-muted mt-2">24/7 support available for urgent issues.</p>
              </div>
            </div>
            {/* Tickets */}
            <div className="lg:col-span-2">
              <div className="card p-5">
                <h3 className="font-display font-semibold mb-4">Your Tickets ({tickets.length})</h3>
                {tickets.length ? (
                  <div className="space-y-3">
                    {tickets.map(t=>(
                      <div key={t.id} className="border border-white/[0.08] rounded-xl p-4 hover:border-accent/30 transition-colors">
                        <div className="flex justify-between items-start gap-3 mb-2">
                          <div>
                            <div className="font-semibold text-sm">{t.subject}</div>
                            <div className="font-mono text-xs text-muted mt-0.5">{t.number}</div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <span className={`badge ${STATUS_BADGE[t.priority]||''}`}>{t.priority}</span>
                            <span className={`badge ${STATUS_BADGE[t.status]||''}`}>{t.status.replace(/_/g,' ')}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted">{t.messages.length} messages · {fmtDate(t.createdAt)}</div>
                        {t.messages.slice(-1).map(m=>(
                          <div key={m.id} className="mt-3 bg-bg2 rounded-lg p-3 text-xs">
                            <span className="text-muted font-medium">{m.sender.name}: </span>{m.body}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted">
                    <div className="text-4xl mb-3">🎫</div>
                    <p className="text-sm">No support tickets yet.</p>
                    <Link href="/support/new" className="text-accent2 hover:underline text-sm mt-2 inline-block">Open your first ticket →</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
