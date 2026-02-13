'use client'

import { useState, useEffect } from 'react';
import { Loader2, Play, Trash2, Plus } from 'lucide-react';

import { supabase } from '@/lib/supabaseClient';

export default function Automation() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [webhookUrl, setWebhookUrl] = useState('');
    const [isDiffEnabled, setIsDiffEnabled] = useState(false);
    const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                // Load Preferences from DB
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('preferences')
                    .eq('id', user.id)
                    .single();
                
                if (profile?.preferences?.diff_enabled) {
                    setIsDiffEnabled(profile.preferences.diff_enabled);
                }
            }
            fetchRecipes();
            fetchWebhooks();
        };
        init();
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

    const toggleDiff = async () => {
        if (!userId) return;
        
        const newState = !isDiffEnabled;
        setIsDiffEnabled(newState);
        
        // Update DB
        const { error } = await supabase
            .from('profiles')
            .update({ 
                preferences: { diff_enabled: newState } 
            })
            .eq('id', userId);

        if (error) {
            console.error('Failed to save preference', error);
            showNotification("Failed to save preference", 'error');
        } else {
            showNotification(newState ? "Intelligence Diff Engine Enabled" : "Diff Engine Disabled");
        }
    };

    const [creatingTemplateId, setCreatingTemplateId] = useState<string | null>(null);

    const handleCreateTemplate = async (templateId: string, templateName: string, domain: string, desc: string) => {
        setCreatingTemplateId(templateId);
        try {
            const res = await fetch('/api/recipes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: templateName,
                    domain: domain,
                    description: desc,
                    selector_json: { "template": true }
                })
            });
            if (res.ok) {
                showNotification(`Template "${templateName}" created!`);
                await fetchRecipes();
            } else {
                const err = await res.json();
                showNotification(err.error || "Failed to create template", 'error');
            }
        } catch (e: any) {
            showNotification(e.message || "Network error occurred", 'error');
        } finally {
            setCreatingTemplateId(null);
        }
    };

    const handleCreateCustom = () => {
        const name = prompt("Enter a name for your new recipe:");
        if (name) {
            handleCreateTemplate('custom', name, 'custom.com', 'Custom extraction recipe');
        }
    };

    const [runModalOpen, setRunModalOpen] = useState(false);
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
    const [apiKeyInput, setApiKeyInput] = useState('');

    const openRunModal = (id: string) => {
        setSelectedRecipeId(id);
        setApiKeyInput('');
        setRunModalOpen(true);
    };

    const confirmRunRecipe = async () => {
        if (!apiKeyInput || !selectedRecipeId) return;
        setRunModalOpen(false); // Close immediately or wait? Better close and show loading/outcome.

        try {
            const res = await fetch(`/api/v1/run/${selectedRecipeId}`, {
                headers: { 'x-api-key': apiKeyInput }
            });
            const result = await res.json();
            alert(JSON.stringify(result, null, 2)); // Could replace this alert too, but step by step.
        } catch (e) {
            alert("Failed to run recipe");
        }
    };

    // ... existing handleRunRecipe (removed) ...

    return (
        <div className="space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            {/* Run Recipe Modal */}
            {runModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 transform scale-100 transition-all">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">Run Extraction Recipe</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Enter your API Key to execute this extraction pipeline securely.
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">API Key</label>
                                <input 
                                    type="password"
                                    autoFocus
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    placeholder="sk_live_..."
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    onClick={() => setRunModalOpen(false)}
                                    className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmRunRecipe}
                                    disabled={!apiKeyInput}
                                    className="px-4 py-2 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                                >
                                    Run Recipe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Run Recipe Modal */}
            {runModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 transform scale-100 transition-all">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">Run Extraction Recipe</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            Enter your API Key to execute this extraction pipeline securely.
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">API Key</label>
                                <input 
                                    type="password"
                                    autoFocus
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    placeholder="sk_live_..."
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-400"
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    onClick={() => setRunModalOpen(false)}
                                    className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmRunRecipe}
                                    disabled={!apiKeyInput}
                                    className="px-4 py-2 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                                >
                                    Run Recipe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
            
            {/* ... rest of the UI ... */}
            
                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <button 
                                    onClick={() => openRunModal(recipe.id)}
                                    className="py-2 bg-slate-900 dark:bg-slate-50 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-400 text-white dark:text-slate-900 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <Play className="w-3 h-3" />
                                    Run
                                </button>


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
                    <div 
                        onClick={handleCreateCustom}
                        className="group border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-emerald-500/50 hover:scale-[1.02] transition-all cursor-pointer min-h-[250px]"
                    >
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                            <Plus className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Create Custom Recipe</h3>
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
                                    onClick={() => openRunModal(recipe.id)}
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
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg className="w-24 h-24 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                             </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#FF9900]/10 flex items-center justify-center text-[#FF9900]">
                                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M13.665 10.155L12.571 14.897L15.308 17.652L13.665 10.155ZM11.139 12.639L4.805 15.685L17.585 18.067L19.465 9.778L11.139 12.639ZM13.889 12.062L17.29 11.118L11.758 5.485L11.233 8.356L13.889 12.062ZM2.895 19.5L10.222 15.903L18.66 17.478L2.895 19.5ZM12.321 0.5L9.626 12.008L9.957 12.464L15.228 5.151L12.321 0.5Z"/></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-50 text-sm">Amazon Monitor</h3>
                                    <div className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full inline-block mt-1">TEMPLATE</div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6">Start tracking prices immediately with this pre-built template.</p>
                        </div>
                        <button 
                            onClick={() => handleCreateTemplate('amazon', 'Amazon Monitor', 'amazon.com', 'Tracks product prices and availability')}
                            disabled={!!creatingTemplateId}
                            className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#FF9900] hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:shadow-md"
                        >
                             {creatingTemplateId === 'amazon' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Use Template'}
                        </button>
                    </div>

                    <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all relative overflow-hidden min-h-[250px] flex flex-col justify-between">
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                            <svg className="w-24 h-24 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-[#0077B5]/10 flex items-center justify-center text-[#0077B5]">
                                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-slate-50 text-sm">LinkedIn Tracker</h3>
                                    <div className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full inline-block mt-1">TEMPLATE</div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6">Monitor company growth and job postings.</p>
                        </div>
                        <button 
                            onClick={() => handleCreateTemplate('linkedin', 'LinkedIn Tracker', 'linkedin.com', 'Monitors company employee count')}
                            disabled={!!creatingTemplateId}
                            className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#0077B5] hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 group-hover:shadow-md"
                        >
                            {creatingTemplateId === 'linkedin' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Use Template'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
