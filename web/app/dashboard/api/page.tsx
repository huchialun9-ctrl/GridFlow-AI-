'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, Trash2, Copy, Check, Terminal, Shield } from 'lucide-react';

export default function ApiDashboard() {
    const [keys, setKeys] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newKey, setNewKey] = useState<string | null>(null);
    const [keyName, setKeyName] = useState('');
    const [copiedKey, setCopiedKey] = useState(false);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        try {
            const res = await fetch('/api/keys');
            const data = await res.json();
            if (data.keys) setKeys(data.keys);
        } catch (error) {
            console.error('Failed to fetch keys', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateKey = async () => {
        if (!keyName.trim()) return;
        setIsCreating(true);
        try {
            const res = await fetch('/api/keys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: keyName })
            });
            const data = await res.json();
            if (data.key) {
                setNewKey(data.key.secret);
                setKeys([data.key, ...keys]);
                setKeyName('');
            }
        } catch (error) {
            console.error('Failed to create key', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteKey = async (id: string) => {
        if (!confirm('Are you sure? This action cannot be undone.')) return;
        try {
            await fetch(`/api/keys?id=${id}`, { method: 'DELETE' });
            setKeys(keys.filter(k => k.id !== id));
        } catch (error) {
            console.error('Failed to delete key', error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                        <Terminal className="w-6 h-6 text-indigo-500" />
                        Developer API
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage API keys to access GridFlow programmatically.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 text-sm font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2">
                        View Documentation
                    </button>
                </div>
            </div>

            {/* New Key Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4">Create New API Key</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="e.g. Production Server, Zapier Integration"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreateKey()}
                    />
                    <button
                        onClick={handleCreateKey}
                        disabled={isCreating || !keyName.trim()}
                        className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Generate Key
                    </button>
                </div>

                {newKey && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-800/50 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">API Key Generated Successfully</h3>
                                <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 mb-3">
                                    Copy this key now. You won't be able to see it again!
                                </p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 p-3 bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-800 rounded-lg font-mono text-xs text-slate-600 dark:text-slate-300 break-all">
                                        {newKey}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(newKey)}
                                        className="p-3 bg-emerald-100 dark:bg-emerald-800/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
                                    >
                                        {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Active Keys List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Active Keys</h2>
                    <span className="text-xs font-mono text-slate-400">{keys.length} keys</span>
                </div>
                
                {isLoading ? (
                    <div className="p-12 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                    </div>
                ) : keys.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Terminal className="w-8 h-8" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">No API Keys Found</h3>
                        <p className="text-xs text-slate-500 mt-1">Create your first key to start integrating.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Hint</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Used</th>
                                <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {keys.map((key) => (
                                <tr key={key.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-700 dark:text-slate-300 text-sm">{key.name}</div>
                                        <div className="flex gap-1 mt-1">
                                            {key.scopes?.map((scope: string) => (
                                                <span key={scope} className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
                                                    {scope}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                            sk_live_...
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {new Date(key.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteKey(key.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                            title="Revoke Key"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
