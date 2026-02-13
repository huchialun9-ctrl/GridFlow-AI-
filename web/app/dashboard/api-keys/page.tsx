
'use client'

import { useState } from 'react';

export default function ApiKeys() {
    const [apiKey, setApiKey] = useState('gf_live_xxxxxxxxxxxxxxxxxxxxxxxx');
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className="space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">API_Access_Config</h1>
                <p className="text-sm text-slate-500 font-mono mt-1">Status // Node Access Authorized</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-widest mb-4">Production_Secret_Key</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-600 dark:text-slate-400 flex items-center justify-between">
                            <span>{isVisible ? apiKey : 'gf_live_••••••••••••••••••••••••••••'}</span>
                            <button onClick={() => setIsVisible(!isVisible)} className="text-blue-600 hover:text-blue-700">
                                {isVisible ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>
                        <button 
                            onClick={() => navigator.clipboard.writeText(apiKey)}
                            className="px-6 py-3 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-xs font-bold font-mono rounded-xl hover:bg-black dark:hover:bg-white transition-all shadow-lg"
                        >
                            COPY_KEY
                        </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-4 uppercase">Caution: Never share your production keys. They provide full read/write terminal access to your nodes.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 shadow-xl font-mono">
                    <h3 className="text-white text-xs font-bold uppercase mb-4 tracking-widest">Code_Integration_Example (Node.js)</h3>
                    <pre className="text-[11px] leading-relaxed overflow-x-auto">
{`const client = new GridFlowClient({
  apiKey: "YOUR_SECRET_KEY"
});

// Extract data from URL
const data = await client.extract({
  url: "https://example.com",
  depth: 2
});`}
                    </pre>
                </div>
                
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h2 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-widest mb-4">API_Rate_Limits</h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
                                <span>Requests / Minute</span>
                                <span>60 / 100</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[60%]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] font-bold font-mono text-slate-500 uppercase mb-1">
                                <span>Monthly Quota</span>
                                <span>15,400 / 50,000</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[30.8%]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
