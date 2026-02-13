
'use client'

import { useState } from 'react';

interface ExtractionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (url: string, mode: string) => void;
    initialMode?: 'excel' | 'word' | 'ppt';
}

export default function ExtractionModal({ isOpen, onClose, onSubmit, initialMode = 'excel' }: ExtractionModalProps) {
    const [url, setUrl] = useState('');
    const [mode, setMode] = useState(initialMode);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url) {
            onSubmit(url, mode);
            setUrl('');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-black font-mono text-sm uppercase tracking-widest text-slate-900 dark:text-slate-50">Initialize_New_Extraction</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Processing_Mode</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['excel', 'word', 'ppt'].map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMode(m as any)}
                                    className={`py-2 text-[10px] font-black uppercase rounded-lg border transition-all ${
                                        mode === m 
                                        ? 'bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 border-transparent shadow-md' 
                                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                                    }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Source_Origin_URL</label>
                        <input
                            autoFocus
                            type="url"
                            required
                            placeholder="https://example.com/products"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                        />
                    </div>
                    
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                        <div className="flex gap-3">
                            <div className="flex-shrink-0 text-blue-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <p className="text-[11px] text-blue-700 dark:text-blue-400 font-medium leading-relaxed uppercase font-mono">
                                System will deploy active nodes to parse the specified manifest using <span className="font-black underline">{mode.toUpperCase()}</span> protocol.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold font-mono rounded-lg transition-all"
                        >
                            ABORT_COMMAND
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2.5 bg-slate-900 dark:bg-slate-50 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono rounded-lg transition-all shadow-lg shadow-slate-200 dark:shadow-none"
                        >
                            EXECUTE_{mode.toUpperCase()}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
