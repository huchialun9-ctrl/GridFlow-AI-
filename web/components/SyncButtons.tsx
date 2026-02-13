'use client';

import { useState } from 'react';
import { Cloud, FileSpreadsheet, Check, Loader2, Github } from 'lucide-react';
import XLSX from 'xlsx-js-style';

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

            // 1. Prepare Data
            // Ensure rows are objects. If they are arrays, convert to objects based on headers if available, or use index keys.
            let wsData = [];
            if (Array.isArray(data.rows[0])) {
                // If rows are arrays (e.g. [[val1, val2]]), prepend headers row
                 wsData = [data.headers, ...data.rows];
            } else {
                // If rows are objects (e.g. [{col1: val1}]), SheetJS handles headers automatically
                wsData = data.rows;
            }

            // 2. Create Search Sheet
            const ws = XLSX.utils.json_to_sheet(wsData);

            // 3. Styling Logic
            const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
            const colWidths: number[] = [];

            for (let C = range.s.c; C <= range.e.c; ++C) {
                let maxLen = 10; // Min width

                // Iterate over rows to find max length
                for (let R = range.s.r; R <= range.e.r; ++R) {
                    const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
                    const cell = ws[cellRef];
                    if (cell && cell.v) {
                        const len = String(cell.v).length;
                        if (len > maxLen) maxLen = len;
                    }
                }
                // Cap width at 50
                colWidths.push(Math.min(maxLen + 2, 50));

                // Add Header Style (First Row)
                const headerRef = XLSX.utils.encode_cell({ c: C, r: 0 });
                if (!ws[headerRef]) continue;

                ws[headerRef].s = {
                    font: {
                        name: 'Arial',
                        sz: 12,
                        bold: true,
                        color: { rgb: "FFFFFF" }
                    },
                    fill: {
                        fgColor: { rgb: "4F46E5" } // Indigo-600
                    },
                    alignment: {
                        horizontal: "center",
                        vertical: "center"
                    },
                    border: {
                        top: { style: 'thin', color: { rgb: "000000" } },
                        bottom: { style: 'thin', color: { rgb: "000000" } },
                        left: { style: 'thin', color: { rgb: "000000" } },
                        right: { style: 'thin', color: { rgb: "000000" } }
                    }
                };
            }

            // Set Column Widths
            ws['!cols'] = colWidths.map(w => ({ wch: w }));

            // 4. Create Workbook and Write
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "GridFlow Data");
            
            const filename = `${(data.name || 'export').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(wb, filename);

            setSheetsSuccess(true);
            setTimeout(() => setSheetsSuccess(false), 3000);
        } catch (error) {
            console.error("Export failed", error);
            alert("Export failed: " + (error as any).message);
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
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-md shadow-emerald-600/20"
            >
                {isSyncingSheets ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : sheetsSuccess ? (
                    <Check className="w-3.5 h-3.5" />
                ) : (
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                )}
                {sheetsSuccess ? 'Exported Clean Excel' : 'Export Clean Excel'}
            </button>
        </div>
    );
}
