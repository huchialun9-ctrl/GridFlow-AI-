'use client';

import { useState } from 'react';
import { Cloud, FileSpreadsheet, Check, Loader2, Github } from 'lucide-react';

export default function SyncButtons({ data }: { data: any }) {
    const [isSyncingGist, setIsSyncingGist] = useState(false);
    const [isSyncingSheets, setIsSyncingSheets] = useState(false);
    const [gistSuccess, setGistSuccess] = useState(false);
    const [sheetsSuccess, setSheetsSuccess] = useState(false);

    const handleGistSync = async () => {
        setIsSyncingGist(true);
        try {
            // Prepare CSV/JSON content
            const content = JSON.stringify(data.rows, null, 2);
            const filename = `${data.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;

            const res = await fetch('/api/sync/gist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename,
                    content
                })
            });

            const result = await res.json();

            if (!res.ok) {
                if (res.status === 401) {
                    alert("Please login with GitHub to use Gist Sync.");
                } else {
                    throw new Error(result.error);
                }
                return;
            }

            setGistSuccess(true);
            // Maybe open the gist?
            window.open(result.html_url, '_blank');
            setTimeout(() => setGistSuccess(false), 3000);
        } catch (error) {
            console.error("Gist Sync specific error:", error);
            // In a real app we would show a toast
        } finally {
            setIsSyncingGist(false);
        }
    };

    const handleSheetsSync = async () => {
        setIsSyncingSheets(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSyncingSheets(false);
        setSheetsSuccess(true);
        setTimeout(() => setSheetsSuccess(false), 3000);
    };

    return (
        <div className="flex gap-3">
            <button
                onClick={handleGistSync}
                disabled={isSyncingGist || gistSuccess}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white text-xs font-medium rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-all disabled:opacity-50"
            >
                {isSyncingGist ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : gistSuccess ? (
                    <Check className="w-3.5 h-3.5" />
                ) : (
                    <Github className="w-3.5 h-3.5" />
                )}
                {gistSuccess ? 'Synced to Gist' : 'Sync to Gist'}
            </button>

            <button
                onClick={handleSheetsSync}
                disabled={isSyncingSheets || sheetsSuccess}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
                {isSyncingSheets ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : sheetsSuccess ? (
                    <Check className="w-3.5 h-3.5" />
                ) : (
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                )}
                {sheetsSuccess ? 'Exported' : 'Export to Sheets'}
            </button>
        </div>
    );
}
