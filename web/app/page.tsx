import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="text-blue-600">GridFlow</span> AI
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Link href="#features" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Pricing</Link>
            <Link href="https://github.com/huchialun9-ctrl/GridFlow-AI-" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">GitHub</Link>
          </nav>
          <Link
            href="#"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Add to Chrome
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4 border-b border-slate-100 dark:border-slate-900">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 border border-blue-100 dark:border-blue-800">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              v1.0 Available Now
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6">
              Extract Web Data to Excel <br className="hidden md:block" />
              <span className="text-slate-400">in Seconds, Not Hours.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The privacy-first Chrome Extension that turns websites into structured data. No coding required. AI-powered column recognition coming soon.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#"
                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download for Chrome
              </Link>
              <Link
                href="#demo"
                className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                View Demo
              </Link>
            </div>

            {/* Visual Placeholder for Extension Screenshot */}
            <div className="mt-16 p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              <div className="aspect-video bg-white dark:bg-slate-950 rounded-xl flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <p className="font-mono text-sm">[ Screenshot of GridFlow AI Sidepanel ]</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">Why GridFlow?</h2>
              <p className="text-slate-500 max-w-xl mx-auto">Built for analysts, marketers, and developers who need clean data fast.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Extraction</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Automatically detects tables and lists. Supports CSS Grid and complex layouts that other scrapers miss.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Local processing only. Your data never leaves your browser. Includes built-in PII masking for safety.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI-Ready</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Waitlist open for Gemini 1.5 integration. Semantic column naming and auto-cleaning coming soon.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-slate-500">
            © 2026 GridFlow AI. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">Twitter</Link>
            <Link href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
