import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const exists = await prisma.user.findUnique({ where: { email: data.email } })
    if (exists) return NextResponse.json({ error: 'Email already registered.' }, { status: 409 })
    const passwordHash = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, phone: data.phone, passwordHash, role: 'CUSTOMER' },
    })
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'SYSTEM',
        title: 'Welcome to Xchangeshippment!',
        message: 'Your account is ready. Buy points to create your first shipment.',
      },
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Registration failed.' }, { status: 400 })
  }
}
