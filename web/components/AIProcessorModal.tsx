import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AIModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (prompt: string) => void;
    isProcessing: boolean;
    sampleRows: any[];
}

export default function AIProcessorModal({ isOpen, onClose, onSubmit, isProcessing, sampleRows }: AIModalProps) {
    const [prompt, setPrompt] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && sampleRows.length > 0) {
            const newSuggestions: string[] = [];
            const row = sampleRows[0];
            
            Object.keys(row).forEach(key => {
                const value = String(row[key]);
                // Detect Currency
                if (value.match(/[\$€£¥]/)) {
                    newSuggestions.push(`Convert '${key}' column to proper number format`);
                }
                // Detect Date
                if (!isNaN(Date.parse(value)) && value.length > 4 && !value.match(/^\d+$/)) {
                    newSuggestions.push(`Format '${key}' as YYYY-MM-DD`);
                }
                // Detect unclean data (newlines)
                if (value.includes('\n') || value.includes('\t')) {
                    newSuggestions.push(`Clean whitespace and newlines from '${key}'`);
                }
            });
            
            if (newSuggestions.length === 0) {
                 newSuggestions.push("Summarize this dataset");
                 newSuggestions.push("Translate all text to English");
            }
            
            setSuggestions(newSuggestions.slice(0, 3));
        }
    }, [isOpen, sampleRows]);

    const handleSuggestionClick = (suggestion: string) => {
        setPrompt(prev => prev ? `${prev}\n${suggestion}` : suggestion);
    };

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
                        <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-400">AI Semantic Processor</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Smart Suggestions & Enrichment */}
                    <div className="space-y-4">
                        {suggestions.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-wide">
                                    <Sparkles className="w-3 h-3" />
                                    Smart Suggestions
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => handleSuggestionClick(s)}
                                            className="text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center gap-1"
                                        >
                                            {s}
                                            <ArrowRight className="w-3 h-3 opacity-50" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                             <div className="flex items-center gap-2 text-[10px] font-bold text-pink-500 uppercase tracking-wide">
                                <span className="flex h-2 w-2 rounded-full bg-pink-500"></span>
                                Enrichment Tools
                             </div>
                             <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleSuggestionClick("Analyze the sentiment of the text. Add 'sentiment_score' (0-1) and 'sentiment_label' (Positive/Negative) columns.")}
                                    className="text-xs bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 px-3 py-1.5 rounded-lg border border-pink-100 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors flex items-center gap-1"
                                >
                                    ❤️ Sentiment Analysis
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleSuggestionClick("Identify named entities (Person, Org, Location). Add an 'entities' column with a comma-separated list.")}
                                    className="text-xs bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 px-3 py-1.5 rounded-lg border border-pink-100 dark:border-pink-800 hover:bg-pink-100 dark:hover:bg-pink-900/40 transition-colors flex items-center gap-1"
                                >
                                    🏢 Entity Extraction (NER)
                                </button>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 block">Command Prompt</label>
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
                            className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-xl transition-all"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`flex-1 px-6 py-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-sm font-bold rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black dark:hover:bg-white'}`}
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="animate-spin h-3 w-3 text-current" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Processing...
                                </>
                            ) : 'Run AI Analysis'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
