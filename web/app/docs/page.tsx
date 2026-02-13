'use client';

import Link from 'next/link';
import { ChevronLeft, Github, Book, Terminal, Shield, Cpu, Database, Cloud } from 'lucide-react';

export default function Docs() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900/40">
            {/* Header */}
            <header className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-4 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-6">
                        <a href="https://github.com/huchialun9-ctrl/GridFlow-AI-" target="_blank" className="text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-20 max-w-4xl">
                {/* Intro Section */}
                <div className="mb-20 space-y-6">
                    <div className="flex items-center gap-2 text-emerald-600 font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
                        <Book className="w-3 h-3" />
                        Technical_Documentation_v1.0
                    </div>
                    <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">GridFlow AI Architecture</h1>
                    <p className="text-xl text-slate-500 font-light leading-relaxed">
                        GridFlow AI is an enterprise-grade data operations platform designed for automated web extraction, semantic enrichment, and secure managed delivery.
                    </p>
                </div>

                {/* Core Architecture */}
                <section className="mb-24">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-10 flex items-center gap-3">
                        <Cpu className="w-6 h-6 text-blue-500" />
                        Technology Stack
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8 font-mono">
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Frontend_Core</h3>
                            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                <li>• Next.js 15 (App Router)</li>
                                <li>• TypeScript</li>
                                <li>• TailwindCSS (Custom Tokens)</li>
                                <li>• Framer Motion (Animations)</li>
                            </ul>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 tracking-widest">Backend_&_Compute</h3>
                            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                <li>• Supabase (Realtime DB & Auth)</li>
                                <li>• Google Gemini 1.5 Flash (AI Processor)</li>
                                <li>• Railway (Edge Engine Hosting)</li>
                                <li>• Vercel (Frontend Deployment)</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Data Flow */}
                <section className="mb-24 space-y-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-3">
                        <Database className="w-6 h-6 text-emerald-500" />
                        Managed Data Lifecycle
                    </h2>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                            GridFlow AI follows a strict **Managed Export** architecture to ensure data auditability and security for enterprise users.
                        </p>
                        <div className="my-10 bg-slate-900 rounded-2xl p-8 border border-slate-800 font-mono text-[11px] leading-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-2 right-4 text-slate-700 font-black">STREAMS</div>
                            <div className="text-emerald-500">{`[PROTOCOL] INITIALIZING_EXTRACTION...`}</div>
                            <div className="text-slate-300">{`1. DOM_TRAVERSAL_ENGINE => IDENTIFYING_PATTERNS`}</div>
                            <div className="text-slate-300">{`2. SEMANTIC_REFINEMENT => CALLING_GEMINI_API_V1.5`}</div>
                            <div className="text-slate-300">{`3. SUPABASE_STORAGE => UPLOADING_ENCRYPTED_ASSET`}</div>
                            <div className="text-slate-300">{`4. DATABASE_AUDIT => LOGGING_EXPORT_EVENT`}</div>
                            <div className="text-emerald-500">{`[SUCCESS] CLOUD_ASSET_READY_FOR_SYNC`}</div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg- emerald-500 animate-pulse"></div>
                        </div>
                    </div>
                </section>

                {/* Strategic Innovations Deep Dive */}
                <section id="innovations" className="mb-24 space-y-16">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                            <Sparkles className="w-8 h-8 text-blue-500" />
                            AI Semantic Auto-Layout
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                            GridFlow AI solves the "last mile" problem of data extraction. Instead of raw spreadsheets, users receive executive-ready documents.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                <h4 className="font-bold text-sm mb-2 text-slate-900 dark:text-slate-50">Report Pre-processing</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Gemini 1.5 Flash analyzes extracted rows to identify trends, key-performance indicators (KPIs), and sentiment, automatically generating high-level summaries for the document header.
                                </p>
                            </div>
                            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                <h4 className="font-bold text-sm mb-2 text-slate-900 dark:text-slate-50">Generator Engine</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Integrates <code>pptxgenjs</code> and <code>docx</code> libraries to map JSON data into strictly formatted professional templates, including academic "3-line tables" and brand-aligned slide masters.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                            <Shield className="w-8 h-8 text-emerald-500" />
                            Enterprise Data Hub
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                            A centralized cloud infrastructure that transforms local data into manageable corporate assets.
                        </p>
                        <ul className="space-y-6 mt-8">
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 text-emerald-600 font-mono text-xs">01</div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-50">Security Infrastructure</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Leverages Supabase <strong>Row Level Security (RLS)</strong> to provide cryptographic identity isolation, ensuring one user's data is never visible to another, even within the same database engine.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 text-emerald-600 font-mono text-xs">02</div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-50">No-Code API Interface</h4>
                                    <p className="text-sm text-slate-500 leading-relaxed">Exposes dynamic endpoints via <code>sk_live_...</code> secure tokens. This allows non-technical users to pipe web-scraped data directly into Zapier, Notion, or internal dashboards without writing a single line of Python/Node.js.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Developer Bio */}
                <section className="pt-20 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-900 dark:bg-slate-50 rounded-2xl flex items-center justify-center text-white dark:text-slate-900 font-bold text-xl italic">
                            HKL
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50">Hu Chia-lun 胡家綸</h4>
                            <p className="text-sm text-slate-500 font-light mt-1">Lead Architect of GridFlow AI</p>
                        </div>
                    </div>
                    <p className="mt-8 text-slate-600 dark:text-slate-400 italic font-serif leading-relaxed">
                        "GridFlow AI was born from the need to transform unstructured web chaos into structured enterprise knowledge with transparency and integrity."
                    </p>
                </section>

                {/* CTAs */}
                <div className="mt-24 text-center space-y-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Ready to extend the protocol?</h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a 
                            href="https://github.com/huchialun9-ctrl/GridFlow-AI-" 
                            target="_blank"
                            className="px-8 py-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                        >
                            Open GitHub Repository
                        </a>
                        <Link 
                            href="/solutions" 
                            className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                        >
                            View Industry Solutions
                        </Link>
                    </div>
                </div>
            </main>

            {/* Simple Footer Docs */}
            <footer className="py-12 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                <div className="container mx-auto px-6 text-center text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    Documentation Lifecycle_2026 // GRIDFLOW_AI_CORE
                </div>
            </footer>
        </div>
    );
}
