'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Registration failed.'); setLoading(false); return }
    await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 font-display font-bold text-xl">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-[#E8643A] flex items-center justify-center text-[#0B1320] font-black">X</div>
            Xchangeshippment
          </Link>
        </div>
        <div className="card p-8">
          <h1 className="font-display text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-sm text-muted mb-6">Start tracking shipments, booking travel, and managing your wallet.</p>
          {error && <div className="bg-red-500/10 border border-red-500/25 rounded-lg p-3 text-sm text-red-400 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label">Full Name *</label><input value={form.name} onChange={set('name')} className="input" placeholder="Your full name" required /></div>
            <div><label className="label">Email *</label><input type="email" value={form.email} onChange={set('email')} className="input" placeholder="you@example.com" required /></div>
            <div><label className="label">Phone (optional)</label><input type="tel" value={form.phone} onChange={set('phone')} className="input" placeholder="09058326972" /></div>
            <div><label className="label">Password * (min 8 chars)</label><input type="password" value={form.password} onChange={set('password')} className="input" placeholder="Create a password" required /></div>
            <div><label className="label">Confirm Password *</label><input type="password" value={form.confirm} onChange={set('confirm')} className="input" placeholder="Repeat password" required /></div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-muted mt-5">Already have an account? <Link href="/login" className="text-accent2 hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
