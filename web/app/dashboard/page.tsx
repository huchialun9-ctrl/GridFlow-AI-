'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard() {
    const [datasets, setDatasets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRows: 0,
        activeSessions: 0,
        storageUsed: 0
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const { data, error } = await supabase
                    .from('datasets')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setDatasets(data || []);

                // Calculate stats
                const totalRows = data?.reduce((acc, curr) => acc + (curr.row_count || 0), 0) || 0;
                setStats({
                    totalRows,
                    activeSessions: data?.length || 0,
                    storageUsed: Math.round(totalRows * 0.01) // Mock calculation
                });
            } catch (e) {
                console.error("Error fetching datasets:", e);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">DASHBOARD</h1>
                    <p className="text-sm text-slate-500 font-mono mt-1">OVERVIEW // <span className="text-emerald-600">{loading ? 'LOADING...' : 'SYSTEM_ONLINE'}</span></p>
                </div>
                <button
                    className="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-slate-50 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono rounded shadow-sm transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    NEW_TASK
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2">Total Rows Extracted</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">{stats.totalRows.toLocaleString()}</p>
                        <span className="text-xs font-mono text-emerald-600 font-medium">▲ 12%</span>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2">Total Extractions</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">{stats.activeSessions}</p>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2">Storage Usage</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">{stats.storageUsed} MB</p>
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
                            {datasets.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-mono">NO_DATA_FOUND</td>
                                </tr>
                            )}
                            {datasets.map((ds) => (
                                <tr key={ds.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">{ds.name.split(' ').slice(0, 1) + "_Data"}</td>
                                    <td className="px-6 py-4 text-slate-500 truncate max-w-[200px]">{ds.source_url}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{ds.row_count}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(ds.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wide">
                                            {ds.organization_id ? 'TEAM' : 'PRIVATE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
