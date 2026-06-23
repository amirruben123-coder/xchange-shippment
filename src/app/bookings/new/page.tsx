'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar, TopBar } from '@/components/layout/Shell'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function NewBookingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user as any
  const [type, setType] = useState<'FLIGHT' | 'HOTEL'>('FLIGHT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ airline: '', flight: '', from: '', to: '', departure: '', hotel: '', city: '', checkIn: '', checkOut: '', cost: '' })
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    const details = type === 'FLIGHT'
      ? { airline: form.airline, flight: form.flight, from: form.from, to: form.to, departure: form.departure }
      : { hotel: form.hotel, city: form.city, checkIn: form.checkIn, checkOut: form.checkOut }
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, cost: parseFloat(form.cost), details }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error || 'Booking failed.'); return }
    router.push('/bookings')
  }

  return (
    <div className="min-h-screen bg-bg">
      <TopBar user={user} />
      <div className="flex">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0 p-6 max-w-2xl">
          <div className="mb-6">
            <Link href="/bookings" className="text-sm text-muted hover:text-white">← Back to bookings</Link>
            <h1 className="font-display text-2xl font-bold mt-2">New Booking</h1>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/25 rounded-xl p-4 text-sm text-red-400 mb-5">{error}</div>}
          <div className="card p-6">
            <div className="flex gap-3 mb-6">
              <button type="button" onClick={() => setType('FLIGHT')} className={`btn btn-sm ${type === 'FLIGHT' ? 'btn-primary' : 'btn-outline'}`}>✈️ Flight</button>
              <button type="button" onClick={() => setType('HOTEL')} className={`btn btn-sm ${type === 'HOTEL' ? 'btn-primary' : 'btn-outline'}`}>🏨 Hotel</button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              {type === 'FLIGHT' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="label">Airline *</label><input value={form.airline} onChange={set('airline')} className="input" placeholder="e.g. Emirates" required /></div>
                    <div><label className="label">Flight No. *</label><input value={form.flight} onChange={set('flight')} className="input" placeholder="e.g. EK783" required /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="label">From *</label><input value={form.from} onChange={set('from')} className="input" placeholder="Departure city" required /></div>
                    <div><label className="label">To *</label><input value={form.to} onChange={set('to')} className="input" placeholder="Arrival city" required /></div>
                  </div>
                  <div><label className="label">Departure Date *</label><input type="date" value={form.departure} onChange={set('departure')} className="input" required /></div>
                </>
              ) : (
                <>
                  <div><label className="label">Hotel Name *</label><input value={form.hotel} onChange={set('hotel')} className="input" placeholder="e.g. Eko Hotels & Suites" required /></div>
                  <div><label className="label">City *</label><input value={form.city} onChange={set('city')} className="input" placeholder="e.g. Lagos" required /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="label">Check-in *</label><input type="date" value={form.checkIn} onChange={set('checkIn')} className="input" required /></div>
                    <div><label className="label">Check-out *</label><input type="date" value={form.checkOut} onChange={set('checkOut')} className="input" required /></div>
                  </div>
                </>
              )}
              <div><label className="label">Total Cost (USD) *</label><input type="number" value={form.cost} onChange={set('cost')} className="input" placeholder="0.00" min="0" step="0.01" required /></div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">{loading ? 'Saving...' : 'Add Booking'}</button>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
