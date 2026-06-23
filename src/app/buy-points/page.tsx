'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { useSession } from 'next-auth/react'

const PKGS = [
  { id: 'starter', name: 'Starter', points: 100, price: 50, badge: null },
  { id: 'growth', name: 'Growth', points: 250, price: 120, badge: 'Most Popular' },
  { id: 'pro', name: 'Pro', points: 600, price: 270, badge: null },
  { id: 'scale', name: 'Scale', points: 1500, price: 650, badge: 'Best Value' },
]
const PROVIDERS = [
  { id: 'stripe', name: 'Stripe', icon: '💳', sub: 'International card' },
  { id: 'paystack', name: 'Paystack', icon: '🏦', sub: 'Local (NGN)' },
  { id: 'ercaspay', name: 'Ercaspay', icon: '⚡', sub: 'Card, Bank, USSD' },
]

export default function BuyPointsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const [pkg, setPkg] = useState<string | null>(null)
  const [provider, setProvider] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const selectedPkg = PKGS.find((p) => p.id === pkg)

  async function purchase() {
    if (!pkg || !provider) {
      setMsg({ type: 'error', text: 'Please select a package and payment method.' })
      return
    }
    setLoading(true); setMsg(null)
    const res = await fetch('/api/wallet/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ packageId: pkg, provider }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setMsg({ type: 'error', text: data.error || 'Purchase failed.' }); return }
    setMsg({ type: 'success', text: `✅ ${data.points} points added to your account!` })
    setTimeout(() => router.push('/wallet'), 2000)
  }

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={user} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold">Buy Points</h1>
            <p className="text-sm text-muted mt-1">Choose a package. Points are credited instantly.</p>
          </div>
          {msg && (
            <div className={`rounded-xl p-4 text-sm mb-5 ${msg.type === 'success' ? 'bg-green-500/10 border border-green-500/25 text-green-400' : 'bg-red-500/10 border border-red-500/25 text-red-400'}`}>
              {msg.text}
            </div>
          )}
          <div className="card p-6 mb-5">
            <h3 className="font-display font-semibold mb-4">Select a package</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PKGS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setPkg(p.id)}
                  className={`relative border-2 rounded-xl p-5 text-center cursor-pointer transition-all ${pkg === p.id ? 'border-accent bg-accent/5' : 'border-white/[0.08] hover:border-accent/40'}`}
                >
                  {p.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-[#1A1006] text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                      {p.badge}
                    </div>
                  )}
                  <div className="text-xs text-muted uppercase tracking-wider mb-2">{p.name}</div>
                  <div className="font-display text-2xl font-bold mb-1">{p.points.toLocaleString()} pts</div>
                  <div className="text-sm text-muted">${p.price}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6 mb-5">
            <h3 className="font-display font-semibold mb-4">Payment method</h3>
            <div className="grid grid-cols-3 gap-4">
              {PROVIDERS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-all ${provider === p.id ? 'border-accent bg-accent/5' : 'border-white/[0.08] hover:border-accent/40'}`}
                >
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-xs text-muted">{p.sub}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-display font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between"><span className="text-muted">Package</span><span>{selectedPkg?.name || '—'}</span></div>
              <div className="flex justify-between"><span className="text-muted">Points</span><span className="text-warning">{selectedPkg?.points.toLocaleString() || '—'} pts</span></div>
              <div className="flex justify-between"><span className="text-muted">Provider</span><span>{provider ? PROVIDERS.find((p) => p.id === provider)?.name : '—'}</span></div>
              <div className="h-px bg-white/[0.08]" />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{selectedPkg ? `$${selectedPkg.price}` : '—'}</span>
              </div>
            </div>
            <button onClick={purchase} disabled={loading || !pkg || !provider} className="btn btn-primary w-full py-3">
              {loading ? 'Processing...' : 'Complete Purchase'}
            </button>
            <p className="text-xs text-muted text-center mt-3">1 point = $0.50 · Points credited instantly</p>
          </div>
        </main>
      </div>
    </div>
  )
}
