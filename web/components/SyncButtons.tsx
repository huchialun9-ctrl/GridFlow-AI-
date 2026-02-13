'use client';

import { useState } from 'react';
import { FileSpreadsheet, FileText, Presentation, Check, Loader2 } from 'lucide-react';
import XLSX from 'xlsx-js-style';

import { supabase } from '@/lib/supabaseClient';
import { exportToExcel, exportToWord, exportToPPT } from '@/lib/exportUtils';

export default function SyncButtons({ data }: { data: any }) {
    const [isSyncing, setIsSyncing] = useState(false);
    const [success, setSuccess] = useState(false);

    const mode = data.metadata?.process_mode || 'excel';

    const handleExport = async () => {
        setIsSyncing(true);
        try {
            if (!data.rows || data.rows.length === 0) {
                alert("No data to export.");
                setIsSyncing(false);
                return;
            }

            const headers = data.headers || [];
            const rows = data.rows || [];
            const filename = (data.name || 'export').replace(/\s+/g, '_');

            // 1. Perform Platform-Specific Export
            if (mode === 'word') {
                await exportToWord(headers, rows, filename);
            } else if (mode === 'ppt') {
                await exportToPPT(headers, rows, filename);
            } else {
                // For Excel, we keep the styled export logic if it's the default
                const wsData = [headers, ...rows];
                const ws = XLSX.utils.aoa_to_sheet(wsData);

                // Simple auto-width and styling for Excel
                const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
                const colWidths: any[] = [];
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    let maxLen = 10;
                    for (let R = range.s.r; R <= range.e.r; ++R) {
                        const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })];
                        if (cell && cell.v) maxLen = Math.max(maxLen, String(cell.v).length);
                    }
                    colWidths.push({ wch: Math.min(maxLen + 2, 50) });

                    const headerRef = XLSX.utils.encode_cell({ c: C, r: 0 });
                    if (ws[headerRef]) {
                        ws[headerRef].s = {
                            font: { bold: true, color: { rgb: "FFFFFF" } },
                            fill: { fgColor: { rgb: "4F46E5" } },
                            alignment: { horizontal: "center" }
                        };
                    }
                }
                ws['!cols'] = colWidths;

                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Data");
                XLSX.writeFile(wb, `${filename}.xlsx`);
            }

            // 2. Cloud Audit Log (Optional but kept from original)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('managed_exports').insert({
                    user_id: user.id,
                    dataset_id: data.id,
                    file_name: filename,
                    mode: mode,
                    timestamp: new Date().toISOString()
                });
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Export failed", error);
            alert("Export failed: " + (error as any).message);
        } finally {
            setIsSyncing(false);
        }
    };

    const getButtonContent = () => {
        if (isSyncing) return { icon: <Loader2 className="w-4 h-4 animate-spin" />, text: 'Processing...' };
        if (success) return { icon: <Check className="w-4 h-4" />, text: 'Exported Successfully' };

        switch (mode) {
            case 'word': return { icon: <FileText className="w-4 h-4" />, text: 'Export to Word (.docx)', color: '#2B579A' };
            case 'ppt': return { icon: <Presentation className="w-4 h-4" />, text: 'Export to PPT (.pptx)', color: '#D24726' };
            default: return { icon: <FileSpreadsheet className="w-4 h-4" />, text: 'Export to Excel (.xlsx)', color: '#1D6F42' };
        }
    };

    const { icon, text, color = '#1D6F42' } = getButtonContent();

    return (
        <div className="flex gap-3">
            <style jsx>{`
                @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                .shimmer-bg { position: relative; overflow: hidden; }
                .shimmer-bg::after {
                    content: ''; position: absolute; top: 0; right: 0; bottom: 0; left: 0;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    animation: shimmer 2s infinite;
                }
            `}</style>
            <button
                onClick={handleExport}
                disabled={isSyncing || success}
                style={{ backgroundColor: color }}
                className={`flex items-center gap-2 px-4 py-2 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg hover:scale-105 active:scale-95 ${!isSyncing && !success ? 'shimmer-bg' : ''}`}
            >
                {icon}
                <span className="tracking-tight">{text}</span>
            </button>
        </div>
    );
}
