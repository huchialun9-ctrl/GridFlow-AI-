'use client';

import { Sparkles, Layout, Database, Zap, FileText, Presentation, ShieldCheck, Globe } from 'lucide-react';

export default function InnovationShowcase() {
    return (
        <section id="innovations" className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-6 max-w-6xl relative">
                <div className="text-center mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                        Strategic_Evolution_v2.0
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                        Strategic Innovations
                    </h2>
                    <p className="text-slate-500 max-w-2xl mx-auto font-light leading-relaxed text-lg">
                        Bridging the gap between raw web data and executive decision-making through semantic intelligence and cloud persistence.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Innovation 1: AI Auto-Layout Engine */}
                    <div className="group p-8 md:p-12 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Presentation className="w-32 h-32 text-blue-500" />
                        </div>
                        
                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Sparkles className="w-7 h-7" />
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">AI Semantic Auto-Layout Engine</h3>
                                <p className="text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-4">From_Data_to_Executive_Insight</p>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                                    Transforms unstructured crawl payloads into presentation-ready <strong>PPTX</strong> and <strong>DOCX</strong> reports. 
                                    Powered by Gemini 1.5 semantic analysis to summarize, categorize, and format data into business-standard layouts.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                                        <FileText className="w-3 h-3 text-blue-500" /> 3-Line Tables
                                    </div>
                                    <p className="text-[10px] text-slate-500">Auto-formatted academic & business table standards.</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                                        <Layout className="w-3 h-3 text-blue-500" /> Auto-Slides
                                    </div>
                                    <p className="text-[10px] text-slate-500">Instant slide generation from complex datasets.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Innovation 2: Enterprise Data Hub */}
                    <div className="group p-8 md:p-12 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Database className="w-32 h-32 text-emerald-500" />
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Enterprise Data Hub & No-Code API</h3>
                                <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-widest mb-4">Secure_Cloud_Persistence_v1.0</p>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                                    Centralizes fragmented local files into a secure, audit-ready cloud vault. 
                                    Extends datasets via <strong>No-Code dynamic API endpoints</strong> supporting <code>sk_live_</code> authentication for seamless integration with Notion, G-Sheets, and Airtable.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                                        <Zap className="w-3 h-3 text-emerald-500" /> Rapid Connect
                                    </div>
                                    <p className="text-[10px] text-slate-500">Cross-platform sync with Sub-100ms latency.</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-xs font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
                                        <Globe className="w-3 h-3 text-emerald-500" /> RLS Security
                                    </div>
                                    <p className="text-[10px] text-slate-500">Row-Level Identity isolation for corporate privacy.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Business Blueprint Banner */}
                <div className="mt-12 p-8 rounded-3xl bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="text-[10px] font-mono font-bold text-blue-400 dark:text-blue-600 uppercase tracking-widest">Global_Strategic_Vision</div>
                        <h4 className="text-xl md:text-2xl font-bold tracking-tight">Evolving from a Tool to an AI Digital Assistant</h4>
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-light">Building a subscription-based DaaS ecosystem for Education and Consulting industries.</p>
                    </div>
                    <a 
                        href="/docs#roadmap" 
                        className="px-8 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl font-bold whitespace-nowrap hover:scale-105 transition-all shadow-xl shadow-black/20"
                    >
                        Learn More about v3.0 Roadmap
                    </a>
                </div>
            </div>
        </section>
    );
}
