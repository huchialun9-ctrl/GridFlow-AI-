'use client'

import { useState, useEffect } from 'react';
import { Loader2, Play, Trash2, Plus } from 'lucide-react';

export default function Automation() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRecipes();
    }, []);

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

    const handleRunRecipe = async (id: string) => {
        // In a real app, this might trigger a background job or open a modal
        // For No-Code API demo, we just hit the endpoint
        const apiKey = prompt("Please enter your API Key to test the No-Code Endpoint:");
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
        <div className="space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Intelligence Insights</h1>
                <p className="text-sm text-slate-500 mt-1">Global node data aggregation and trends</p>
            </div>

            {/* Status Table (Placeholder for now, but linked to concept) */}
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
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            <span className="text-[10px] font-bold">Webhook Active</span>
                                        </div>
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

                    {/* Default Template: Amazon (Always visible if no user recipes, or just as an example) */}
                    {recipes.length === 0 && !isLoading && (
                        <div className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-orange-500/30 transition-all cursor-pointer relative overflow-hidden min-h-[250px] flex flex-col justify-between">
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
                            <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-500 hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                                Use Template
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
