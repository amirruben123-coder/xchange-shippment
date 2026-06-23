'use server'
import { prisma } from '@/lib/prisma'
import { invoiceNum, receiptNum } from '@/lib/utils'

export async function creditWallet(
  userId: string,
  amount: number,
  points: number,
  source: string,
  description: string
) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.update({
      where: { id: userId },
      data: {
        wallet: { increment: amount },
        points: { increment: points },
      },
    })
    await tx.transaction.create({
      data: {
        userId,
        type: 'CREDIT',
        source: source as any,
        amount,
        points,
        balanceAfter: Number(user.wallet),
        description,
      },
    })
    await tx.notification.create({
      data: {
        userId,
        type: 'WALLET',
        title: 'Wallet credited',
        message: `$${amount.toFixed(2)} and ${points} points added to your account.`,
      },
    })
    return user
  })
}

export async function debitWallet(
  userId: string,
  amount: number,
  points: number,
  source: string,
  description: string
) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User not found')
    if (Number(user.wallet) < amount) throw new Error('Insufficient wallet balance')
    if (user.points < points) throw new Error('Insufficient points')
    const updated = await tx.user.update({
      where: { id: userId },
      data: {
        wallet: { decrement: amount },
        points: { decrement: points },
      },
    })
    await tx.transaction.create({
      data: {
        userId,
        type: 'DEBIT',
        source: source as any,
        amount,
        points,
        balanceAfter: Number(updated.wallet),
        description,
      },
    })
    return updated
  })
}

export async function createInvoice(
  userId: string,
  items: { label: string; qty: number; price: number }[],
  shipmentId?: string,
  bookingId?: string
) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const inv = await prisma.invoice.create({
    data: {
      number: invoiceNum(),
      userId,
      shipmentId,
      bookingId,
      status: 'PAID',
      subtotal,
      tax: 0,
      total: subtotal,
      paidAt: new Date(),
      items: { create: items },
    },
  })
  await prisma.receipt.create({
    data: {
      number: receiptNum(),
      invoiceId: inv.id,
      amount: subtotal,
      method: 'WALLET',
    },
  })
  return inv
}
