
'use client'

export default function Automation() {
    return (
        <div className="space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">Automation_Schedules</h1>
                <p className="text-sm text-slate-500 font-mono mt-1">Status // 2 Active Cron Jobs</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-bold tracking-widest">Workflow_Name</th>
                                <th className="px-6 py-4 font-bold tracking-widest">Frequency</th>
                                <th className="px-6 py-4 font-bold tracking-widest">Next_Execution</th>
                                <th className="px-6 py-4 font-bold tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                                <td className="px-6 py-5 font-bold text-slate-900 dark:text-slate-50">E-commerce Price Monitor</td>
                                <td className="px-6 py-5 text-slate-500">Every 4 Hours</td>
                                <td className="px-6 py-5 text-slate-400">Feb 13, 16:00</td>
                                <td className="px-6 py-5 text-right">
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-[10px] font-bold">ACTIVE</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all text-slate-400 opacity-60">
                                <td className="px-6 py-5 font-bold">Competitor Stock Audit</td>
                                <td className="px-6 py-5 text-[10px]">Daily @ Midnight</td>
                                <td className="px-6 py-5 text-[10px]">Feb 14, 00:00</td>
                                <td className="px-6 py-5 text-right">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 rounded text-[10px] font-bold uppercase tracking-tight">Paused</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Create_New_Automation</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">Deploy robots to scan websites on a repetitive cycle.</p>
                </div>
                <button className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold font-mono rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none">INITIALIZE_CRON</button>
            </div>
        </div>
    );
}
