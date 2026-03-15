// src/app/extension/page.tsx — StayStocked Planner Extension

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'StayStocked Planner — AI Trip Grocery Planner Chrome Extension',
  description: 'Plan your trip groceries in seconds. AI meal plan and shopping list optimized for your group size, nights, and cooking level. Free Chrome extension.',
}

const mockCategories = [
  { cat: 'Produce', items: [['Avocados', '4'], ['Baby spinach', '1 bag'], ['Lemons', '3']] },
  { cat: 'Dairy & Eggs', items: [['Eggs', '1 dozen'], ['Greek yogurt', '2 cups']] },
  { cat: 'Meat', items: [['Chicken breasts', '2 lbs']] },
]

export default function ExtensionPage() {
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
              <Link key={href} href={href} className={`text-sm transition-colors ${href === '/extension' ? 'text-[#7dd87d] font-semibold' : 'text-white/60 hover:text-white'}`}>{label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/signin" className="hidden sm:block text-sm text-white/60 hover:text-white transition-colors">Sign In</Link>
            <a href="https://chromewebstore.google.com" className="bg-[#3a8a3a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#4aa04a] transition-colors">
              Add to Chrome
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-[68px] min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#3a8a3a 1px, transparent 1px), linear-gradient(90deg, #3a8a3a 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[500px] rounded-full opacity-10" style={{ background: 'radial-gradient(ellipse, #3a8a3a 0%, transparent 70%)' }} />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#3a8a3a]/20 border border-[#3a8a3a]/40 rounded-full px-4 py-1.5 text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-10">
                Free Chrome Extension
              </div>
              <h1 className="text-[clamp(38px,5.5vw,72px)] font-black leading-[0.95] tracking-tight mb-6">
                Trip groceries.<br/>
                <span className="text-[#7dd87d]">Planned in 30 seconds.</span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
                Tell the AI your group size, nights, and what meals you need. Get a full day-by-day meal plan and a perfectly calibrated grocery list — every ingredient accounted for.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <a href="https://chromewebstore.google.com" className="bg-[#3a8a3a] text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-[#4aa04a] transition-all shadow-xl flex items-center gap-2.5">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                  </svg>
                  Add to Chrome — Free
                </a>
                <Link href="/" className="border border-white/20 text-white font-semibold px-7 py-3.5 rounded-2xl hover:border-white/40 hover:bg-white/5 transition-all">
                  Need full service? StayStocked.co
                </Link>
              </div>
              <p className="text-white/30 text-sm">Chrome, Brave, and all Chromium browsers</p>
            </div>

            {/* Extension mockup — dark themed */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-80">
                <div className="bg-[#0f1f0f] border border-[#3a8a3a]/30 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="bg-[#3a8a3a] px-5 py-4 flex items-center gap-3">
                    <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                        <path d="M9 22V12h6v10" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-[13px] font-bold leading-none">StayStocked</div>
                      <div className="text-white/50 text-[10px] mt-0.5">Planner</div>
                    </div>
                  </div>
                  {/* Tabs */}
                  <div className="flex border-b border-white/8">
                    <div className="flex-1 text-center py-3 text-[11px] font-bold bg-[#3a8a3a]/20 text-[#7dd87d] border-b-2 border-[#7dd87d]">Groceries</div>
                    <div className="flex-1 text-center py-3 text-[11px] text-white/30">Meal Plan</div>
                  </div>
                  {/* Cost */}
                  <div className="mx-3 mt-3 bg-[#3a8a3a]/20 border border-[#3a8a3a]/30 rounded-xl px-3 py-2 text-center">
                    <span className="text-[#7dd87d] font-bold text-[12px]">Estimated total: $58-72</span>
                  </div>
                  {/* List */}
                  <div className="mx-3 mt-2.5 mb-2 border border-white/8 rounded-xl overflow-hidden">
                    {mockCategories.map(({ cat, items }) => (
                      <div key={cat}>
                        <div className="bg-[#3a8a3a]/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-[#7dd87d] border-b border-white/5">{cat}</div>
                        {items.map(([name, qty]) => (
                          <div key={name} className="flex items-center justify-between px-3 py-2 border-b border-white/5 last:border-0">
                            <span className="text-[11px] font-medium text-white/80">{name}</span>
                            <span className="text-[10px] font-bold text-[#7dd87d] bg-[#3a8a3a]/20 px-2 py-0.5 rounded-full">{qty}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                  {/* Store buttons */}
                  <div className="px-3 pb-4 mt-2">
                    <div className="text-[9px] uppercase tracking-wider text-white/30 font-semibold mb-2">Shop on</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Amazon Fresh', 'Instacart', 'Walmart'].map((name) => (
                        <div key={name} className="bg-white/5 border border-white/8 rounded-lg py-2.5 flex items-center justify-center">
                          <span className="text-[9px] font-medium text-white/50">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#0f1f0f] py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-14">
            <p className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-4">What it does</p>
            <h2 className="text-4xl font-black tracking-tight leading-tight">Everything for your trip kitchen.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🧠', title: 'AI-optimized quantities', body: 'Exact amounts for your group and nights. No overbuying. No running out mid-trip.' },
              { icon: '🍽', title: 'Full meal plan', body: 'A day-by-day plan where every meal ingredient is on your list. Nothing assumed, nothing missing.' },
              { icon: '💰', title: 'Cost estimate', body: 'See a realistic price range before you shop. No surprises at checkout.' },
              { icon: '🥦', title: 'Skip what you have', body: 'Tell us what is already in the kitchen. We skip it so you never buy duplicates.' },
              { icon: '📋', title: 'Copy and share', body: 'One tap copies your full list. Paste into a group chat, Notes, or anywhere.' },
              { icon: '🛒', title: 'Shop on your store', body: 'Tap through to Amazon Fresh, Instacart, or Walmart. Your list goes with you.' },
            ].map(({ icon, title, body }) => (
              <div key={title} className="bg-[#162016] border border-white/5 rounded-2xl p-7 hover:border-[#3a8a3a]/40 transition-colors">
                <span className="text-2xl block mb-4">{icon}</span>
                <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planner vs full service */}
      <section className="bg-[#0a160a] py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black tracking-tight mb-4">Same brand. Two ways to stay stocked.</h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              The Planner is for travelers who want to shop their own groceries. StayStocked.co is for hosts who want groceries delivered before guests arrive.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#162016] border border-white/8 rounded-3xl p-8">
              <div className="text-white/30 text-xs font-bold uppercase tracking-widest mb-5">StayStocked.co</div>
              <ul className="space-y-3">
                {['Hosts pre-stock vacation properties', 'Local stockers shop and deliver', 'Guests arrive to a stocked fridge', 'Full-service managed platform'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-white/50 text-sm">
                    <span className="text-[#3a8a3a] mt-0.5 flex-shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link href="/" className="inline-block mt-7 text-[#7dd87d] text-sm font-semibold hover:underline">
                Learn about StayStocked.co
              </Link>
            </div>
            <div className="bg-[#162016] border border-[#3a8a3a]/40 rounded-3xl p-8 relative">
              <div className="absolute -top-3 left-8">
                <span className="bg-[#3a8a3a] text-white text-xs font-black px-3 py-1 rounded-full">You are here</span>
              </div>
              <div className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-5">StayStocked Planner</div>
              <ul className="space-y-3">
                {['Plan your own trip groceries instantly', 'AI meal plan and list in seconds', 'Shop on Amazon Fresh, Instacart, Walmart', 'Free Chrome extension, no account needed'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                    <span className="text-[#7dd87d] mt-0.5 flex-shrink-0">✓</span>{item}
                  </li>
                ))}
              </ul>
              <a href="https://chromewebstore.google.com" className="inline-block mt-7 bg-[#3a8a3a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#4aa04a] transition-colors">
                Add to Chrome — Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#0f1f0f] py-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-[#7dd87d] text-xs font-bold uppercase tracking-widest mb-4">FAQ</p>
            <h2 className="text-4xl font-black tracking-tight">Common questions.</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: 'Is it free?', a: 'Yes. Free to install and use. You will need an Anthropic API key for AI-generated lists — a fraction of a cent per use — or use the built-in demo list without one.' },
              { q: 'What stores does it support?', a: 'Amazon Fresh, Instacart, and Walmart. One click routes you to your preferred store with your first item ready to search.' },
              { q: 'Does it work for non-Airbnb trips?', a: 'Yes. Cabin weekends, road trips, beach houses, family reunions — anywhere you need to stock a kitchen for a group.' },
              { q: 'What is an Anthropic API key?', a: 'A key from Anthropic (makers of Claude AI) that powers the list generation. Free to get at console.anthropic.com — each list costs under a penny.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-[#162016] border border-white/5 rounded-2xl p-6 hover:border-[#3a8a3a]/20 transition-colors">
                <h3 className="font-bold text-white mb-2">{q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#3a8a3a] py-24 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Ready for your next trip?</h2>
          <p className="text-white/70 text-lg mb-8">Free to install. Your first list in under 30 seconds.</p>
          <a href="https://chromewebstore.google.com" className="inline-flex items-center gap-2.5 bg-white text-[#1a4a1a] font-black px-8 py-4 rounded-2xl hover:bg-white/90 transition-colors text-base">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#1a4a1a" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" fill="#1a4a1a"/>
            </svg>
            Add to Chrome — Free
          </a>
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
            {[['/', 'Home'], ['/host', 'For Hosts'], ['/stocker', 'For Stockers'], ['/privacy', 'Privacy']].map(([href, label]) => (
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
