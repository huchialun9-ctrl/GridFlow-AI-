
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
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-emerald-500">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                            <span className="text-[9px] font-black">WEBHOOK_ACTIVE</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-blue-500">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                            <span className="text-[9px] font-black">DIFF_ENGINE_ON</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-[10px] font-bold">RUNNING</span>
                                </td>
                            </tr>
                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all text-slate-400 opacity-60">
                                <td className="px-6 py-5 font-bold">Competitor Stock Audit</td>
                                <td className="px-6 py-5 text-[10px]">Daily @ Midnight</td>
                                <td className="px-6 py-5 text-[10px]">NO_HOOKS</td>
                                <td className="px-6 py-5 text-right">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500 rounded text-[10px] font-bold uppercase tracking-tight">Paused</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-widest mb-4">Webhook_Integration</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Target_Endpoint_URL</label>
                            <input
                                type="url"
                                placeholder="https://hooks.slack.com/services/..."
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-mono focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-800">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-400 uppercase font-black">Auto-Sync on Success</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-widest mb-4">Intelligence_Diff_Engine</h3>
                    <div className="space-y-4">
                        <p className="text-[11px] text-slate-500 font-mono leading-relaxed uppercase">Compare extraction results against previous manifests. Trigger alerts on value deviation.</p>
                        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                            <span className="text-[10px] font-mono font-black text-blue-700 dark:text-blue-400">ENABLE_DIFF_ALERTS</span>
                            <div className="w-8 h-4 bg-blue-600 rounded-full relative">
                                <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
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
