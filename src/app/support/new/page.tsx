'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function NewTicketPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const [form, setForm] = useState({ subject: '', category: 'General', priority: 'MEDIUM', message: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Failed to create ticket.'); return }
    router.push('/support')
  }

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={user} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6 max-w-2xl">
          <div className="mb-6">
            <Link href="/support" className="text-sm text-muted hover:text-white">← Back to support</Link>
            <h1 className="font-display text-2xl font-bold mt-2">Open Support Ticket</h1>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 text-sm text-red-400 mb-5">{error}</div>}
          <div className="card p-6">
            <form onSubmit={submit} className="space-y-4">
              <div><label className="label">Subject *</label><input value={form.subject} onChange={set('subject')} className="input" placeholder="Briefly describe your issue" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select value={form.category} onChange={set('category')} className="select">
                    <option>General</option><option>Shipment Issue</option><option>Wallet & Points</option>
                    <option>Booking</option><option>Payment</option><option>Account</option>
                  </select>
                </div>
                <div>
                  <label className="label">Priority</label>
                  <select value={form.priority} onChange={set('priority')} className="select">
                    <option value="LOW">Low</option><option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option><option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Message *</label>
                <textarea value={form.message} onChange={set('message')} className="input" rows={5} placeholder="Describe your issue in detail..." required style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">{loading ? 'Submitting...' : 'Submit Ticket'}</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
