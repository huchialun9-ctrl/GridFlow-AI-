'use client'

import { useState, useEffect } from 'react';
import { Loader2, Play, Trash2, Plus } from 'lucide-react';

export default function Automation() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [webhookUrl, setWebhookUrl] = useState('');
    const [isDiffEnabled, setIsDiffEnabled] = useState(false);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

    useEffect(() => {
        fetchRecipes();
        fetchWebhooks();
        // Load Diff Setting
        const savedDiff = localStorage.getItem('gridflow_diff_enabled');
        if (savedDiff) setIsDiffEnabled(JSON.parse(savedDiff));
    }, []);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchRecipes = async () => {
        try {
            const res = await fetch('/api/recipes');
            const data = await res.json();
            if (data.recipes) setRecipes(data.recipes);
        } catch (error) {
            console.error('Failed to fetch recipes', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchWebhooks = async () => {
        try {
            const res = await fetch('/api/webhooks');
            const data = await res.json();
            if (data.webhooks && data.webhooks.length > 0) {
                setWebhookUrl(data.webhooks[0].url);
            }
        } catch (error) {
            console.error('Failed to fetch webhooks', error);
        }
    };

    const handleSaveWebhook = async () => {
        if (!webhookUrl) return;
        try {
            const res = await fetch('/api/webhooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Global Automation Hook',
                    url: webhookUrl,
                    event_types: ['dataset.created', 'diff.detected']
                })
            });
            if (res.ok) {
                showNotification("Webhook configuration saved successfully!");
            } else {
                throw new Error("Failed to save");
            }
        } catch (e) {
            showNotification("Failed to save Webhook", 'error');
        }
    };

    const toggleDiff = () => {
        const newState = !isDiffEnabled;
        setIsDiffEnabled(newState);
        localStorage.setItem('gridflow_diff_enabled', JSON.stringify(newState));
        showNotification(newState ? "Intelligence Diff Engine Enabled" : "Diff Engine Disabled");
    };

    const handleCreateTemplate = async (templateName: string, domain: string, desc: string) => {
        try {
            const res = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: templateName,
                    domain: domain,
                    description: desc,
                    selector_json: { "template": true } // Mock selector for template
                })
            });
            if (res.ok) {
                showNotification(`Template "${templateName}" created!`);
                fetchRecipes();
            }
        } catch (e) {
            showNotification("Failed to create from template", 'error');
        }
    };

    const handleRunRecipe = async (id: string) => {
        const apiKey = prompt("To test the No-Code API, please enter an API Key (sk_live_...):");
        if (!apiKey) return;

        try {
            const res = await fetch(`/api/v1/run/${id}`, {
                headers: { 'x-api-key': apiKey }
            });
            const result = await res.json();
            alert(JSON.stringify(result, null, 2));
        } catch (e) {
            alert("Failed to run recipe");
        }
    };

    return (
        <div className="space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {/* Notification Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 animate-in slide-in-from-right-10 ${
                    notification.type === 'success' 
                        ? 'bg-white dark:bg-slate-900 border-emerald-500 text-emerald-600' 
                        : 'bg-white dark:bg-slate-900 border-red-500 text-red-600'
                }`}>
                    <div className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-bold">{notification.message}</span>
                </div>
            )}

            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Intelligence Insights</h1>
                <p className="text-sm text-slate-500 mt-1">Global node data aggregation and trends</p>
            </div>

            {/* Status Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[10px] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-bold tracking-wider">Workflow Name</th>
                                <th className="px-6 py-4 font-bold tracking-wider">Frequency</th>
                                <th className="px-6 py-4 font-bold tracking-wider">Status Indicators</th>
                                <th className="px-6 py-4 font-bold tracking-wider text-right">State</th>
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
                                            <span className="text-[10px] font-bold">Webhook Active</span>
                                        </div>
                                        {isDiffEnabled && (
                                            <div className="flex items-center gap-1.5 text-blue-500">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                                <span className="text-[10px] font-bold">Diff Monitoring On</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded text-[10px] font-bold">RUNNING</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-widest">Webhook_Integration</h3>
                        <button onClick={handleSaveWebhook} className="text-[10px] bg-slate-100 hover:bg-emerald-500 hover:text-white dark:bg-slate-800 px-2 py-1 rounded transition-colors">
                            SAVE_CONFIG
                        </button>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Target_Endpoint_URL</label>
                            <input
                                type="url"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                placeholder="https://api.yourdomain.com/webhooks/gridflow"
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
                            <button 
                                onClick={toggleDiff}
                                className={`w-8 h-4 rounded-full relative transition-colors ${isDiffEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${isDiffEnabled ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipe Library */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
                    <span className="text-emerald-500">❖</span> Recipe Library
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Create New */}
                    <div className="group border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer min-h-[250px]">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-50">Create Custom Recipe</h3>
                            <p className="text-xs text-slate-500 mt-1">Design a new extraction workflow from scratch.</p>
                        </div>
                    </div>

                    {/* Fetched Recipes */}
                    {isLoading ? (
                         <div className="md:col-span-2 flex items-center justify-center min-h-[250px] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                        </div>
                    ) : recipes.map((recipe) => (
                        <div key={recipe.id} className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all relative overflow-hidden flex flex-col justify-between min-h-[250px]">
                             <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="text-6xl font-black text-slate-400">{recipe.domain?.[0]?.toUpperCase() || 'R'}</span>
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-lg font-bold">
                                         {recipe.domain?.[0]?.toUpperCase() || 'R'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-slate-50 text-sm line-clamp-1">{recipe.name}</h3>
                                        <div className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full inline-block mt-1">
                                            {recipe.domain || 'Custom'}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-3">
                                    {recipe.description || 'User defined extraction recipe.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <button 
                                    onClick={() => handleRunRecipe(recipe.id)}
                                    className="py-2 bg-slate-900 dark:bg-slate-50 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-400 text-white dark:text-slate-900 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Play className="w-3 h-3" />
                                    Run
                                </button>
                                <button className="py-2 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Default Templates (Only if no recipes or just as suggestions) */}
                    <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all relative overflow-hidden min-h-[250px] flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                     <span className="font-bold text-lg">A</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-50 text-sm">Amazon Monitor</h3>
                                    <div className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full inline-block mt-1">TEMPLATE</div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6">Start tracking prices immediately with this pre-built template.</p>
                        </div>
                        <button 
                            onClick={() => handleCreateTemplate('Amazon Monitor', 'amazon.com', 'Tracks product prices and availability')}
                            className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-500 hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            Use Template
                        </button>
                    </div>

                    <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all relative overflow-hidden min-h-[250px] flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                     <span className="font-bold text-lg">in</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-50 text-sm">LinkedIn Tracker</h3>
                                    <div className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full inline-block mt-1">TEMPLATE</div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6">Monitor company growth and job postings.</p>
                        </div>
                        <button 
                            onClick={() => handleCreateTemplate('LinkedIn Tracker', 'linkedin.com', 'Monitors company employee count')}
                            className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-500 hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            Use Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
