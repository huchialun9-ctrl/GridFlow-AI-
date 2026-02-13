export default function SystemStatus() {
    return (
        <div className="fixed bottom-0 right-0 p-4 z-50 pointer-events-none">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-full py-1.5 px-4 shadow-lg flex items-center gap-4 pointer-events-auto">
                <div className="flex items-center gap-1.5">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">Railway_Operational</span>
                </div>
                <div className="w-px h-3 bg-slate-300 dark:bg-slate-700"></div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">DB_Latency: 45ms</span>
                </div>
            </div>
        </div>
    );
}
