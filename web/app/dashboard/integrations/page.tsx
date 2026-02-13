'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, Zap, Database, Globe, AlertCircle, Check, ArrowRight, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function IntegrationsPage() {
    const [webhooks, setWebhooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingWebhook, setIsCreatingWebhook] = useState(false);
    const [newWebhookUrl, setNewWebhookUrl] = useState('');
    const [newWebhookName, setNewWebhookName] = useState('');

    useEffect(() => {
        fetchWebhooks();
    }, []);

    const fetchWebhooks = async () => {
        try {
            const res = await fetch('/api/webhooks');
            const data = await res.json();
            if (data.webhooks) setWebhooks(data.webhooks);
        } catch (error) {
            console.error('Failed to fetch webhooks', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateWebhook = async () => {
        if (!newWebhookName || !newWebhookUrl) return;
        setIsCreatingWebhook(true);
        try {
            const res = await fetch('/api/webhooks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: newWebhookName, 
                    url: newWebhookUrl,
                    event_types: ['dataset.created', 'dataset.updated']
                })
            });
            const data = await res.json();
            if (data.webhook) {
                setWebhooks([data.webhook, ...webhooks]);
                setNewWebhookName('');
                setNewWebhookUrl('');
            }
        } catch (error) {
            console.error('Failed to create webhook', error);
        } finally {
            setIsCreatingWebhook(false);
        }
    };

    const handleDeleteWebhook = async (id: string) => {
        if (!confirm('Are you sure you want to delete this webhook?')) return;
        try {
            await fetch(`/api/webhooks?id=${id}`, { method: 'DELETE' });
            setWebhooks(webhooks.filter(w => w.id !== id));
        } catch (error) {
            console.error('Failed to delete webhook', error);
        }
    };

    const Connectors = [
        {
            name: 'Zapier',
            category: 'Automation',
            // Zapier Orange Logo
            icon: (
                <svg className="w-6 h-6 text-[#FF4F00]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.2 13.8h7.1l-1.9 8.1 10.4-11.8h-7.1l1.9-8.1L4.2 13.8z"/>
                </svg>
            ),
            status: 'Stable',
            tag: 'REST API Support',
            description: 'Trigger 5,000+ apps. Seamlessly connect GridFlow events to your entire stack.',
            connected: false
        },
        {
            name: 'Make',
            category: 'Automation',
            // Make Purple Logo (Simplified M)
            icon: (
                 <svg className="w-6 h-6 text-[#6F42C1]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6z"/> 
                    {/* Placeholder for Make's infinity-like logo, using stylized M concept */}
                    <path d="M4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8-8-3.59-8-8zm2.5 1h3v3h-3v-3zm0-4h3v3h-3V9zm4 4h3v3h-3v-3zm0-4h3v3h-3V9zm4 4h3v3h-3v-3zm0-4h3v3h-3V9z" opacity="0.5"/>
                </svg>
            ),
            status: 'Stable',
            tag: 'Webhook',
            description: 'Visual automation. Map GridFlow fields to complex logic flows.',
            connected: false
        },
        {
            name: 'Airtable',
            category: 'Database',
             // Airtable Yellow/Blue Logo
            icon: (
                <svg className="w-6 h-6 text-[#FCB400]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.035 1.765a2.503 2.503 0 00-1.285.34l-8.57 4.965a2.493 2.493 0 00-1.18 2.06v9.805c0 .08.005.155.015.23a2.493 2.493 0 001.165 1.83l8.57 4.965a2.503 2.503 0 002.57 0l8.57-4.965a2.493 2.493 0 001.165-1.83c.01-.075.015-.15.015-.23V7.125a2.493 2.493 0 00-1.18-2.06l-8.57-4.965a2.503 2.503 0 00-1.285-.34zM12 4.155l6.985 4.045L12 12.245 5.015 8.2 12 4.155zM4 10.365l6.5 3.765v7.61L4 18V10.365zm13.5 11.375V14.13l6.5-3.765V18l-6.5 3.74z"></path>
                </svg>
            ),
            status: 'Beta',
            tag: 'Direct Sync',
            description: 'Auto-populate bases. Turn web data into relational database records.',
            connected: false
        },
        {
            name: 'Hugging Face',
            category: 'Developer',
            // Simple Emoji is actually best for HF if SVG unavailable, but let's try a simple path
             icon: (
                <span className="text-2xl">🤗</span>
            ),
            status: 'Experimental',
            tag: 'JSONL Export',
            description: 'Push datasets directly for LLM fine-tuning and shared repositories.',
            connected: false
        }
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-blue-500" />
                    Ecosystem Matrix
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Connect GridFlow to your data stack.
                </p>
            </div>

            {/* Connections Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Connectors.map((connector) => (
                    <motion.div 
                        key={connector.name}
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all relative overflow-hidden group"
                    >
                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                            connector.status === 'Stable' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            connector.status === 'Beta' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                        }`}>
                            {connector.status}
                        </div>

                        <div className="mb-4">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-3">
                                {connector.icon}
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-slate-50">{connector.name}</h3>
                            <div className="text-[10px] font-mono text-slate-400 mt-1">{connector.tag}</div>
                        </div>
                        
                        <p className="text-xs text-slate-500 leading-relaxed mb-6 h-10">
                            {connector.description}
                        </p>

                        <button className="w-full py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                            Configure
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* Webhooks Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Active Webhooks
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Push data to custom endpoints automatically.
                        </p>
                    </div>
                </div>

                {/* Create Webhook Form */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-end md:items-center">
                    <div className="flex-1 w-full space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Webhook Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Production Data Ingest"
                            value={newWebhookName}
                            onChange={(e) => setNewWebhookName(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex-[2] w-full space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Payload URL</label>
                        <input
                            type="text"
                            placeholder="https://api.myapp.com/webhooks/gridflow"
                            value={newWebhookUrl}
                            onChange={(e) => setNewWebhookUrl(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        />
                    </div>
                    <button
                        onClick={handleCreateWebhook}
                        disabled={isCreatingWebhook || !newWebhookName || !newWebhookUrl}
                        className="px-6 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 h-[38px] flex items-center gap-2 whitespace-nowrap"
                    >
                        {isCreatingWebhook ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add Webhook
                    </button>
                </div>

                {/* Webhooks List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {isLoading ? (
                         <div className="p-8 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                        </div>
                    ) : webhooks.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">
                            No webhooks configured. Add one above to start automating.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {webhooks.map((hook) => (
                                <div key={hook.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-slate-50 text-sm">{hook.name}</div>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <code className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-950 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-800">POST</code>
                                                <span className="text-xs text-slate-500 font-mono truncate max-w-[200px] md:max-w-md">{hook.url}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden md:flex gap-1">
                                            {hook.event_types?.map((event: string) => (
                                                <span key={event} className="text-[9px] px-1.5 py-0.5 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-full font-bold uppercase tracking-wider">
                                                    {event.split('.')[1]}
                                                </span>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteWebhook(hook.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
