// src/app/host/page.tsx — For Hosts

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'StayStocked for Hosts — Earn Commission, Delight Guests',
  description: 'Connect your Airbnb or VRBO calendar in 2 minutes. Generate a unique guest shopping link. Earn commission on every grocery order placed for your property.',
}

export default function HostPage() {
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
              <Link key={href} href={href} className={`text-sm transition-colors ${href === '/host' ? 'text-[#7dd87d] font-semibold' : 'text-white/60 hover:text-white'}`}>{label}</Link>
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
      <section className="relative pt-[68px] min-h-[70vh] flex items-center">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#3a8a3a 1px, transparent 1px), linear-gradient(90deg, #3a8a3a 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#3a8a3a]/20 border border-[#3a8a3a]/40 rounded-full px-4 py-1.5 text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-8">
                For Hosts
              </div>
              <h1 className="text-[clamp(38px,5.5vw,72px)] font-black leading-[0.95] tracking-tight mb-6">
                Your guests arrive<br/>
                <span className="text-[#7dd87d]">to a stocked kitchen.</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Connect your Airbnb or VRBO calendar. Share the unique guest link. Earn commission on every order. Takes 2 minutes to set up — zero ongoing effort.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/host/register" className="bg-[#3a8a3a] text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-[#4aa04a] transition-all shadow-xl">
                  Register Your Property
                </Link>
                <Link href="/auth/signin" className="border border-white/20 text-white font-semibold px-7 py-3.5 rounded-2xl hover:border-white/40 hover:bg-white/5 transition-all">
                  Sign In
                </Link>
              </div>
            </div>

            {/* Host dashboard preview */}
            <div className="bg-[#0f1f0f] rounded-3xl border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold">Property Dashboard</span>
                <span className="text-[#7dd87d] text-xs font-bold bg-[#3a8a3a]/20 px-3 py-1 rounded-full">3 active bookings</span>
              </div>
              {[
                { name: 'Lakeside Cabin', checkin: 'Mar 18', status: 'Order placed', amount: '$247' },
                { name: 'Downtown Loft', checkin: 'Mar 21', status: 'Awaiting order', amount: '—' },
                { name: 'Lakeside Cabin', checkin: 'Mar 28', status: 'Synced from iCal', amount: '—' },
              ].map(({ name, checkin, status, amount }) => (
                <div key={checkin} className="bg-[#162016] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-semibold">{name}</div>
                    <div className="text-white/40 text-xs mt-0.5">Check-in {checkin}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#7dd87d] text-sm font-semibold">{amount}</div>
                    <div className="text-white/40 text-xs mt-0.5">{status}</div>
                  </div>
                </div>
              ))}
              <div className="bg-[#3a8a3a]/10 border border-[#3a8a3a]/20 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-white/60 text-sm">Guest orders this month</span>
                <span className="text-[#7dd87d] text-lg font-black">4 completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup steps */}
      <section className="bg-[#0f1f0f] py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-16">
            <p className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-4">Setup</p>
            <h2 className="text-4xl font-black tracking-tight">Up and running in 2 minutes.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-px bg-white/5 rounded-3xl overflow-hidden">
            {[
              { num: '1', title: 'Register', body: 'Create your host account. Add your property name, address, and kitchen details.' },
              { num: '2', title: 'Sync calendar', body: 'Paste your Airbnb or VRBO iCal URL. Bookings sync automatically every 2 hours.' },
              { num: '3', title: 'Configure', body: 'Set delivery windows, any restrictions, and your preferred local stores.' },
              { num: '4', title: 'Share link', body: 'Copy your unique guest shopping link and send it to guests in your welcome message.' },
            ].map(({ num, title, body }) => (
              <div key={num} className="bg-[#0a160a] p-8">
                <div className="w-10 h-10 rounded-xl bg-[#3a8a3a]/20 border border-[#3a8a3a]/30 text-[#7dd87d] font-black text-lg flex items-center justify-center mb-5">{num}</div>
                <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host benefits */}
      <section className="bg-[#0a160a] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-14">
            <h2 className="text-4xl font-black tracking-tight">What hosts get.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '⭐', title: 'Higher ratings, more bookings', body: 'Guests who arrive to stocked kitchens consistently leave better reviews. Better reviews mean higher occupancy and rates.' },
              { icon: '⭐', title: 'Better guest reviews', body: 'Guests who arrive to stocked kitchens consistently leave higher ratings. StayStocked guests spend more time relaxing, less time shopping.' },
              { icon: '📅', title: 'Automatic calendar sync', body: 'iCal integration keeps your booking calendar live without any manual work. Cancellations and changes update automatically.' },
              { icon: '⚙️', title: 'Full delivery control', body: 'You set the delivery window, any product restrictions, and storage instructions. Stockers follow your preferences exactly.' },
              { icon: '📸', title: 'Photo verification', body: 'Every order is photographed after stocking. You can see exactly what was delivered and how it was arranged.' },
              { icon: '🔗', title: 'One link per property', body: 'Each property gets a unique URL. Share it in your welcome message, Airbnb guidebook, or anywhere you communicate with guests.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="bg-[#162016] border border-white/5 rounded-2xl p-7 hover:border-[#3a8a3a]/30 transition-colors">
                <span className="text-2xl mb-4 block">{icon}</span>
                <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#3a8a3a] py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Add your first property today.</h2>
          <p className="text-white/70 text-lg mb-8">Free to register. Free to register. Your guests arrive to a stocked kitchen.</p>
          <Link href="/host/register" className="inline-block bg-white text-[#1a4a1a] font-black px-8 py-4 rounded-2xl hover:bg-white/90 transition-colors text-base">
            Register as a Host
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
            {[['/', 'Home'], ['/stocker', 'For Stockers'], ['/extension', 'Planner'], ['/privacy', 'Privacy'], ['/terms', 'Terms']].map(([href, label]) => (
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
