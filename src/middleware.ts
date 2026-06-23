import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const PUBLIC = ['/', '/login', '/register', '/privacy', '/api/auth']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC.some((p) => pathname === p || pathname.startsWith(p))
  if (!req.auth && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  if (req.auth && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  if (pathname.startsWith('/admin') && req.auth?.user) {
    const role = (req.auth.user as any).role
    if (role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}
