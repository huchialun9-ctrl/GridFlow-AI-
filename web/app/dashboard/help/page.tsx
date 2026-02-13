'use client';

import { useState } from 'react';
import AIHelpDesk from '@/components/AIHelpDesk';
import { ChevronDown, ChevronUp, Book, Server, Shield } from 'lucide-react';

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const faqs = [
        {
            q: "How do I extract data from a website?",
            a: "Navigate to the 'Overview' page and click 'Initialize Extraction'. Enter the URL of the website you want to scrape. Our AI engine will automatically identify tables and lists."
        },
        {
            q: "What is the difference between Free and Pro plans?",
            a: "Free plans are limited to 10,000 rows per month and 512MB of storage. Pro plans offer unlimited rows, priority processing, API access, and team collaboration features."
        },
        {
            q: "How do I use the API?",
            a: "Go to the 'Developers' section to generate an API Key. You can then use this key to authenticate requests to our REST API endpoints. Full documentation is available in the API section."
        },
        {
            q: "Is my data secure?",
            a: "Yes. All extracted data is encrypted at rest and in transit. We strictly adhere to privacy regulations and do not share your data with third parties."
        }
    ];

    return (
        <div className="font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto space-y-12">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight flex items-center gap-3">
                    <Book className="w-8 h-8 text-blue-600" />
                    Documentation & Support
                </h1>
                <p className="text-sm text-slate-500 font-mono mt-1">
                    Knowledge Base // Troubleshooting // System Status
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-8">
                    {/* Quick Start */}
                    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
                            <Server className="w-5 h-5 text-emerald-500" />
                            Quick Start Guide
                        </h2>
                        <div className="space-y-6 relative">
                            <div className="absolute left-3.5 top-2 bottom-2 w-px bg-slate-100 dark:bg-slate-800"></div>
                            
                            <div className="relative pl-10">
                                <span className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold flex items-center justify-center border border-blue-100 dark:border-blue-900">1</span>
                                <h3 className="font-bold text-slate-900 dark:text-slate-50">Initialize Extraction</h3>
                                <p className="text-sm text-slate-500 mt-1">Click the "Initialize Extraction" button on the dashboard and imput your target URL.</p>
                            </div>
                            <div className="relative pl-10">
                                <span className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold flex items-center justify-center border border-blue-100 dark:border-blue-900">2</span>
                                <h3 className="font-bold text-slate-900 dark:text-slate-50">Review Data</h3>
                                <p className="text-sm text-slate-500 mt-1">The AI will parse the page. Review the extracted table in the preview modal.</p>
                            </div>
                            <div className="relative pl-10">
                                <span className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold flex items-center justify-center border border-blue-100 dark:border-blue-900">3</span>
                                <h3 className="font-bold text-slate-900 dark:text-slate-50">Export or Sync</h3>
                                <p className="text-sm text-slate-500 mt-1">Download as CSV/Excel or use the Integrations Hub to sync with Zapier or Airtable.</p>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
                    <section>
                         <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-6 flex items-center gap-2">
                             <Shield className="w-5 h-5 text-indigo-500" />
                             Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                                    <button 
                                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <span className="font-bold text-sm text-slate-900 dark:text-slate-50">{faq.q}</span>
                                        {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                                    </button>
                                    {openFaq === i && (
                                        <div className="px-6 pb-4 pt-0 text-sm text-slate-500 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                            <div className="pt-4">{faq.a}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Support */}
                <div className="space-y-6">
                    <AIHelpDesk />

                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 p-6">
                        <h3 className="text-xs font-bold font-mono text-blue-900 dark:text-blue-100 uppercase tracking-widest mb-2">System_Status</h3>
                        <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                             <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
                        </div>
                        <p className="text-[10px] text-blue-600 dark:text-blue-300 font-mono">
                            Latest check: {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
