// src/app/stocker/page.tsx — For Stockers

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Become a Stocker — Earn $30-40 Per Order with StayStocked',
  description: 'Flexible gig work. Shop groceries, stock vacation rentals, earn $30-40 base per order plus distance bonuses. Background checked, company card provided.',
}

export default function StockerPage() {
  return (
    <main className="bg-[#0a160a] text-white overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#0a160a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#3a8a3a] rounded-xl flex items-center justify-center">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white font-bold text-lg">StayStocked</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[['/', 'Home'], ['/host', 'For Hosts'], ['/stocker', 'For Stockers'], ['/extension', 'Planner']].map(([href, label]) => (
              <Link key={href} href={href} className={`text-sm transition-colors ${href === '/stocker' ? 'text-[#7dd87d] font-semibold' : 'text-white/60 hover:text-white'}`}>{label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors">Sign In</Link>
            <Link href="/host/register" className="bg-[#3a8a3a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#4aa04a] transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-[68px] min-h-[75vh] flex items-center">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#3a8a3a 1px, transparent 1px), linear-gradient(90deg, #3a8a3a 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#3a8a3a]/20 border border-[#3a8a3a]/40 rounded-full px-4 py-1.5 text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-8">
                For Stockers
              </div>
              <h1 className="text-[clamp(38px,5.5vw,72px)] font-black leading-[0.95] tracking-tight mb-6">
                Shop. Stock.<br/>
                <span className="text-[#7dd87d]">Get paid well.</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Earn $30-40 base per order shopping groceries and stocking vacation rentals. Company card covers all purchases. Flexible schedule, clear delivery windows, competitive pay.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/auth/signin" className="bg-[#3a8a3a] text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-[#4aa04a] transition-all shadow-xl">
                  Apply to Become a Stocker
                </Link>
              </div>
              {/* Pay highlights */}
              <div className="grid grid-cols-3 gap-4">
                {[['$30-40', 'Base per order'], ['$0.50-1/mi', 'Distance bonus'], ['$5-10', 'Large order bonus']].map(([val, label]) => (
                  <div key={label} className="bg-[#162016] border border-white/8 rounded-xl p-4">
                    <div className="text-[#7dd87d] font-black text-lg mb-0.5">{val}</div>
                    <div className="text-white/40 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order card mockup */}
            <div className="space-y-4">
              <div className="bg-[#0f1f0f] border border-[#3a8a3a]/30 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-white font-bold">Order #2847</div>
                    <div className="text-white/40 text-sm mt-0.5">Lakeside Cabin — Mar 18, 2pm delivery</div>
                  </div>
                  <span className="bg-[#3a8a3a]/20 text-[#7dd87d] text-xs font-bold px-3 py-1 rounded-full border border-[#3a8a3a]/30">Available</span>
                </div>
                <div className="space-y-2 mb-5">
                  {[['28 items', 'Grocery list'], ['Whole Foods', 'Preferred store'], ['3.2 miles', 'Store to property'], ['2:00-4:00pm', 'Delivery window']].map(([val, label]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-white/40">{label}</span>
                      <span className="text-white font-medium">{val}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#3a8a3a]/10 border border-[#3a8a3a]/20 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-white/60 text-sm">Your earnings</span>
                  <span className="text-[#7dd87d] text-xl font-black">$35.00</span>
                </div>
                <button className="w-full mt-4 bg-[#3a8a3a] text-white font-bold py-3 rounded-xl hover:bg-[#4aa04a] transition-colors">
                  Accept Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How stocking works */}
      <section className="bg-[#0f1f0f] py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-16">
            <p className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-4">The process</p>
            <h2 className="text-4xl font-black tracking-tight">How each order works.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden">
            {[
              { num: '1', icon: '📱', title: 'Pick up order', body: 'Browse available orders on the dashboard. See the property, grocery list, and your pay before accepting.' },
              { num: '2', icon: '🛒', title: 'Shop the list', body: 'Use your own card to shop — you are reimbursed per order through the platform once delivery is confirmed.' },
              { num: '3', icon: '🏠', title: 'Stock the property', body: 'Arrive in the delivery window. Stock the fridge and pantry neatly following the host instructions.' },
              { num: '4', icon: '📸', title: 'Upload photos and done', body: 'Take a completion photo through the app. Guest and host are notified. Pay is processed.' },
            ].map(({ num, icon, title, body }) => (
              <div key={num} className="bg-[#0a160a] p-8">
                <div className="text-3xl mb-4">{icon}</div>
                <div className="text-[#7dd87d]/50 text-xs font-bold uppercase tracking-widest mb-2">Step {num}</div>
                <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pay model */}
      <section className="bg-[#0a160a] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-14">
            <p className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-4">Pay model</p>
            <h2 className="text-4xl font-black tracking-tight">Clear, fair, competitive.</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-[#162016] border border-[#3a8a3a]/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Pay structure</h3>
              <div className="space-y-4">
                {[
                  { label: 'Base pay (up to 2 hrs)', val: '$30-40', note: 'Shopping, delivery, and stocking' },
                  { label: 'Distance bonus', val: '$0.50-1.00/mi', note: 'Per mile beyond 5-mile base radius' },
                  { label: 'Large order bonus', val: '$5-10', note: 'Orders over 50 items or bulky loads' },
                ].map(({ label, val, note }) => (
                  <div key={label} className="flex items-start justify-between gap-4 pb-4 border-b border-white/5 last:border-0">
                    <div>
                      <div className="text-white text-sm font-semibold">{label}</div>
                      <div className="text-white/30 text-xs mt-0.5">{note}</div>
                    </div>
                    <div className="text-[#7dd87d] font-black text-sm flex-shrink-0">{val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#162016] border border-[#3a8a3a]/20 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Example orders</h3>
              <div className="space-y-4">
                {[
                  { label: 'Small order, 2 miles', items: '18 items', earned: '$30.00' },
                  { label: 'Medium order, 8 miles', items: '32 items', earned: '$38.00' },
                  { label: 'Large order, 12 miles', items: '55 items', earned: '$57.00' },
                ].map(({ label, items, earned }) => (
                  <div key={label} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0">
                    <div>
                      <div className="text-white text-sm font-semibold">{label}</div>
                      <div className="text-white/30 text-xs mt-0.5">{items}</div>
                    </div>
                    <div className="text-[#7dd87d] font-black">{earned}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-[#162016] border border-white/5 rounded-2xl p-6 text-center">
            <p className="text-white/50 text-sm">
              You are reimbursed for grocery costs per order. Background check required. Flexible schedule — you set your own availability.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#3a8a3a] py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Start earning this week.</h2>
          <p className="text-white/70 text-lg mb-8">Apply takes 5 minutes. Background check processed within 48 hours.</p>
          <Link href="/auth/signin" className="inline-block bg-white text-[#1a4a1a] font-black px-8 py-4 rounded-2xl hover:bg-white/90 transition-colors text-base">
            Apply to Become a Stocker
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060e06] pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#3a8a3a] rounded-lg flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white font-bold text-sm">StayStocked</span>
          </Link>
          <div className="flex gap-6 text-sm">
            {[['/', 'Home'], ['/host', 'For Hosts'], ['/extension', 'Planner'], ['/privacy', 'Privacy']].map(([href, label]) => (
              <Link key={label} href={href} className="text-white/40 hover:text-white transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-6">
          <p className="text-white/20 text-xs">2026 StayStocked. All rights reserved.</p>
        </div>
      </footer>

    </main>
  )
}
