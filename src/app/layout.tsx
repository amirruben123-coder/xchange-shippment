import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Xchangeshippment — Empower Your Logistics Business',
  description: 'The ultimate platform for seamless shipment tracking, logistics management, and P2P point systems.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
