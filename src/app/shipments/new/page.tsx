'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function NewShipmentPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [description, setDescription] = useState('')
  const [weightKg, setWeightKg] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const cost = 10 + weightKg * 4
  const pts = Math.ceil(cost / 0.5)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    const res = await fetch('/api/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, destination, description, weightKg }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Failed to create shipment.'); return }
    router.push(`/shipments/${data.id}`)
  }

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={user} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6 max-w-3xl">
          <div className="mb-6">
            <Link href="/shipments" className="text-sm text-muted hover:text-white">← Back to shipments</Link>
            <h1 className="font-display text-2xl font-bold mt-2">Create Shipment</h1>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 text-sm text-red-400 mb-5">{error}</div>}
          <div className="grid md:grid-cols-5 gap-5">
            <form onSubmit={submit} className="md:col-span-3 card p-6 space-y-4">
              <h3 className="font-display font-semibold">Shipment Details</h3>
              <div>
                <label className="label">Origin Address *</label>
                <input value={origin} onChange={e => setOrigin(e.target.value)} className="input" placeholder="e.g. Vendor Warehouse, Lagos, NG" required />
              </div>
              <div>
                <label className="label">Destination Address *</label>
                <input value={destination} onChange={e => setDestination(e.target.value)} className="input" placeholder="e.g. 123 Main St, Houston, TX" required />
              </div>
              <div>
                <label className="label">Package Description</label>
                <input value={description} onChange={e => setDescription(e.target.value)} className="input" placeholder="e.g. Electronics, clothing" />
              </div>
              <div>
                <label className="label">Weight (kg)</label>
                <input type="number" value={weightKg} onChange={e => setWeightKg(parseFloat(e.target.value) || 1)} className="input" style={{ maxWidth: '140px' }} min="0.1" step="0.1" />
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
                {loading ? 'Creating...' : 'Create Shipment'}
              </button>
            </form>
            <div className="md:col-span-2 card p-6 h-fit">
              <h3 className="font-display font-semibold mb-4">Cost Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted">Base fee</span><span>$10.00</span></div>
                <div className="flex justify-between"><span className="text-muted">Weight ({weightKg}kg × $4)</span><span>${(weightKg * 4).toFixed(2)}</span></div>
                <div className="h-px bg-white/[0.08]" />
                <div className="flex justify-between font-semibold text-base"><span>Total Cost</span><span>${cost.toFixed(2)}</span></div>
                <div className="flex justify-between text-warning"><span>Points Required</span><span>{pts} pts</span></div>
                <div className="h-px bg-white/[0.08]" />
                <div className="flex justify-between text-xs text-muted">
                  <span>Your points</span>
                  <span>{Number(user?.points || 0).toLocaleString()} pts</span>
                </div>
              </div>
              {Number(user?.points || 0) < pts && (
                <div className="mt-4 bg-red-500/10 border border-red-500/25 rounded-lg p-3 text-xs text-red-400">
                  Insufficient points. <Link href="/buy-points" className="underline">Buy more →</Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
