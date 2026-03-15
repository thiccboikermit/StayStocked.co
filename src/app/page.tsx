// src/app/page.tsx — StayStocked Homepage

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'StayStocked — Vacation Rentals Stocked Before You Arrive',
  description: 'Guests order groceries through their host unique link. Local stockers shop and stock the property before check-in. Hosts earn commission on every order.',
}

export default function HomePage() {
  return (
    <main className="bg-[#0a160a] text-white overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/8 bg-[#0a160a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[68px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#3a8a3a] rounded-xl flex items-center justify-center shadow-lg">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">StayStocked</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[['/', 'Home'], ['/host', 'For Hosts'], ['/stocker', 'For Stockers'], ['/extension', 'Planner']].map(([href, label]) => (
              <Link key={href} href={href} className="text-sm text-white/60 hover:text-white transition-colors">{label}</Link>
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

      {/* ── Hero — full viewport, dark green with texture ── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-[68px]">
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#3a8a3a 1px, transparent 1px), linear-gradient(90deg, #3a8a3a 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(ellipse, #3a8a3a 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#3a8a3a]/20 border border-[#3a8a3a]/40 rounded-full px-4 py-1.5 text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7dd87d] animate-pulse" />
              Now operating in select markets
            </div>
            <h1 className="text-[clamp(42px,7vw,88px)] font-black leading-[0.95] tracking-tight mb-8">
              Arrive.
              <br />
              <span className="text-[#7dd87d]">Relax.</span>
              <br />
              StayStocked.
            </h1>
            <p className="text-white/60 text-xl leading-relaxed max-w-2xl mb-12">
              Guests order exactly what they want before arriving. Local stockers shop and stock the property. Hosts earn commission on every order. No friction, no surprises.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/host/register" className="bg-[#3a8a3a] text-white font-bold px-8 py-4 rounded-2xl hover:bg-[#4aa04a] transition-all text-base shadow-xl hover:shadow-[#3a8a3a]/30 hover:shadow-2xl hover:-translate-y-0.5">
                Register as a Host
              </Link>
              <Link href="/stocker" className="border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:border-white/40 hover:bg-white/5 transition-all text-base">
                Become a Stocker
              </Link>
            </div>
          </div>

          {/* Stats floating cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {[
              { val: '2 min', label: 'Host setup time' },
              { val: '$30-40', label: 'Stocker base pay' },
              { val: '20-30%', label: 'Service fee' },
              { val: '100%', label: 'Photo verified' },
            ].map(({ val, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <div className="text-2xl font-black text-[#7dd87d] mb-1">{val}</div>
                <div className="text-white/50 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it actually works ── */}
      <section className="bg-[#0f1f0f] py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-16">
            <p className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-4">How it works</p>
            <h2 className="text-5xl font-black tracking-tight leading-tight">
              Three parties.<br/>One seamless flow.
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Host */}
            <div className="bg-[#162016] border border-[#3a8a3a]/30 rounded-3xl p-8 relative overflow-hidden group hover:border-[#3a8a3a]/60 transition-colors">
              <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full bg-[#3a8a3a] blur-3xl" />
              <div className="text-5xl font-black text-[#3a8a3a]/30 mb-6">01</div>
              <div className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-3">Host</div>
              <h3 className="text-2xl font-bold mb-4">Register and connect your calendar</h3>
              <p className="text-white/50 leading-relaxed mb-6">
                Create your property, paste in your Airbnb or VRBO iCal link, and StayStocked syncs your bookings automatically. Set your delivery windows and preferences. Share the unique guest shopping link — that is all it takes.
              </p>
              <div className="bg-[#0f1f0f] rounded-2xl p-4 border border-white/5">
                <div className="text-white/30 text-xs mb-2 uppercase tracking-wider">Your guest link</div>
                <div className="font-mono text-[#7dd87d] text-sm">staystocked.co/shop/lakeside-retreat</div>
              </div>
              <Link href="/host" className="inline-flex items-center gap-2 text-[#7dd87d] text-sm font-semibold mt-6 hover:gap-3 transition-all">
                For Hosts <span>→</span>
              </Link>
            </div>

            {/* Guest */}
            <div className="bg-[#162016] border border-[#3a8a3a]/30 rounded-3xl p-8 relative overflow-hidden group hover:border-[#3a8a3a]/60 transition-colors">
              <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full bg-[#7dd87d] blur-3xl" />
              <div className="text-5xl font-black text-[#3a8a3a]/30 mb-6">02</div>
              <div className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-3">Guest</div>
              <h3 className="text-2xl font-bold mb-4">Order through the host link</h3>
              <p className="text-white/50 leading-relaxed mb-6">
                Guests use the unique link from their host to open a personalized shopping interface. They browse by category or use the AI meal planner — entering group size, nights, meals, and preferences to generate an optimized grocery list. Approve the cart and check out.
              </p>
              <div className="bg-[#0f1f0f] rounded-2xl p-4 border border-white/5 space-y-2">
                {[['Eggs, dozen', '$6.99'], ['Chicken breasts, 2lb', '$12.99'], ['Baby spinach', '$4.49']].map(([item, price]) => (
                  <div key={item} className="flex justify-between text-sm">
                    <span className="text-white/60">{item}</span>
                    <span className="text-white/40">{price}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-semibold">
                  <span className="text-white">Total + fee</span>
                  <span className="text-[#7dd87d]">$30.17</span>
                </div>
              </div>
            </div>

            {/* Stocker */}
            <div className="bg-[#162016] border border-[#3a8a3a]/30 rounded-3xl p-8 relative overflow-hidden group hover:border-[#3a8a3a]/60 transition-colors">
              <div className="absolute top-0 right-0 w-48 h-48 opacity-5 rounded-full bg-[#3a8a3a] blur-3xl" />
              <div className="text-5xl font-black text-[#3a8a3a]/30 mb-6">03</div>
              <div className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-3">Stocker</div>
              <h3 className="text-2xl font-bold mb-4">Shop, deliver, and stock</h3>
              <p className="text-white/50 leading-relaxed mb-6">
                Stockers pick up orders from the dashboard, shop with a company-issued card, and stock the property within the scheduled delivery window — always after cleaning, before check-in. Upload photo proof. Earn $30-40 base plus distance bonuses.
              </p>
              <div className="bg-[#0f1f0f] rounded-2xl p-4 border border-white/5 space-y-1.5">
                {[['Base pay', '$35.00'], ['Distance (3 miles)', '$0.00'], ['Order total earned', '$35.00']].map(([label, val]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-white/50">{label}</span>
                    <span className="text-[#7dd87d] font-semibold">{val}</span>
                  </div>
                ))}
              </div>
              <Link href="/stocker" className="inline-flex items-center gap-2 text-[#7dd87d] text-sm font-semibold mt-6 hover:gap-3 transition-all">
                For Stockers <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── iCal integration callout ── */}
      <section className="bg-[#0a160a] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="bg-[#162016] border border-[#3a8a3a]/20 rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row gap-12 items-center">
            <div className="flex-1">
              <div className="w-14 h-14 bg-[#3a8a3a]/20 rounded-2xl flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#7dd87d" strokeWidth="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="#7dd87d" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="text-4xl font-black mb-4 tracking-tight">Works with Airbnb and VRBO — no API needed</h2>
              <p className="text-white/50 text-lg leading-relaxed">
                Paste your iCal URL from Airbnb or VRBO. StayStocked syncs your bookings every 2 hours — check-in dates, check-out times, and booking changes update automatically. Platform-agnostic and instant to set up.
              </p>
            </div>
            <div className="flex-shrink-0 bg-[#0a160a] rounded-2xl border border-white/10 p-6 w-full lg:w-80">
              <div className="text-white/30 text-xs uppercase tracking-wider mb-3">iCal sync status</div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#7dd87d] animate-pulse" />
                <span className="text-[#7dd87d] text-sm font-semibold">Synced 14 minutes ago</span>
              </div>
              {[
                { label: 'Airbnb', bookings: '3 upcoming', status: 'Connected' },
                { label: 'VRBO', bookings: '1 upcoming', status: 'Connected' },
              ].map(({ label, bookings, status }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <div className="text-white text-sm font-medium">{label}</div>
                    <div className="text-white/40 text-xs">{bookings}</div>
                  </div>
                  <span className="text-[#7dd87d] text-xs font-semibold">{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing section ── */}
      <section className="bg-[#0f1f0f] py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-16">
            <p className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-4">Pricing</p>
            <h2 className="text-5xl font-black tracking-tight leading-tight mb-4">Transparent. No surprises.</h2>
            <p className="text-white/50 text-lg max-w-2xl">
              Guests pay grocery cost plus a service fee. Stockers earn a competitive base plus distance compensation. No hidden charges.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { title: 'Essentials run', grocery: '$100', fee: '$25-30', stocker: '$30', total: '$125-130', miles: '2 miles' },
              { title: 'Family stay', grocery: '$300', fee: '$75', stocker: '$35', total: '$375', miles: '4 miles', featured: true },
              { title: 'Large group', grocery: '$500', fee: '$125', stocker: '$40', total: '$625', miles: '3 miles' },
            ].map(({ title, grocery, fee, stocker, total, miles, featured }) => (
              <div key={title} className={`rounded-3xl p-8 border ${featured ? 'bg-[#3a8a3a] border-[#4aa04a]' : 'bg-[#162016] border-[#3a8a3a]/20'}`}>
                {featured && <div className="text-[#0a160a] text-xs font-black uppercase tracking-widest mb-4">Most common</div>}
                <div className={`text-lg font-bold mb-6 ${featured ? 'text-white' : 'text-white/80'}`}>{title}</div>
                <div className="space-y-3">
                  {[['Grocery cost', grocery], ['Service fee (25%)', fee], ['Stocker pays', stocker], ['Distance', miles]].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className={featured ? 'text-white/70' : 'text-white/40'}>{label}</span>
                      <span className={featured ? 'text-white font-medium' : 'text-white/70'}>{val}</span>
                    </div>
                  ))}
                  <div className={`border-t pt-3 flex justify-between font-bold text-base ${featured ? 'border-white/20 text-white' : 'border-white/10 text-[#7dd87d]'}`}>
                    <span>Guest total</span>
                    <span>{total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-sm text-center">
            Distance beyond 5 miles adds $0.50-$1.00/mile to stocker pay, passed through transparently.
          </p>
        </div>
      </section>

      {/* ── Why StayStocked ── */}
      <section className="bg-[#0a160a] py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-16">
            <p className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-4">Why it works</p>
            <h2 className="text-5xl font-black tracking-tight leading-tight">Built for all three sides.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { who: 'Hosts', icon: '🏠', title: 'Better guest experience', body: 'Guests who arrive to a stocked kitchen leave better reviews and book again. No extra work required from the host.' },
              { who: 'Guests', icon: '🛁', title: 'Arrive and relax', body: 'No grocery run after a long flight. Everything is stocked exactly how you ordered it — verified by photo before you check in.' },
              { who: 'Stockers', icon: '💼', title: 'Competitive, transparent pay', body: '$30-40 base per order, distance bonuses, complexity bonuses for large orders. Company card covers all purchases — no out-of-pocket.' },
              { who: 'Hosts', icon: '📅', title: 'Zero setup friction', body: 'iCal sync means your booking calendar stays live automatically. No manual updates, no API approval processes.' },
              { who: 'Guests', icon: '🤖', title: 'AI meal planning', body: 'Not sure what to order? The AI planner builds a full meal plan and grocery list based on your group size, nights, and preferences.' },
              { who: 'Stockers', icon: '🧾', title: 'Clear delivery windows', body: 'Orders are only scheduled after the cleaning crew finishes and before guest check-in. No guesswork on timing.' },
            ].map(({ who, icon, title, body }) => (
              <div key={title} className="bg-[#162016] border border-white/5 rounded-2xl p-7 hover:border-[#3a8a3a]/30 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{icon}</span>
                  <span className="text-[#7dd87d]/60 text-xs font-bold uppercase tracking-wider">{who}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#3a8a3a] py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-3xl mx-auto px-6">
          <h2 className="text-5xl font-black text-white mb-5 tracking-tight">Ready to get started?</h2>
          <p className="text-white/70 text-xl mb-10">Two minutes to set up. Your first guest order could come in today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/host/register" className="bg-white text-[#1a4a1a] font-black px-8 py-4 rounded-2xl hover:bg-white/90 transition-colors text-base">
              Register as a Host
            </Link>
            <Link href="/stocker" className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl hover:border-white hover:bg-white/10 transition-all text-base">
              Become a Stocker
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#060e06] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-4 gap-10 pb-12 border-b border-white/8">
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-[#3a8a3a] rounded-lg flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                    <path d="M9 22V12h6v10" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-white font-bold">StayStocked</span>
              </Link>
              <p className="text-white/30 text-sm leading-relaxed">Vacation rentals stocked and ready before guests arrive.</p>
            </div>
            {[
              { title: 'Hosts', links: [['/', 'How It Works'], ['/host/register', 'Get Started'], ['/host', 'Dashboard']] },
              { title: 'Stockers', links: [['/stocker', 'Become a Stocker'], ['/stocker', 'Dashboard']] },
              { title: 'Product', links: [['/extension', 'Planner Extension'], ['/auth/signin', 'Sign In'], ['/terms', 'Terms'], ['/privacy', 'Privacy']] },
            ].map(({ title, links }) => (
              <div key={title}>
                <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">{title}</div>
                <ul className="space-y-2.5">
                  {links.map(([href, label]) => (
                    <li key={label}><Link href={href} className="text-white/50 text-sm hover:text-white transition-colors">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 flex items-center justify-between">
            <p className="text-white/25 text-xs">2026 StayStocked. All rights reserved.</p>
            <div className="flex gap-6">
              {[['Privacy', '/privacy'], ['Terms', '/terms']].map(([label, href]) => (
                <Link key={label} href={href} className="text-white/25 text-xs hover:text-white/50 transition-colors">{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}
