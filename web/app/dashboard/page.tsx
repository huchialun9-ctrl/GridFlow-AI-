
import Link from 'next/link';

export default function Dashboard() {
    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">DASHBOARD</h1>
                    <p className="text-sm text-slate-500 font-mono mt-1">OVERVIEW // <span className="text-emerald-600">SYSTEM_ONLINE</span></p>
                </div>
                <Link
                    href="#"
                    className="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-slate-50 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono rounded shadow-sm transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    NEW_TASK
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2">Total Rows Extracted</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">12,450</p>
                        <span className="text-xs font-mono text-emerald-600 font-medium">▲ 12%</span>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2">Active Sessions</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">5</p>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2">Storage Usage</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">45 MB</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 mt-4">
                        <div className="bg-slate-900 dark:bg-slate-50 h-1" style={{ width: '15%' }}></div>
                    </div>
                </div>
            </div>

            {/* Recent Data Table */}
            <div className="bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-wider">Recent Extractions</h2>
                    <button className="text-xs font-mono text-slate-500 hover:text-slate-900 dark:hover:text-slate-300">VIEW_ALL</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3 font-medium">Source</th>
                                <th className="px-6 py-3 font-medium">URL</th>
                                <th className="px-6 py-3 font-medium">Rows</th>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {/* Mock Data Row 1 */}
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Amazon_Products</td>
                                <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">amazon.com/s?k=laptop</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">450</td>
                                <td className="px-6 py-4 text-slate-500">10:42 AM</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
                                        Completed
                                    </span>
                                </td>
                            </tr>
                            {/* Mock Data Row 2 */}
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">LinkedIn_Leads</td>
                                <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">linkedin.com/search</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">1,200</td>
                                <td className="px-6 py-4 text-slate-500">Yesterday</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
                                        Completed
                                    </span>
                                </td>
                            </tr>
                            {/* Mock Data Row 3 */}
                            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">Competitor_Prices</td>
                                <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">bestbuy.com/site/search</td>
                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">85</td>
                                <td className="px-6 py-4 text-slate-500">Jan 24</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wide">
                                        Archived
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
