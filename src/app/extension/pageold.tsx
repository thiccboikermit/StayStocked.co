import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'StayStocked Planner — AI Trip Grocery Planner',
  description: 'Plan your trip groceries in seconds. AI-generated meal plan and shopping list optimized for your group size, nights, and cooking level. Free Chrome extension.',
}

const features = [
  { icon: '🧠', title: 'AI-optimized quantities', body: 'Exact amounts for your group and trip length. No overbuying. No running out mid-trip.' },
  { icon: '🍽', title: 'Full meal plan', body: 'A day-by-day plan where every meal ingredient is on your list. Nothing assumed, nothing missing.' },
  { icon: '💰', title: 'Cost estimate', body: 'See a realistic price range before you shop. No surprises at checkout.' },
  { icon: '🥦', title: 'Skip what you have', body: 'Tell us what is already in the kitchen. We skip it so you never buy duplicates.' },
  { icon: '📋', title: 'Copy and share', body: 'One tap copies your full list. Paste into a group chat, Notes, or anywhere.' },
  { icon: '🛒', title: 'Shop instantly', body: 'Tap through to Amazon Fresh, Instacart, or Walmart. Your list goes with you.' },
]

const mockCategories = [
  { cat: 'Produce', items: [['Avocados', '4'], ['Baby spinach', '1 bag'], ['Lemons', '3']] },
  { cat: 'Dairy & Eggs', items: [['Eggs', '1 dozen'], ['Greek yogurt', '2 cups']] },
  { cat: 'Meat', items: [['Chicken breasts', '2 lbs']] },
]

export default function ExtensionPage() {
  return (
    <main className="bg-white text-gray-900 overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-800 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M9 22V12h6v10" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-[15px]">StayStocked</span>
            <span className="hidden sm:block text-xs font-medium bg-green-50 text-green-800 border border-green-200 rounded-full px-2.5 py-0.5">Planner</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="hidden sm:block text-sm text-gray-500 hover:text-green-800 transition-colors">
              Main site
            </Link>
            <a href="#how-it-works" className="hidden md:block text-sm text-gray-500 hover:text-green-800 transition-colors">
              How it works
            </a>
            <a
              href="https://chromewebstore.google.com"
              className="bg-green-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add to Chrome
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero — full bleed with split layout ── */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-white" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-green-800 hidden lg:block" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">

            {/* Left — copy */}
            <div className="lg:py-24">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-semibold rounded-full px-3 py-1 mb-8 border border-green-200">
                Free Chrome Extension
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.08] mb-6 tracking-tight">
                Your trip<br/>groceries,<br/>
                <span className="text-green-700">planned in<br/>seconds.</span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-md">
                Tell the AI your trip details. Get a full meal plan and grocery list calibrated for your exact group, nights, and cooking level. Zero waste. No guesswork.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://chromewebstore.google.com"
                  className="inline-flex items-center gap-2.5 bg-green-800 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-green-700 transition-colors text-[15px]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="4" fill="white"/>
                  </svg>
                  Add to Chrome — Free
                </a>
                <a href="#how-it-works" className="inline-flex items-center gap-2 text-gray-600 font-medium px-6 py-3.5 rounded-xl border border-gray-200 hover:border-green-300 hover:text-green-800 transition-all text-[15px]">
                  See how it works
                </a>
              </div>
              <p className="mt-6 text-xs text-gray-400">Works with Chrome, Brave, and all Chromium browsers</p>
            </div>

            {/* Right — extension mockup on green bg */}
            <div className="lg:bg-green-800 lg:h-full flex items-center justify-center lg:-mr-12 lg:pr-12 lg:pl-12 rounded-2xl lg:rounded-none">
              <div className="w-full max-w-xs">
                {/* Extension window chrome */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  {/* Header bar */}
                  <div className="bg-green-800 px-4 py-3.5 flex items-center gap-3">
                    <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                        <path d="M9 22V12h6v10" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white text-[13px] font-semibold leading-none">StayStocked</div>
                      <div className="text-white/50 text-[10px] mt-0.5">Trip grocery planner</div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b border-gray-100 bg-gray-50">
                    <div className="flex-1 text-center py-2.5 text-[11px] font-semibold bg-green-800 text-white">Groceries</div>
                    <div className="flex-1 text-center py-2.5 text-[11px] font-medium text-gray-400">Meal Plan</div>
                  </div>

                  {/* Cost banner */}
                  <div className="mx-3 mt-3 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-center">
                    <span className="text-green-800 font-semibold text-[12px]">Estimated total: $58-72</span>
                  </div>

                  {/* List */}
                  <div className="mx-3 mt-2.5 mb-2 border border-gray-100 rounded-xl overflow-hidden">
                    {mockCategories.map(({ cat, items }) => (
                      <div key={cat}>
                        <div className="bg-green-50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-green-700 border-b border-gray-100">{cat}</div>
                        {items.map(([name, qty]) => (
                          <div key={name} className="flex items-center justify-between px-3 py-2 border-b border-gray-50 last:border-0">
                            <span className="text-[11px] font-medium text-gray-800">{name}</span>
                            <span className="text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{qty}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Share button */}
                  <div className="mx-3 mb-3">
                    <button className="w-full text-[11px] font-medium text-gray-500 border border-gray-200 rounded-lg py-2 hover:border-green-300 hover:text-green-700 transition-colors">
                      Copy list
                    </button>
                  </div>

                  {/* Store buttons */}
                  <div className="px-3 pb-3.5">
                    <div className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">Shop on</div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[['Amazon Fresh'], ['Instacart'], ['Walmart']].map(([name]) => (
                        <div key={name} className="bg-gray-50 border border-gray-100 rounded-lg py-2.5 flex flex-col items-center gap-1">
                          <span className="text-[9px] font-medium text-gray-600">{name}</span>
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

      {/* ── Stats bar ── */}
      <section className="bg-green-800 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: '30 sec', label: 'to your first list' },
              { val: 'Zero', label: 'wasted food' },
              { val: '3 stores', label: 'to shop from' },
              { val: 'Free', label: 'to install' },
            ].map(({ val, label }) => (
              <div key={label}>
                <div className="text-white text-3xl font-bold mb-1">{val}</div>
                <div className="text-green-300 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="max-w-xl mb-16">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-4">How it works</p>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">Three steps to a stocked kitchen</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden">
            {[
              { num: '01', title: 'Set your trip details', body: 'Nights, people, meals, cooking level, dietary needs. Add what you already have to avoid buying it twice.' },
              { num: '02', title: 'Get your plan', body: 'The AI returns a day-by-day meal plan and a calibrated grocery list in seconds. Every ingredient accounted for.' },
              { num: '03', title: 'Shop your way', body: 'Copy the list for your group, or click straight to your store. One tap, done.' },
            ].map(({ num, title, body }) => (
              <div key={num} className="bg-white p-10">
                <div className="text-6xl font-bold text-green-100 leading-none mb-6">{num}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features — alternating full-bleed rows ── */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
          <div className="max-w-xl mb-16">
            <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-4">Features</p>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">Everything you need. Nothing you do not.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all group">
                <div className="text-3xl mb-5">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 text-base mb-2 group-hover:text-green-800 transition-colors">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison — full bleed dark ── */}
      <section className="bg-green-900 py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Same family. Different purpose.</h2>
            <p className="text-green-300 text-lg max-w-2xl mx-auto leading-relaxed">
              StayStocked.co is full-service — hosts stock properties, local stockers deliver. The Planner is self-serve — plan and shop your own trip groceries, any time, any browser.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-green-400 text-xs font-bold uppercase tracking-widest mb-6">StayStocked.co</div>
              <ul className="space-y-4">
                {['Hosts pre-stock vacation properties', 'Local vetted stockers shop and deliver', 'Guests arrive to a fully stocked fridge', 'Full-service managed platform'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                    <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/" className="inline-block mt-8 text-green-400 text-sm font-medium hover:text-white transition-colors">
                Learn more at StayStocked.co
              </Link>
            </div>
            <div className="bg-white border border-white/20 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-8">
                <span className="bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-full">You are here</span>
              </div>
              <div className="text-green-700 text-xs font-bold uppercase tracking-widest mb-6">StayStocked Planner</div>
              <ul className="space-y-4">
                {['Plan your own trip groceries instantly', 'AI meal plan and list in seconds', 'Shop on Amazon Fresh, Instacart, Walmart', 'Free Chrome extension, no account needed'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-gray-700 text-sm">
                    <span className="text-green-700 mt-0.5 flex-shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://chromewebstore.google.com"
                className="inline-block mt-8 bg-green-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                Add to Chrome — Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-4">FAQ</p>
              <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-6">Common questions</h2>
              <p className="text-gray-500 leading-relaxed">
                Anything else? Reach out via StayStocked.co.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { q: 'Is it free?', a: 'Yes. Free to install and use. You will need an Anthropic API key for AI-generated lists — a fraction of a cent per use — or try the built-in demo list without one.' },
                { q: 'What stores does it support?', a: 'Amazon Fresh, Instacart, and Walmart. One click routes you to your preferred store.' },
                { q: 'Does it work for non-Airbnb trips?', a: 'Yes. Cabin weekends, road trips, beach houses, family reunions — anywhere you need to stock a kitchen for a group.' },
                { q: 'What is an Anthropic API key?', a: 'A key from Anthropic (makers of Claude AI) that powers the list generation. Free to get at console.anthropic.com — each list costs under a penny.' },
                { q: 'How is this different from StayStocked.co?', a: 'StayStocked.co delivers groceries to rental properties through local stockers. This extension lets you plan and buy your own groceries, yourself, from any device.' },
              ].map(({ q, a }) => (
                <div key={q} className="border border-gray-100 rounded-xl p-6 hover:border-green-200 transition-colors">
                  <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA — full bleed ── */}
      <section className="relative overflow-hidden bg-green-800 py-28 text-center">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 left-16 text-9xl">🥗</div>
          <div className="absolute top-12 right-24 text-9xl">🍳</div>
          <div className="absolute bottom-8 left-1/3 text-9xl">🛒</div>
        </div>
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-white mb-5 leading-tight">
            Ready for your next trip?
          </h2>
          <p className="text-green-300 text-lg mb-10">
            Free to install. Your first list in under 30 seconds.
          </p>
          <a
            href="https://chromewebstore.google.com"
            className="inline-flex items-center gap-3 bg-white text-green-900 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors text-base shadow-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#166534" strokeWidth="2"/>
              <circle cx="12" cy="12" r="4" fill="#166534"/>
            </svg>
            Add to Chrome — Free
          </a>
          <p className="mt-5 text-green-400 text-sm">Chrome, Brave, and all Chromium browsers</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 bg-green-700 rounded-lg flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                    <path d="M9 22V12h6v10" stroke="white" strokeWidth="2.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-white font-semibold text-sm">StayStocked</span>
              </Link>
              <p className="text-gray-500 text-xs">2026 StayStocked. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              <Link href="/host" className="text-gray-400 hover:text-white transition-colors">For Hosts</Link>
              <Link href="/stocker" className="text-gray-400 hover:text-white transition-colors">Become a Stocker</Link>
              <a href="https://chromewebstore.google.com" className="text-green-400 hover:text-white transition-colors font-medium">Get Planner Extension</a>
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}
