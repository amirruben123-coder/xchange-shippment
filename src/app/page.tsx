import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-bg/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 font-display font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#E8643A] flex items-center justify-content-center text-[#0B1320] font-black text-sm flex items-center justify-center">X</div>
            Xchangeshippment
          </div>
          <nav className="hidden md:flex items-center gap-7">
            {['Features','How it Works','Testimonials','FAQ'].map(l=>(
              <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} className="text-sm text-muted hover:text-white transition-colors">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-28 pb-20 text-center px-6">
        <div className="section-tag mb-5">Multi-Tenant Logistics Platform</div>
        <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.06] mb-5 max-w-4xl mx-auto">
          Empower Your<br />
          <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">
            Logistics Business
          </span>
        </h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-10">
          The ultimate platform for seamless shipment tracking, logistics management, and P2P point systems. Scale your operations with confidence.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
          <Link href="/login" className="btn btn-outline btn-lg">Sign In</Link>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 bg-panel border border-white/[0.08] rounded-2xl overflow-hidden mt-16 max-w-3xl mx-auto divide-x divide-white/[0.08]">
          {[['500+','Active Businesses'],['2M+','Packages Tracked'],['99.9%','Uptime'],['24/7','Support']].map(([n,l])=>(
            <div key={l} className="py-6 text-center">
              <div className="font-display text-3xl font-bold">{n}</div>
              <div className="text-xs text-muted mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-bg2 border-y border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-tag mb-4">Capabilities</div>
            <h2 className="font-display text-4xl font-bold mb-4">Powerful Tools for Growth</h2>
            <p className="text-muted max-w-xl mx-auto">Everything you need to manage complex delivery networks, from dispatch to final delivery.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {icon:'📍',title:'Real-time Tracking',desc:'Live status updates at every exchange hub with precise estimates.'},
              {icon:'🪙',title:'P2P Point System',desc:'Buy points, create shipments, manage wallet history and rewards.'},
              {icon:'✈️',title:'Travel Bookings',desc:'Flight and hotel reservations with automatic invoice generation.'},
              {icon:'💳',title:'Secure Payments',desc:'Stripe, Paystack, and Ercaspay — all payment methods supported.'},
              {icon:'🧾',title:'Auto Invoicing',desc:'Every transaction generates a professional invoice and receipt.'},
              {icon:'🛟',title:'24/7 Support',desc:'Tickets, live chat, and priority support around the clock.'},
            ].map(f=>(
              <div key={f.title} className="card p-6 hover:-translate-y-1 hover:border-accent/30 transition-all duration-200">
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="section-tag mb-4">The Process</div>
          <h2 className="font-display text-4xl font-bold mb-14">Get Started in Minutes</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {n:'01',t:'Create Your Account',d:'Sign up with your email. Configure your profile and preferences in minutes.'},
              {n:'02',t:'Fund Your Wallet',d:'Buy points via Stripe, Paystack, or Ercaspay. Points credited instantly.'},
              {n:'03',t:'Launch & Track',d:'Create shipments. Customers get real-time tracking links end to end.'},
            ].map(s=>(
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 rounded-full border-2 border-accent flex items-center justify-center font-display font-bold text-lg text-accent mx-auto mb-5">{s.n}</div>
                <h3 className="font-display text-lg font-semibold mb-2">{s.t}</h3>
                <p className="text-sm text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-20 bg-bg2 border-y border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-tag mb-4">Testimonials</div>
            <h2 className="font-display text-4xl font-bold">Loved by Businesses Worldwide</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {q:'"Managing multiple vendors felt chaotic. Now everything is centralized, trackable, and predictable."',n:'Head of Operations',r:'Online Marketplace',c:'from-purple-500 to-purple-700'},
              {q:'"I can see delivery updates in real time — and so can my customers. It changed our operations."',n:'Fatima R.',r:'Online Retailer',c:'from-accent to-[#E8643A]'},
              {q:'"From 10 shipments a day to hundreds — no friction, no headaches. Xchangeshippment scaled with us."',n:'Startup Lead',r:'Logistics Company',c:'from-green-500 to-emerald-700'},
              {q:'"Managing multiple courier partners used to mean five spreadsheets. Now it\'s one dashboard."',n:'Daniel A.',r:'Logistics Coordinator',c:'from-blue-500 to-blue-700'},
              {q:'"Setup took less than a day. We were tracking shipments and sharing links with customers by afternoon."',n:'Blessing K.',r:'Startup Founder',c:'from-rose-500 to-rose-700'},
              {q:'"Customers stopped calling to ask where\'s my order. The tracking link answers everything."',n:'Aisha M.',r:'E-commerce Business',c:'from-yellow-500 to-orange-600'},
            ].map((t,i)=>(
              <div key={i} className="card p-6">
                <p className="text-sm text-white/80 italic mb-5">{t.q}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.c} flex items-center justify-center font-display font-bold text-sm`}>{t.n.charAt(0)}</div>
                  <div><div className="text-sm font-semibold">{t.n}</div><div className="text-xs text-muted">{t.r}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-tag mb-4">FAQ</div>
          <h2 className="font-display text-4xl font-bold">Frequently Asked Questions</h2>
        </div>
        {[
          {q:'What is Xchangeshippment?',a:'A multi-tenant logistics platform for shipment tracking, travel bookings, wallet management, and P2P point systems.'},
          {q:'How does the point system work?',a:'Buy points using Stripe, Paystack, or Ercaspay. Use points to create shipments and pay for services. 1 point = $0.50.'},
          {q:'Can I track shipments without an account?',a:'No — you need an account to track shipments. Sign up free at the button above.'},
          {q:'What payment methods are accepted?',a:'Stripe (international card), Paystack (NGN card and bank transfer), and Ercaspay (card, bank, USSD).'},
          {q:'Is my data secure?',a:'Yes. All data encrypted in transit via HTTPS. Passwords hashed with bcrypt. Card data handled by PCI-DSS providers.'},
        ].map(f=>(
          <details key={f.q} className="border-b border-white/[0.08] group">
            <summary className="flex justify-between items-center py-5 cursor-pointer font-semibold text-sm list-none">
              {f.q}
              <span className="text-accent text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-sm text-muted pb-5">{f.a}</p>
          </details>
        ))}
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-panel2 to-panel border border-white/[0.08] rounded-3xl p-16 text-center">
          <div className="section-tag mb-5">Ready to start?</div>
          <h2 className="font-display text-4xl font-bold mb-4">Ready to revolutionize your delivery operations?</h2>
          <p className="text-muted mb-8 max-w-lg mx-auto">Join 500+ businesses managing millions of deliveries monthly on Xchangeshippment.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link href="/login" className="btn btn-outline btn-lg">Sign In</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.08] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 font-display font-bold text-lg mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-[#E8643A] flex items-center justify-center text-[#0B1320] font-black text-sm">X</div>
              Xchangeshippment
            </div>
            <p className="text-sm text-muted max-w-xs">Empowering logistics businesses with next-generation tracking solutions.</p>
          </div>
          <div className="flex gap-12">
            <div><h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Platform</h4>{['Login','Sign Up'].map(l=><Link key={l} href={`/${l.toLowerCase().replace(' ','-')}`} className="block text-sm text-white/70 hover:text-accent mb-2">{l}</Link>)}</div>
            <div><h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Contact</h4><a href="mailto:brightolisaeneh@gmail.com" className="block text-sm text-white/70 hover:text-accent mb-2">brightolisaeneh@gmail.com</a><a href="tel:09058326972" className="block text-sm text-white/70 hover:text-accent">09058326972</a></div>
            <div><h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Legal</h4><Link href="/privacy" className="block text-sm text-white/70 hover:text-accent">Privacy Policy</Link></div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/[0.08] flex justify-between text-xs text-muted">
          <span>© 2026 Xchangeshippment. All rights reserved.</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success inline-block"></span>Online</span>
        </div>
      </footer>
    </div>
  )
}
