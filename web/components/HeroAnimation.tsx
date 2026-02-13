'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function HeroAnimation() {
    return (
        <div className="relative w-full h-[300px] md:h-[400px] bg-slate-50 dark:bg-[#0B1120] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <div className="relative z-10 flex items-center gap-8 md:gap-16 scale-75 md:scale-100">
                {/* Source Node: Website */}
                <div className="relative group">
                    <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center relative z-20">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                        <div className="absolute -bottom-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Unstructured</div>
                    </div>
                </div>

                {/* Connection Line 1 */}
                <div className="w-24 h-[2px] bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500 w-1/2 animate-[shimmer_1.5s_infinite] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>

                {/* Processor Node: GridFlow */}
                <div className="relative">
                    <div className="w-24 h-24 bg-slate-900 dark:bg-slate-50 rounded-2xl shadow-2xl shadow-blue-500/20 flex items-center justify-center z-20 relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                        <svg className="w-10 h-10 text-white dark:text-slate-900 animate-[spin_4s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    </div>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-slate-900 dark:text-slate-50 uppercase tracking-widest whitespace-nowrap">GRIDFLOW_ENGINE</div>
                </div>

                {/* Connection Line 2 */}
                <div className="w-24 h-[2px] bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 bg-emerald-500 w-1/2 animate-[shimmer_1.5s_infinite_0.5s] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>

                {/* Dest Node: Apps */}
                <div className="relative group">
                    <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center relative z-20">
                        <div className="grid grid-cols-2 gap-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                             <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                             <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                             <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                        </div>
                        <div className="absolute -bottom-6 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Structured</div>
                    </div>
                    
                    {/* Floating Particles/Docs */}
                    <div className="absolute -right-4 -top-4 w-6 h-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm animate-bounce text-[6px] p-1 flex flex-col gap-1">
                        <div className="w-full h-0.5 bg-slate-200"></div>
                        <div className="w-full h-0.5 bg-slate-200"></div>
                    </div>
                </div>
            </div>

            {/* Code Overlay */}
            <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur text-slate-400 text-[10px] font-mono p-3 rounded-lg border border-slate-800 shadow-xl max-w-[200px] hidden md:block">
                <div className="flex gap-2 mb-2 border-b border-slate-800 pb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-1">
                    <div className="text-emerald-400">await flow.extract(DOM);</div>
                    <div>{'->'} identifying_tables...</div>
                    <div>{'->'} mapping_schema...</div>
                    <div className="text-blue-400">{'->'} sync_to_cloud();</div>
                </div>
            </div>
        </div>
    );
}
