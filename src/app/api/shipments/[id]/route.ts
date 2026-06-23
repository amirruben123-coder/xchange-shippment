import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const ship = await prisma.shipment.findUnique({
    where: { id },
    include: { events: { orderBy: { createdAt: 'asc' } }, owner: { select: { name: true, email: true } } },
  })
  if (!ship) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(ship)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { status, location, note } = body
  const ship = await prisma.shipment.findUnique({ where: { id } })
  if (!ship) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const userId = session.user.id as string
  const isAdmin = (session.user as any).role === 'SUPER_ADMIN'
  if (ship.ownerId !== userId && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const updated = await prisma.shipment.update({
    where: { id },
    data: {
      status,
      deliveredAt: status === 'DELIVERED' ? new Date() : undefined,
      events: { create: { status, location, note } },
    },
    include: { events: { orderBy: { createdAt: 'asc' } } },
  })
  await prisma.notification.create({
    data: {
      userId: ship.ownerId,
      type: 'SHIPMENT',
      title: `Shipment ${ship.trackingNumber} updated`,
      message: `Status changed to ${status.replace(/_/g, ' ')}.`,
      link: `/shipments/${ship.id}`,
    },
  })
  return NextResponse.json(updated)
}
