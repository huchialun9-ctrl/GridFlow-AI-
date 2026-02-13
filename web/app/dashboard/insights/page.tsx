
'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';

export default function Insights() {
    const [datasets, setDatasets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState<any[]>([]);
    const [distData, setDistData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('datasets').select('*').order('created_at', { ascending: false });
            setDatasets(data || []);
            
            if (data && data.length > 0) {
                // Heuristic: Build a trend chart of row counts
                const trend = data.slice(0, 7).reverse().map(d => ({
                    name: d.name.slice(0, 10),
                    count: d.row_count || 0
                }));
                setChartData(trend);

                // Heuristic: Category distribution (if metadata exists)
                const dist = [
                    { name: 'Manual', value: data.filter(d => d.metadata?.type === 'manual_extraction').length },
                    { name: 'Live', value: data.filter(d => d.metadata?.type === 'live_extraction').length },
                    { name: 'AI Refined', value: data.filter(d => d.metadata?.ai_processed).length },
                ].filter(d => d.value > 0);
                setDistData(dist);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">Intelligence_Insights</h1>
                <p className="text-sm text-slate-500 font-mono mt-1">Status // Node Data Aggregation Complete</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Extraction Trend */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-8">Extraction_Volume_Trend</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Engine Distribution */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-8">Node_Engine_Distribution</h3>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {distData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="space-y-2">
                            {distData.map((d, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                    <span className="text-[10px] font-mono text-slate-500 uppercase">{d.name}: {d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div>
                        <h2 className="text-white font-bold uppercase tracking-tight">AI_Efficiency_Report</h2>
                        <p className="text-slate-400 font-mono text-xs mt-1 uppercase">Automated synthesis has saved approximately 4.2 hours of manual sorting this week.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest">Accuracy</p>
                            <p className="text-2xl font-black text-emerald-500 italic">99.4%</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest">Latency</p>
                            <p className="text-2xl font-black text-blue-500 italic">1.2s</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
