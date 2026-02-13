
'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import DatasetModal from '@/components/DatasetModal';

export default function MyDatasets() {
    const [datasets, setDatasets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDataset, setSelectedDataset] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('datasets')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDatasets(data || []);
        } catch (e) {
            console.error("Error fetching datasets:", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const openDetails = (dataset: any) => {
        setSelectedDataset(dataset);
        setIsModalOpen(true);
    };

    const filteredDatasets = datasets.filter(ds => 
        ds.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        ds.source_url?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">My_Datasets</h1>
                    <p className="text-sm text-slate-500 font-mono mt-1">Archive // {datasets.length} Total Records</p>
                </div>
                <div className="relative max-w-xs">
                    <input
                        type="text"
                        placeholder="SEARCH_RECORDS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-4 pr-10 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    Array(6).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800/50 animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800"></div>
                    ))
                ) : filteredDatasets.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-mono italic">NO_RECORDS_FOUND</div>
                ) : (
                    filteredDatasets.map((ds) => (
                        <div 
                            key={ds.id}
                            onClick={() => openDetails(ds)}
                            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/30 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors truncate pr-2">{ds.name}</h3>
                                <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[9px] font-mono rounded font-bold uppercase">
                                    {ds.row_count}R
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono truncate mb-4">{ds.source_url}</p>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-50 dark:border-slate-800">
                                <span className="text-[9px] font-mono text-slate-400 uppercase">{new Date(ds.created_at).toLocaleDateString()}</span>
                                <button className="text-blue-600 dark:text-blue-400 text-[9px] font-black font-mono uppercase hover:underline">View_Detailed_Manifest</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <DatasetModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                dataset={selectedDataset} 
            />
        </div>
    );
}
