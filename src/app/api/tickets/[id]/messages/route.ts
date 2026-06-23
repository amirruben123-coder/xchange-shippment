import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id as string
  const body = await req.json()
  const { message } = body
  if (!message?.trim()) return NextResponse.json({ error: 'Message required.' }, { status: 400 })
  const ticket = await prisma.ticket.findUnique({ where: { id } })
  if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const isAdmin = (session.user as any).role === 'SUPER_ADMIN'
  if (ticket.requesterId !== userId && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const msg = await prisma.ticketMessage.create({
    data: { ticketId: id, senderId: userId, body: message },
    include: { sender: { select: { name: true, role: true } } },
  })
  if (ticket.status === 'OPEN') {
    await prisma.ticket.update({ where: { id }, data: { status: 'IN_PROGRESS' } })
  }
  return NextResponse.json(msg, { status: 201 })
}
