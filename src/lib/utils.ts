export const fmtMoney = (n: number | string) =>
  '$' + Number(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const fmtDateTime = (d: Date | string) =>
  new Date(d).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

export const trackNum = () =>
  'XS-' + Math.floor(10000000 + Math.random() * 89999999)

export const invoiceNum = () =>
  'INV-' + Date.now().toString().slice(-8)

export const receiptNum = () =>
  'RCT-' + Date.now().toString().slice(-8)

export const ticketNum = () =>
  'TCK-' + Date.now().toString().slice(-6)

export const STATUS_BADGE: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  CONFIRMED: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  PICKED_UP: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  IN_TRANSIT: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  AT_EXCHANGE_HUB: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  OUT_FOR_DELIVERY: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  DELIVERED: 'bg-green-500/10 text-green-400 border border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border border-red-500/20',
  RETURNED: 'bg-red-500/10 text-red-400 border border-red-500/20',
  OPEN: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  IN_PROGRESS: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
  RESOLVED: 'bg-green-500/10 text-green-400 border border-green-500/20',
  CLOSED: 'bg-white/5 text-white/40 border border-white/10',
  PAID: 'bg-green-500/10 text-green-400 border border-green-500/20',
  DRAFT: 'bg-white/5 text-white/40 border border-white/10',
  ACTIVE: 'bg-green-500/10 text-green-400 border border-green-500/20',
  SUSPENDED: 'bg-red-500/10 text-red-400 border border-red-500/20',
  SUPER_ADMIN: 'bg-red-500/10 text-red-400 border border-red-500/20',
  CUSTOMER: 'bg-white/5 text-white/40 border border-white/10',
}
