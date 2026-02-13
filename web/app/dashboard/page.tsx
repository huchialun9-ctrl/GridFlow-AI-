
'use client'

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import DatasetModal from '@/components/DatasetModal';
import ExtractionModal from '@/components/ExtractionModal';

export default function Dashboard() {
    const [datasets, setDatasets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDataset, setSelectedDataset] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExtModalOpen, setIsExtModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [processMode, setProcessMode] = useState<'excel' | 'word' | 'ppt'>('excel');
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
            
            // Calculate REAL storage used by the JSON blobs
            const jsonString = JSON.stringify(data || []);
            const bytes = new TextEncoder().encode(jsonString).length;
            const storageUsedMB = bytes / (1024 * 1024);
            
            setStats({
                totalRows,
                activeSessions: data?.length || 0,
                storageUsed: Number(storageUsedMB.toFixed(4)) // Higher precision for real data
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

    const handleRename = async (id: string) => {
        if (!newName.trim()) return;
        try {
            const { error } = await supabase
                .from('datasets')
                .update({ name: newName })
                .eq('id', id);
            
            if (error) throw error;
            setRenamingId(null);
            setNewName('');
            fetchData();
        } catch (e) {
            alert('Failed to rename dataset');
            console.error(e);
        }
    };

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

    const handleNewTask = async (url: string, mode: string = 'excel') => {
        setIsExtModalOpen(false);
        setLoading(true);
        setIsProcessing(true);
        
        try {
            const response = await fetch('/api/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, mode })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Extraction failed');
            }

            const extractionResult = await response.json();

            const { error } = await supabase
                .from('datasets')
                .insert([{
                    name: extractionResult.name,
                    source_url: url,
                    row_count: extractionResult.rowCount,
                    headers: extractionResult.headers,
                    rows: extractionResult.rows,
                    metadata: { 
                        type: 'live_extraction', 
                        engine: 'jina_reader_v1',
                        timestamp: new Date().toISOString()
                    }
                }]);

            if (error) throw error;
            await fetchData();
        } catch (e: any) {
            console.error('Extraction flow error:', e);
            const errorMessage = e.message || e.error || 'Unknown Error';
            alert('PROCESS_FAILED: ' + errorMessage + '\n\nPossible reasons:\n1. Network timeout\n2. Invalid URL\n3. Database restriction (RLS)\n\nPlease verify your target URL and database state.');
        } finally {
            setLoading(false);
            setIsProcessing(false);
        }
    };

    const openDetails = (dataset: any) => {
        setSelectedDataset(dataset);
        setIsModalOpen(true);
    };

    const handleModeSelect = (mode: 'excel' | 'word' | 'ppt') => {
        setProcessMode(mode);
    };

    return (
        <div className="space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex-1 space-y-4">
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
                    
                    <div className="relative max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="SEARCH_BY_ENTRY_OR_SOURCE..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
                
                <button
                    onClick={() => setIsExtModalOpen(true)}
                    className="px-6 py-3 bg-slate-900 hover:bg-black dark:bg-slate-50 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-bold font-mono rounded-lg shadow-xl shadow-slate-200 dark:shadow-none transition-all flex items-center justify-center gap-3 group shrink-0"
                >
                    <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    INITIALIZE_EXTRACTION
                </button>
            </div>

            {/* Strategic Capability Map */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/5 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner relative z-10">
                <div 
                    onClick={() => handleModeSelect('excel')}
                    className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-white dark:hover:bg-slate-800/50 ${processMode === 'excel' ? 'border-[#1D6F42] bg-white dark:bg-slate-800 shadow-lg' : 'border-transparent'}`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-[#1D6F42]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-slate-50 uppercase tracking-widest leading-none">Data Extraction</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Scrape web tables & lists into structured datasets.</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] font-bold text-[#1D6F42] bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded border border-emerald-100">Excel (.xlsx)</span>
                    </div>
                </div>

                <div 
                    onClick={() => handleModeSelect('word')}
                    className={`flex flex-col gap-2 relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-white dark:hover:bg-slate-800/50 ${processMode === 'word' ? 'border-[#2B579A] bg-white dark:bg-slate-800 shadow-lg' : 'border-transparent'}`}
                >
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900 animate-bounce">AI POWERED</div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-[#2B579A]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-slate-50 uppercase tracking-widest leading-none">Literature Summary</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">AI analyzes articles & news to generate reflection reports.</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] font-bold text-[#2B579A] bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded border border-blue-100">Word (.docx)</span>
                    </div>
                </div>

                <div 
                    onClick={() => handleModeSelect('ppt')}
                    className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-white dark:hover:bg-slate-800/50 ${processMode === 'ppt' ? 'border-[#B7472A] bg-white dark:bg-slate-800 shadow-lg' : 'border-transparent'}`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-[#B7472A]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                        </div>
                        <span className="text-xs font-black text-slate-900 dark:text-slate-50 uppercase tracking-widest leading-none">Dynamic Presentation</span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">Visualize data & AI insights into professional slide decks.</p>
                    <div className="mt-2 flex items-center gap-2">
                        <span className="text-[9px] font-bold text-[#B7472A] bg-orange-50 dark:bg-orange-900/40 px-2 py-0.5 rounded border border-orange-100">PowerPoint (.pptx)</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Quotas */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Usage Quotas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Rows Quota */}
                        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path></svg>
                           </div>
                           <div className="relative z-10">
                                <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Rows_Extracted</h3>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-2xl font-black text-slate-900 dark:text-slate-50">{stats.totalRows.toLocaleString()}</span>
                                    <span className="text-xs font-mono text-slate-400">/ 10,000</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min((stats.totalRows / 10000) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-slate-500 flex justify-between">
                                    <span>Monthly Quota</span>
                                    <span className="font-bold text-blue-600">{(Math.min((stats.totalRows / 10000) * 100, 100)).toFixed(1)}% Used</span>
                                </p>
                           </div>
                        </div>

                        {/* Storage Quota */}
                        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <svg className="w-24 h-24 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></svg>
                           </div>
                           <div className="relative z-10">
                                <h3 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">Cloud_Storage</h3>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-2xl font-black text-slate-900 dark:text-slate-50">{stats.storageUsed} MB</span>
                                    <span className="text-xs font-mono text-slate-400">/ 512 MB</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
                                     <div 
                                        className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.min((stats.storageUsed / 512) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-[10px] text-slate-500 flex justify-between">
                                    <span>Free Tier Limit</span>
                                    <span className="font-bold text-emerald-600">{(Math.min((stats.storageUsed / 512) * 100, 100)).toFixed(2)}% Used</span>
                                </p>
                           </div>
                        </div>
                    </div>

            {/* Main Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden border-separate">
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/20">
                    <h2 className="text-sm font-bold text-slate-900 dark:text-slate-50 tracking-wide">Repository Index</h2>
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
                            {isProcessing && (
                                <tr className="bg-blue-50/30 dark:bg-blue-900/10 animate-pulse">
                                    <td colSpan={5} className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-xs font-bold font-mono text-blue-600 tracking-tighter uppercase">AI_EXTRACTOR_NODE: Processing Data Stream...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {loading && !isProcessing && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-mono italic animate-pulse">REQUESTING_DATA_STREAM...</td>
                                </tr>
                            )}
                            {datasets.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-300 dark:text-slate-600 font-mono">ZERO_ENTRIES_LOCATED</td>
                                </tr>
                            )}
                            {datasets
                                .filter(ds => 
                                    ds.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    ds.source_url?.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((ds) => (
                                <tr 
                                    key={ds.id} 
                                    onClick={() => openDetails(ds)}
                                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all group cursor-pointer"
                                >
                                    <td className="px-6 py-5">
                                        {renamingId === ds.id ? (
                                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                <input
                                                    autoFocus
                                                    value={newName}
                                                    onChange={e => setNewName(e.target.value)}
                                                    className="bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded px-2 py-1 text-xs focus:outline-none"
                                                />
                                                <button onClick={() => handleRename(ds.id)} className="text-emerald-500 hover:text-emerald-600">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                </button>
                                                <button onClick={() => setRenamingId(null)} className="text-slate-400 hover:text-slate-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="font-bold text-slate-900 dark:text-slate-100">{ds.name}</span>
                                        )}
                                    </td>
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setRenamingId(ds.id);
                                                    setNewName(ds.name);
                                                }}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                title="Rename"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                            </button>
                                            <button 
                                                onClick={(e) => handleDownloadCSV(e, ds)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                                                title="Download CSV"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 03-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
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
        </div>

        {/* Right Column: Activity Feed */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live_Activity_Feed
                </h3>
                
                <div className="space-y-6 relative">
                        {/* Timeline Line */}
                    <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-100 dark:bg-slate-800"></div>

                    {datasets.slice(0, 5).map((ds, i) => (
                        <div key={ds.id} className="relative pl-6 group">
                            <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${i === 0 ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                            <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                                New dataset <span className="font-bold">"{ds.name}"</span> created
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                {new Date(ds.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Extracted {ds.row_count} rows
                            </p>
                        </div>
                    ))}
                    
                    {datasets.length === 0 && (
                        <div className="pl-6 text-xs text-slate-400 italic">No recent activity detected.</div>
                    )}

                    <div className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 bg-emerald-500"></div>
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                            System initialized
                        </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                            {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
                </div>
                <h3 className="text-lg font-bold mb-2 relative z-10">Ready to Scale?</h3>
                <p className="text-xs text-indigo-100 mb-4 relative z-10 leading-relaxed">
                    Upgrade to Pro for unlimited rows, team collaboration, and API access.
                </p>
                <Link href="/dashboard/upgrade" className="inline-block px-4 py-2 bg-white text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors relative z-10">
                    Contact Sales
                </Link>
            </div>
        </div>
    </div>

            <DatasetModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                dataset={selectedDataset} 
            />

            <ExtractionModal 
                isOpen={isExtModalOpen}
                onClose={() => setIsExtModalOpen(false)}
                onSubmit={handleNewTask}
                initialMode={processMode}
            />
        </div>
    );
}
