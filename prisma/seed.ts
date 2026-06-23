import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  const adminHash = await bcrypt.hash('Admin@2024!', 12)
  const demoHash = await bcrypt.hash('Demo@2024!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'brightolisaeneh@gmail.com' },
    update: {},
    create: {
      name: 'Bright Olisaeneh',
      email: 'brightolisaeneh@gmail.com',
      phone: '09058326972',
      role: 'SUPER_ADMIN',
      passwordHash: adminHash,
      wallet: 5000,
      points: 10000,
    },
  })

  const demo = await prisma.user.upsert({
    where: { email: 'demo@xchangeshippment.com' },
    update: {},
    create: {
      name: 'Demo Customer',
      email: 'demo@xchangeshippment.com',
      phone: '08012345678',
      role: 'CUSTOMER',
      passwordHash: demoHash,
      wallet: 284.50,
      points: 1240,
    },
  })

  // Demo shipment
  const ship = await prisma.shipment.upsert({
    where: { trackingNumber: 'XS-48217' },
    update: {},
    create: {
      trackingNumber: 'XS-48217',
      ownerId: demo.id,
      origin: 'Vendor Warehouse, Lagos, NG',
      destination: '123 Main St, Houston, TX, USA',
      description: 'Electronics parcel',
      weightKg: 2.5,
      status: 'IN_TRANSIT',
      cost: 45,
      pointsUsed: 90,
    },
  })

  if (ship) {
    await prisma.shipmentEvent.createMany({
      skipDuplicates: true,
      data: [
        { shipmentId: ship.id, status: 'PENDING', location: 'Lagos, NG', note: 'Shipment created' },
        { shipmentId: ship.id, status: 'CONFIRMED', location: 'Lagos, NG', note: 'Payment confirmed' },
        { shipmentId: ship.id, status: 'PICKED_UP', location: 'Vendor Warehouse', note: 'Package collected' },
        { shipmentId: ship.id, status: 'IN_TRANSIT', location: 'Exchange Hub A, Abuja', note: 'In transit' },
      ],
    })
  }

  // Demo transaction
  await prisma.transaction.create({
    data: {
      userId: demo.id,
      type: 'CREDIT',
      source: 'POINT_PURCHASE',
      amount: 120,
      points: 240,
      balanceAfter: 284.50,
      description: 'Growth package via Stripe',
    },
  })

  // Welcome notification
  await prisma.notification.create({
    data: {
      userId: demo.id,
      type: 'SYSTEM',
      title: 'Welcome to Xchangeshippment!',
      message: 'Your account is ready. Buy points to create your first shipment.',
    },
  })

  console.log('✅ Seed complete')
  console.log('   Admin:', admin.email, '/ Admin@2024!')
  console.log('   Demo: ', demo.email, '/ Demo@2024!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
