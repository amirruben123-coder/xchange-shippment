import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, phone: true, role: true, status: true, wallet: true, points: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(users)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const body = await req.json()
  const { userId, status, creditAmount, creditPoints } = body
  if (userId === session?.user?.id) return NextResponse.json({ error: 'Cannot modify own account.' }, { status: 400 })
  if (status) {
    await prisma.user.update({ where: { id: userId }, data: { status } })
  }
  if (creditAmount > 0 || creditPoints > 0) {
    await prisma.user.update({ where: { id: userId }, data: { wallet: { increment: creditAmount || 0 }, points: { increment: creditPoints || 0 } } })
    await prisma.transaction.create({
      data: { userId, type: 'CREDIT', source: 'ADJUSTMENT', amount: creditAmount || 0, points: creditPoints || 0, balanceAfter: 0, description: 'Admin credit' },
    })
  }
  return NextResponse.json({ ok: true })
}
