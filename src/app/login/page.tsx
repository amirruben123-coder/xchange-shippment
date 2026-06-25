'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (res?.error) setError('Invalid email or password.')
    else router.push('/dashboard')
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
          <h1 className="font-display text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-muted mb-6">Sign in to manage your shipments, wallet, and more.</p>
          
          <div className="bg-bg2 border border-white/[0.08] rounded-xl p-4 mb-6 text-xs">
            <div className="font-semibold text-accent2 mb-2">🔑 Demo accounts</div>
            <div className="text-muted space-y-1">
            </div>
          </div>
          {error && <div className="bg-red-500/10 border border-red-500/25 rounded-lg p-3 text-sm text-red-400 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="label">Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="input" placeholder="you@example.com" required /></div>
            <div><label className="label">Password</label><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="input" placeholder="••••••••" required /></div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <p className="text-center text-sm text-muted mt-5">Don't have an account? <Link href="/register" className="text-accent2 hover:underline">Create one</Link></p>
        </div>
      </div>
    </div>
  )
}
