import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { creditWallet, createInvoice } from '@/lib/wallet'
import { z } from 'zod'

const PACKAGES: Record<string, { points: number; price: number; name: string }> = {
  starter: { name: 'Starter', points: 100, price: 50 },
  growth: { name: 'Growth', points: 250, price: 120 },
  pro: { name: 'Pro', points: 600, price: 270 },
  scale: { name: 'Scale', points: 1500, price: 650 },
}

const schema = z.object({
  packageId: z.enum(['starter', 'growth', 'pro', 'scale']),
  provider: z.enum(['stripe', 'paystack', 'ercaspay']),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    const { packageId, provider } = schema.parse(body)
    const pkg = PACKAGES[packageId]
    const userId = session.user.id as string
    // In production: process real payment here via Stripe/Paystack/Ercaspay
    // For now: simulate successful payment
    await creditWallet(userId, pkg.price, pkg.points, 'POINT_PURCHASE', `${pkg.name} package via ${provider}`)
    await createInvoice(userId, [{ label: `${pkg.name} Points Package (${pkg.points} pts)`, qty: 1, price: pkg.price }])
    return NextResponse.json({ ok: true, points: pkg.points, amount: pkg.price })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Purchase failed.' }, { status: 400 })
  }
}
