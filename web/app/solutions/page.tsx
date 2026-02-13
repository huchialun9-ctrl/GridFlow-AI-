
import Link from "next/link";
import Image from "next/image";
import logoImg from "../../public/logo.png";

export default function Solutions() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-50 font-sans">
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-slate-200 dark:border-slate-800/50 bg-[#F8FAFC]/80 dark:bg-[#0B1120]/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-mono font-bold text-sm tracking-tight group cursor-pointer">
            <Image src="/logo.png" alt="GridFlow Logo" width={24} height={24} unoptimized className="w-6 h-6" />
            GRIDFLOW_AI
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="px-4 py-1.5 bg-slate-900 dark:bg-slate-50 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono rounded shadow-sm transition-colors border border-black/5 dark:border-white/5">
              GO_TO_CONSOLE
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-[11px] font-mono font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-6">
              Industry Specific Protocols
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6">
              Tailored Intelligence for <br /> Mission-Critical Sectors.
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              GridFlow AI provides specialized extraction pipelines optimized for the unique data structures of major industries.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* E-commerce */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Retail & E-commerce</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Monitor competitor pricing, track inventory levels in real-time, and analyze product sentiment across global marketplaces.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> SKU_Mapping_Engine
                </li>
                <li className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Dynamic_Pricing_Alerts
                </li>
              </ul>
            </div>

            {/* Finance */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all group">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Financial Services</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Aggregate market signals, news sentiment, and regulatory filings. Turn unstructured reports into quantitative data.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> SEC_Filing_Parser
                </li>
                <li className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> News_Sentiment_Analysis
                </li>
              </ul>
            </div>

            {/* Real Estate */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-500/50 transition-all group">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3">Real Estate</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Consolidate property listings across platforms. Track market trends, rental yields, and neighborhood amenities.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Yield_Calculator
                </li>
                <li className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> Listing_Deduplication
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-24 text-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-slate-900 dark:bg-slate-50 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900 font-mono text-sm font-bold rounded shadow-xl transition-all inline-flex items-center gap-2"
            >
              DEPLOY_INDUSTRY_SOLUTION
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-slate-50 dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="container mx-auto px-6 text-center text-xs font-mono text-slate-500">
          © 2026 GRIDFLOW_AI. SYSTEMS OPERATIONAL.
        </div>
      </footer>
    </div>
  );
}
