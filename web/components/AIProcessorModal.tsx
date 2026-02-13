
'use client'

import { useState } from 'react';

interface AIModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (prompt: string) => void;
    isProcessing: boolean;
}

export default function AIProcessorModal({ isOpen, onClose, onSubmit, isProcessing }: AIModalProps) {
    const [prompt, setPrompt] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompt.trim()) {
            onSubmit(prompt);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-emerald-50/30 dark:bg-emerald-900/10">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <h3 className="font-black font-mono text-xs uppercase tracking-widest text-emerald-900 dark:text-emerald-400">AI_Semantic_Processor_v1.0</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-[0.2em] block">Command_Prompt</label>
                        <textarea
                            autoFocus
                            required
                            rows={4}
                            placeholder="e.g., 'Summarize these articles into 3 main categories and add a 'sentiment' column for each headline.'"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-sans leading-relaxed resize-none"
                        />
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tight">System_Context:</p>
                        <ul className="text-[11px] text-slate-400 font-mono space-y-1">
                            <li>• [NODE] Multi-label Classification</li>
                            <li>• [NODE] Language Translation</li>
                            <li>• [NODE] Semantic Enrichment</li>
                        </ul>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold font-mono rounded-xl transition-all"
                            disabled={isProcessing}
                        >
                            CANCEL_TASK
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`flex-1 px-6 py-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs font-bold font-mono rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black dark:hover:bg-white'}`}
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin h-3 w-3 text-current" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    PROCESSING...
                                </>
                            ) : 'RUN_AI_PROTOCOL'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
