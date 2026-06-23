import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { debitWallet, createInvoice } from '@/lib/wallet'
import { trackNum } from '@/lib/utils'
import { z } from 'zod'

const schema = z.object({
  origin: z.string().min(5),
  destination: z.string().min(5),
  description: z.string().optional(),
  weightKg: z.number().positive(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id as string
  const isAdmin = (session.user as any).role === 'SUPER_ADMIN'
  const shipments = await prisma.shipment.findMany({
    where: isAdmin ? {} : { ownerId: userId },
    include: { events: { orderBy: { createdAt: 'asc' } }, owner: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(shipments)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id as string
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const settings = await prisma.systemSetting.findMany({ where: { key: { in: ['baseFee', 'perKgRate', 'pointRate'] } } })
    const getSetting = (k: string, def: number) => {
      const s = settings.find((x) => x.key === k)
      return s ? parseFloat(s.value) : def
    }
    const baseFee = getSetting('baseFee', 10)
    const perKgRate = getSetting('perKgRate', 4)
    const pointRate = getSetting('pointRate', 0.5)
    const cost = baseFee + data.weightKg * perKgRate
    const pointsUsed = Math.ceil(cost / pointRate)
    await debitWallet(userId, 0, pointsUsed, 'POINT_DEDUCTION', `Points for shipment`)
    const tn = trackNum()
    const ship = await prisma.shipment.create({
      data: {
        trackingNumber: tn,
        ownerId: userId,
        origin: data.origin,
        destination: data.destination,
        description: data.description,
        weightKg: data.weightKg,
        cost,
        pointsUsed,
        events: { create: { status: 'PENDING', location: data.origin, note: 'Shipment created' } },
      },
    })
    await createInvoice(userId, [{ label: `Shipment ${tn}`, qty: 1, price: cost }], ship.id)
    await prisma.notification.create({
      data: {
        userId,
        type: 'SHIPMENT',
        title: `Shipment ${tn} created`,
        message: `Your shipment to ${data.destination} is pending confirmation.`,
        link: `/shipments/${ship.id}`,
      },
    })
    return NextResponse.json(ship, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create shipment.' }, { status: 400 })
  }
}
