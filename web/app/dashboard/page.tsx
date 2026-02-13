
'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import DatasetModal from '@/components/DatasetModal';

export default function Dashboard() {
    const [datasets, setDatasets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDataset, setSelectedDataset] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
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

    const handleDownloadCSV = (e: React.MouseEvent, dataset: any) => {
        e.stopPropagation();
        const headers = dataset.headers || [];
        const rows = dataset.rows || [];
        
        const csvContent = [
            headers.join(','),
            ...rows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${dataset.name || 'dataset'}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleNewTask = () => {
        const url = prompt('Enter the URL of the website to extract data from:');
        if (url) {
            alert('Extraction task started for: ' + url + '\n(System will notify you once completed)');
        }
    };

    const openDetails = (dataset: any) => {
        setSelectedDataset(dataset);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50 uppercase">Infrastructure Console</h1>
                    <p className="text-sm text-slate-500 font-mono mt-1 flex items-center gap-2">
                        STATUS // <span className={loading ? "text-amber-500 animate-pulse" : "text-emerald-500 font-bold"}>
                            {loading ? 'SYNCHRONIZING...' : 'NODE_ONLINE'}
                        </span>
                        <span className="hidden md:inline text-slate-300 dark:text-slate-800">|</span>
                        <span className="hidden md:inline uppercase text-[10px] tracking-widest">{new Date().toLocaleDateString()}</span>
                    </p>
                </div>
                <button
                    onClick={handleNewTask}
                    className="px-6 py-3 bg-slate-900 hover:bg-black dark:bg-slate-50 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono rounded-lg shadow-xl shadow-slate-200 dark:shadow-none transition-all flex items-center justify-center gap-3 group"
                >
                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    INITIALIZE_EXTRACTION
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Rows', value: stats.totalRows.toLocaleString(), sub: 'Extracted' },
                    { label: 'Active Datasets', value: stats.activeSessions, sub: 'Stored' },
                    { label: 'System Load', value: '4.2%', sub: 'Healthy' }
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-[0.2em] mb-3">{stat.label}</h3>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">{stat.value}</p>
                            <span className="text-[10px] font-mono text-slate-400 uppercase">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden border-separate">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
                    <h2 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-[0.15em]">Repository Index</h2>
                    <div className="flex gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                        <div className="h-2 w-2 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left font-mono">
                        <thead className="text-[10px] text-slate-400 uppercase bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-bold tracking-widest">Entry_Name</th>
                                <th className="px-6 py-4 font-bold tracking-widest">Source_Origin</th>
                                <th className="px-6 py-4 font-bold tracking-widest text-center">Payload_Size</th>
                                <th className="px-6 py-4 font-bold tracking-widest">Timestamp</th>
                                <th className="px-6 py-4 font-bold tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-mono italic animate-pulse">REQUESTING_DATA_STREAM...</td>
                                </tr>
                            )}
                            {datasets.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-300 dark:text-slate-600 font-mono">ZERO_ENTRIES_LOCATED</td>
                                </tr>
                            )}
                            {datasets.map((ds) => (
                                <tr 
                                    key={ds.id} 
                                    onClick={() => openDetails(ds)}
                                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all group cursor-pointer"
                                >
                                    <td className="px-6 py-5 font-bold text-slate-900 dark:text-slate-100">{ds.name}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                                            <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                            <span className="truncate max-w-[180px] text-xs opacity-60 font-medium">
                                                {ds.source_url?.replace('https://', '').replace('www.', '')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="px-2 py-0.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded text-[10px] font-bold">
                                            {ds.row_count} ROWS
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-slate-400 text-[10px] whitespace-nowrap">
                                        {new Date(ds.created_at).toLocaleDateString()} // {new Date(ds.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={(e) => handleDownloadCSV(e, ds)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                title="Download CSV"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                            </button>
                                            <button 
                                                onClick={(e) => handleDelete(e, ds.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <DatasetModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                dataset={selectedDataset} 
            />
        </div>
    );
}
