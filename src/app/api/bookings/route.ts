import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { debitWallet, createInvoice } from '@/lib/wallet'
import { z } from 'zod'

const schema = z.object({
  type: z.enum(['FLIGHT', 'HOTEL']),
  cost: z.number().positive(),
  details: z.record(z.any()),
})

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id as string
  const isAdmin = (session.user as any).role === 'SUPER_ADMIN'
  const bookings = await prisma.booking.findMany({
    where: isAdmin ? {} : { userId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(bookings)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id as string
  try {
    const body = await req.json()
    const data = schema.parse(body)
    await debitWallet(userId, data.cost, 0, 'ADJUSTMENT', `${data.type} booking`)
    const ref = (data.type === 'FLIGHT' ? 'BK-FL-' : 'BK-HT-') + Date.now().toString(36).toUpperCase()
    const booking = await prisma.booking.create({
      data: { userId, type: data.type, cost: data.cost, ref, details: data.details },
    })
    await createInvoice(userId, [{ label: `${data.type} booking — ${ref}`, qty: 1, price: data.cost }], undefined, booking.id)
    await prisma.notification.create({
      data: { userId, type: 'BOOKING', title: `Booking ${ref} confirmed`, message: `Your ${data.type.toLowerCase()} booking has been recorded.` },
    })
    return NextResponse.json(booking, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Booking failed.' }, { status: 400 })
  }
}
