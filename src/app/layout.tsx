import type { Metadata } from 'next'
import './globals.css'
import NextAuthProvider from '@/components/layout/SessionProvider'

export const metadata: Metadata = {
  title: 'Xchangeshippment — Empower Your Logistics Business',
  description: 'The ultimate platform for seamless shipment tracking, logistics management, and P2P point systems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning><NextAuthProvider>{children}</NextAuthProvider></body>
    </html>
  )
}
