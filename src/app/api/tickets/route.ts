import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ticketNum } from '@/lib/utils'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id as string
  const isAdmin = (session.user as any).role === 'SUPER_ADMIN'
  const tickets = await prisma.ticket.findMany({
    where: isAdmin ? {} : { requesterId: userId },
    include: {
      requester: { select: { name: true, email: true } },
      messages: { include: { sender: { select: { name: true, role: true } } }, orderBy: { createdAt: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(tickets)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id as string
  const body = await req.json()
  const { subject, category, priority, message } = body
  if (!subject || !message) return NextResponse.json({ error: 'Subject and message are required.' }, { status: 400 })
  const ticket = await prisma.ticket.create({
    data: {
      number: ticketNum(),
      requesterId: userId,
      subject,
      category: category || 'General',
      priority: priority || 'MEDIUM',
      messages: { create: { senderId: userId, body: message } },
    },
    include: { messages: { include: { sender: { select: { name: true, role: true } } } } },
  })
  await prisma.notification.create({
    data: { userId, type: 'TICKET', title: `Ticket ${ticket.number} opened`, message: 'Our support team will respond shortly.' },
  })
  return NextResponse.json(ticket, { status: 201 })
}
