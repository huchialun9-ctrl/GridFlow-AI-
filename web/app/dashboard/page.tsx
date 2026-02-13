
'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Dashboard() {
    const [datasets, setDatasets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRows: 0,
        activeSessions: 0,
        storageUsed: 0
    });

    const fetchData = async () => {
        setLoading(true);
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
                storageUsed: Math.round(totalRows * 0.01) // mock
            });
        } catch (e) {
            console.error("Error fetching datasets:", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this dataset?')) return;
        
        try {
            const { error } = await supabase
                .from('datasets')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            fetchData();
        } catch (e) {
            alert('Failed to delete dataset');
            console.error(e);
        }
    };

    const handleNewTask = () => {
        const url = prompt('Enter the URL of the website to extract data from:');
        if (url) {
            alert('Extraction task started for: ' + url + '\n(Backend processing will be implemented soon)');
        }
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">DASHBOARD</h1>
                    <p className="text-sm text-slate-500 font-mono mt-1">OVERVIEW // <span className="text-emerald-600 font-bold">{loading ? 'SYNCING...' : 'SYSTEM_ONLINE'}</span></p>
                </div>
                <button
                    onClick={handleNewTask}
                    className="px-4 py-2 bg-slate-900 hover:bg-black dark:bg-slate-50 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono rounded shadow-sm transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    NEW_EXTRACTION
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2">Total Rows</h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">{stats.totalRows.toLocaleString()}</p>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2">Datasets</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">{stats.activeSessions}</p>
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wider mb-2">Efficiency Score</h3>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">98.4<span className="text-sm font-normal">%</span></p>
                </div>
            </div>

            {/* Recent Data Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h2 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-wider">All Extractions</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-bold">Name</th>
                                <th className="px-6 py-4 font-bold">Source</th>
                                <th className="px-6 py-4 font-bold text-center">Rows</th>
                                <th className="px-6 py-4 font-bold">Date</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-mono animate-pulse">CONNECTING_TO_DATABASE...</td>
                                </tr>
                            )}
                            {datasets.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-mono">NO_DATA_FOUND</td>
                                </tr>
                            )}
                            {datasets.map((ds) => (
                                <tr key={ds.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{ds.name}</td>
                                    <td className="px-6 py-4">
                                        <a href={ds.source_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block max-w-[200px]">
                                            {ds.source_url?.replace('https://', '').replace('http://', '')}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded font-bold">
                                            {ds.row_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(ds.created_at).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(ds.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
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
