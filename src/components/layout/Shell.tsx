'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const NAV = [
  { href: '/dashboard', icon: '📊', label: 'Dashboard' },
  { href: '/wallet', icon: '💳', label: 'Wallet & Points' },
  { href: '/buy-points', icon: '🪙', label: 'Buy Points' },
  { href: '/shipments', icon: '📦', label: 'Shipments' },
  { href: '/bookings', icon: '✈️', label: 'Travel Bookings' },
  { href: '/billing', icon: '🧾', label: 'Billing' },
  { href: '/support', icon: '🛟', label: 'Support' },
  { href: '/notifications', icon: '🔔', label: 'Notifications' },
  { href: '/profile', icon: '👤', label: 'Profile' },
]

export function Sidebar({ user }: { user: any }) {
  const path = usePathname()
  const isAdmin = user?.role === 'SUPER_ADMIN'
  return (
    <aside className="w-56 shrink-0 bg-bg2 border-r border-white/[0.08] h-[calc(100vh-64px)] sticky top-16 overflow-y-auto flex flex-col">
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              path === l.href
                ? 'bg-accent/10 text-accent2 border border-accent/20'
                : 'text-muted hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <span className="text-base">{l.icon}</span>
            {l.label}
          </Link>
        ))}
        {isAdmin && (
          <Link
            href="/admin"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              path.startsWith('/admin')
                ? 'bg-accent/10 text-accent2 border border-accent/20'
                : 'text-muted hover:text-white hover:bg-white/[0.03]'
            }`}
          >
            <span className="text-base">⚙️</span>
            Admin Panel
          </Link>
        )}
      </nav>
      <div className="p-3 border-t border-white/[0.08]">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-muted hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <span>🚪</span> Sign out
        </button>
      </div>
    </aside>
  )
}

export function TopBar({ user, unread = 0 }: { user: any; unread?: number }) {
  return (
    <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur-xl border-b border-white/[0.08] h-16 flex items-center px-6 justify-between">
      <Link href="/dashboard" className="flex items-center gap-2.5 font-display font-bold text-lg">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#E8643A] flex items-center justify-center text-[#0B1320] font-black text-sm">X</div>
        Xchangeshippment
      </Link>
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-accent2 hidden sm:block">
          ${Number(user?.wallet || 0).toFixed(2)}
        </span>
        <span className="text-xs font-mono text-warning hidden sm:block">
          {Number(user?.points || 0).toLocaleString()} pts
        </span>
        <Link href="/notifications" className="relative p-2 bg-panel border border-white/[0.08] rounded-lg">
          🔔
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-[#1A1006] text-[10px] font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </Link>
        <div className="w-8 h-8 rounded-full bg-panel2 flex items-center justify-center font-display font-bold text-xs">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  )
}
