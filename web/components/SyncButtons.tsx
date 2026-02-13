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

    const handleSheetsSync = () => {
        setIsSyncingSheets(true);
        try {
            if (!data.rows || data.rows.length === 0) {
                alert("No data to export.");
                setIsSyncingSheets(false);
                return;
            }

            // Generate CSV
            const headers = Object.keys(data.rows[0]).join(',');
            const csvRows = data.rows.map((row: any) => 
                Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
            ).join('\n');
            const csvContent = `${headers}\n${csvRows}`;

            // Trigger Download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${(data.name || 'export').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setSheetsSuccess(true);
            setTimeout(() => setSheetsSuccess(false), 3000);
        } catch (error) {
            console.error("Export failed", error);
            alert("Export failed");
        } finally {
            setIsSyncingSheets(false);
        }
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
