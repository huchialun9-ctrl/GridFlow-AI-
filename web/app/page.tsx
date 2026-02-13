import Link from "next/link";
import Image from "next/image";
import { createClient } from "../lib/supabaseServer";
import HeroAnimation from "@/components/HeroAnimation";
import LogosSection from "@/components/LogosSection";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-50 font-sans selection:bg-slate-900 selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-slate-200 dark:border-slate-800/50 bg-[#F8FAFC]/80 dark:bg-[#0B1120]/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 font-mono font-bold text-sm tracking-tight group cursor-pointer">
            <Image src="/logo.png" alt="GridFlow Logo" width={24} height={24} className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
            GRIDFLOW_AI
          </div>
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium font-mono text-slate-500 dark:text-slate-400">
            <Link href="#features" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors uppercase tracking-wider">Features</Link>
            <Link href="#integrations" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors uppercase tracking-wider">Ecosystem</Link>
            <Link href="https://github.com/huchialun9-ctrl/GridFlow-AI-" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors uppercase tracking-wider">GitHub</Link>
          </nav>
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="text-xs font-medium font-mono text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 uppercase tracking-wider"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-1.5 bg-slate-900 dark:bg-slate-50 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono rounded shadow-sm transition-colors border border-black/5 dark:border-white/5"
                >
                  GET_STARTED
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="px-4 py-1.5 bg-slate-900 dark:bg-slate-50 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono rounded shadow-sm transition-colors border border-black/5 dark:border-white/5"
              >
                GO_TO_CONSOLE
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24 md:pt-32">
        {/* Hero Section */}
        <section className="px-6 border-b border-slate-200/60 dark:border-slate-800/60 pb-20 overflow-hidden">
          <div className="container mx-auto max-w-5xl relative">
            <div className="flex flex-col items-start gap-6 max-w-3xl z-10 relative">
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                v1.0.2 Stable // System Online
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 dark:text-slate-50 leading-[1.1]">
                The Browser Native <br />
                Data Extractor.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed font-light">
                Programmatic capture for the modern web.
                Turn any DOM structure into structured datasets directly from your browser.
                <span className="font-mono text-sm bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded mx-1 align-middle">Local-First</span>
                architecture with enterprise-grade security.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full sm:w-auto">
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-slate-50 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900 font-mono text-sm font-bold rounded flex items-center justify-center gap-2 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  LAUNCH_CONSOLE
                </Link>
                <Link
                  href="https://github.com/huchialun9-ctrl/GridFlow-AI-"
                  className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-sm font-medium rounded hover:bg-slate-50 dark:hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  VIEW_SOURCE
                </Link>
              </div>
            </div>

            {/* Technical Visualization: Data Flow Animation */}
            <div className="mt-20">
              <HeroAnimation />
            </div>
          </div>
        </section>

        {/* Ecosystem Integrations Section */}
        <section id="integrations" className="py-24 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-[10px] font-mono font-medium text-slate-500 mb-4 uppercase tracking-widest">
                Native Ecosystem Connectivity
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4 tracking-tight">
                Your Data. Where You Need It.
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Seamlessly sync extracted datasets to your favorite platforms with verified schema mapping.
              </p>
            </div>

            {/* Pipeline Animation */}
            <div className="relative h-32 mb-20 hidden md:flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-slate-200 dark:bg-slate-800"></div>

              {/* Left: Web Node */}
              <div className="absolute left-10 w-12 h-12 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center z-10 shadow-sm">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              </div>

              {/* Middle: GridFlow Processor */}
              <div className="w-16 h-16 bg-slate-900 dark:bg-slate-50 rounded-xl flex items-center justify-center z-10 shadow-xl relative group">
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <svg className="w-8 h-8 text-white dark:text-slate-900 animate-[spin_3s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
              </div>

              {/* Right: Destinations */}
              <div className="absolute right-10 flex gap-4">
                <div className="w-10 h-10 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-center z-10 text-emerald-600 shadow-sm"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14.07 14.53H14.12C14.12 14.53 14.12 14.52 14.07 14.53ZM6.75 4.5H13.5V9H18V19.5H6.75V4.5ZM13.5 4.5L18 9ZM9 12V14.25H9.75V12H9ZM9 15.75V18H9.75V15.75H9ZM11.25 12V14.25H12.75V12H11.25ZM11.25 15.75V18H12.75V15.75H11.25ZM14.25 12V14.25H15.75V12H14.25ZM6 21H18.75V8.25H12.75V2.25H6V21Z" /></svg></div>
                <div className="w-10 h-10 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded flex items-center justify-center z-10 text-slate-800 dark:text-slate-200 shadow-sm"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v2H4V4zm0 4h16v2H4V8zm0 4h16v2H4v-2zm0 4h16v2H4v-2z" /></svg></div>
              </div>

              {/* Flow Particles */}
              <div className="absolute inset-x-20 h-0.5 bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-0 animate-[shimmer_2s_infinite]"></div>
            </div>

            {/* Integrations Grid - Dynamic Component */}
            <LogosSection />
          </div>
        </section>

        {/* Technical Features */}
        <section id="features" className="py-24 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <div className="group">
                <div className="w-10 h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded flex items-center justify-center mb-6 text-slate-900 dark:text-slate-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                </div>
                <h3 className="text-lg font-bold font-mono text-slate-900 dark:text-slate-50 mb-3 group-hover:text-blue-600 transition-colors">DOM_Traversal_Engine</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Proprietary heuristic engine that accurately identifies tabular data structures, including nested <code>div</code> grids and ARIA-role based tables.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group">
                <div className="w-10 h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded flex items-center justify-center mb-6 text-slate-900 dark:text-slate-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-lg font-bold font-mono text-slate-900 dark:text-slate-50 mb-3 group-hover:text-emerald-600 transition-colors">Local_Runtime_Env</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Execution occurs 100% client-side within the browser sandbox. No extracted data is transmitted to external servers unless explicitly synced via API.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group">
                <div className="w-10 h-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded flex items-center justify-center mb-6 text-slate-900 dark:text-slate-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                </div>
                <h3 className="text-lg font-bold font-mono text-slate-900 dark:text-slate-50 mb-3 group-hover:text-purple-600 transition-colors">Schema_Normalization</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Advanced pre-processing pipeline including Type Inference, PII Masking/Redaction, and automated deduplication before export.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#F8FAFC] dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs font-mono text-slate-500">
            © 2026 GRIDFLOW_AI. SYSTEMS OPERATIONAL.
          </div>

          <div className="flex gap-6">
            <Link href="#" className="flex items-center gap-2 text-xs font-mono font-medium text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Status: All Systems Normal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
