'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SettingsContent() {
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    useEffect(() => {
        if (tab === 'api') {
            const element = document.getElementById('api-section');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [tab]);

    return (
        <div className="max-w-2xl space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800">
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-widest">Interface_Dark_Mode</h3>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Sync UI appearance with system protocol.</p>
                    </div>
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${darkMode ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${darkMode ? 'right-1' : 'left-1'}`}></div>
                    </button>
                </div>

                <div className="p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-widest">Push_Notifications</h3>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Receive alerts for completed extraction sequences.</p>
                    </div>
                    <button 
                        onClick={() => setNotifications(!notifications)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${notifications ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${notifications ? 'right-1' : 'left-1'}`}></div>
                    </button>
                </div>
            </div>

            {/* API Management Section */}
            <div id="api-section" className={`bg-white dark:bg-slate-900 rounded-2xl border p-6 shadow-sm transition-all duration-500 ${tab === 'api' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200 dark:border-slate-800'}`}>
                <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-widest mb-4">API_Management_Protocol</h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">Google_Gemini_API_Key</label>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                defaultValue="*******************************"
                                className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-xs font-mono focus:outline-none focus:border-blue-500 transition-all"
                            />
                            <button className="px-4 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-[10px] font-black uppercase rounded-lg">Update</button>
                        </div>
                        <p className="text-[9px] text-slate-400 italic">Used for high-fidelity data extraction and report generation.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <h3 className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase tracking-widest mb-6">User_Terminal_Identity</h3>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 flex items-center justify-center text-xl font-black italic">H</div>
                    <div>
                        <p className="text-xs font-bold font-mono text-slate-900 dark:text-slate-50 uppercase">huchialun97</p>
                        <p className="text-[10px] text-slate-400 font-mono uppercase">Role // System Administrator</p>
                    </div>
                </div>
                <button className="text-blue-600 dark:text-blue-400 text-[10px] font-black font-mono uppercase hover:underline">RE-LOG_TERMINAL_SESSION</button>
            </div>

            <div className="pt-4">
                <button className="w-full py-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-xs font-bold font-mono rounded-xl border border-red-100 dark:border-red-900/20 hover:bg-red-100 transition-all uppercase tracking-widest">
                    Destroy_All_Active_Nodes_and_Data
                </button>
            </div>
        </div>
    );
}

export default function Settings() {
    return (
        <div className="space-y-8 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">Console_Settings</h1>
                <p className="text-sm text-slate-500 font-mono mt-1">Configure Environment // User Preferences</p>
            </div>

            <Suspense fallback={<div className="text-slate-400 font-mono text-xs uppercase animate-pulse">Initializing_Settings_Terminal...</div>}>
                <SettingsContent />
            </Suspense>
        </div>
    );
}
