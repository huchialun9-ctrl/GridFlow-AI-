
import Link from "next/link";
import Image from "next/image";

export default function Security() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-50 font-sans">
      <header className="fixed top-0 w-full border-b border-slate-200 dark:border-slate-800/50 bg-[#F8FAFC]/80 dark:bg-[#0B1120]/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-mono font-bold text-sm tracking-tight group cursor-pointer">
            <Image src="/logo.png" alt="GridFlow Logo" width={24} height={24} className="w-6 h-6" />
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
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="mb-16">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-6">
                    Security & Trust Center
                  </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-6">
                    Enterprise-Grade Security <br/> by Design.
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl">
                    We process sensitive data with the highest standards of encryption, compliance, and access control. 
                </p>
            </div>

            <div className="space-y-12">
                {/* Section 1 */}
                <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Infrastructure Security</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        GridFlow AI is deployed on <strong className="text-slate-900 dark:text-slate-200">Railway</strong> and <strong className="text-slate-900 dark:text-slate-200">Vercel</strong>, utilizing ISO 27001 and SOC 2 Type II compliant data centers. All data in transit is encrypted via TLS 1.3, and data at rest is encrypted using AES-256.
                    </p>
                    <div className="flex gap-4">
                         <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded text-xs font-mono">TLS 1.3</div>
                         <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded text-xs font-mono">AES-256</div>
                    </div>
                </div>

                 {/* Section 2 */}
                <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Authentication & Access</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        We prioritize secure identity management through **GitHub OAuth**. We do not store passwords. Access to the platform is strictly controlled via automated Row Level Security (RLS) policies within our Supabase database layer.
                    </p>
                     <div className="flex gap-4">
                         <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded text-xs font-mono">OAuth 2.0</div>
                         <div className="px-3 py-1 bg-slate-100 dark:bg-slate-900 rounded text-xs font-mono">Row Level Security</div>
                    </div>
                </div>

                 {/* Section 3 */}
                <div className="border-l-2 border-slate-200 dark:border-slate-800 pl-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">Data Privacy</h2>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        Data extracted via GridFlow AI belongs to you. We do not sell, trade, or analyze your proprietary datasets. Our automatic PII masking engine ensures compliance with GDPR and CCPA regulations when processing public web data.
                    </p>
                </div>
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
