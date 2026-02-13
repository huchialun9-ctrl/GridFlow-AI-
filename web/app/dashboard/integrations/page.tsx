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
            icon: <Zap className="w-6 h-6 text-orange-500" />,
            status: 'Stable',
            tag: 'REST API Support',
            description: 'Trigger 5,000+ apps when new data is extracted.',
            connected: false
        },
        {
            name: 'Make.com',
            category: 'Automation',
            icon: <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xs">M</div>,
            status: 'Stable',
            tag: 'Webhook',
            description: 'Advanced visual workflows for data processing.',
            connected: false
        },
        {
            name: 'Airtable',
            category: 'Database',
            icon: <Database className="w-6 h-6 text-yellow-500" />,
            status: 'Beta',
            tag: 'Direct Sync',
            description: 'Auto-populate bases with structured web data.',
            connected: false
        },
        {
            name: 'Hugging Face',
            category: 'Developer',
            icon: <div className="text-2xl">🤗</div>,
            status: 'Experimental',
            tag: 'JSONL Export',
            description: 'Push datasets directly for LLM fine-tuning.',
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
