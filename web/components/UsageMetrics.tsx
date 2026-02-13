export default function UsageMetrics() {
    return (
        <div className="hidden md:flex items-center gap-6 px-4">
             <div className="flex flex-col items-end">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Monthly Rows</div>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[12%] rounded-full"></div>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">1,240 / 10k</span>
                </div>
             </div>
             
             <div className="h-8 w-px bg-slate-100 dark:bg-slate-800"></div>

             <div className="flex flex-col items-end">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Storage</div>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-purple-500 w-[45%] rounded-full"></div>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">450MB / 1GB</span>
                </div>
             </div>
        </div>
    );
}
