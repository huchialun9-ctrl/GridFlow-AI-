'use client';

import { useState } from 'react';
import { FileSpreadsheet, FileText, Presentation, Check, Loader2 } from 'lucide-react';
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

            if (mode === 'word') {
                await exportToWord(headers, rows, filename);
            } else if (mode === 'ppt') {
                await exportToPPT(headers, rows, filename);
            } else {
                await exportToExcel(headers, rows, filename);
            }

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
        if (isSyncing) return { icon: <Loader2 className="w-4 h-4 animate-spin" />, text: 'Processing...', color: 'bg-slate-600' };
        if (success) return { icon: <Check className="w-4 h-4" />, text: 'Exported Successfully', color: 'bg-emerald-600' };

        switch (mode) {
            case 'word': return { icon: <FileText className="w-4 h-4" />, text: 'Export to Word (.docx)', color: 'bg-[#2B579A]' };
            case 'ppt': return { icon: <Presentation className="w-4 h-4" />, text: 'Export to PPT (.pptx)', color: 'bg-[#D24726]' };
            default: return { icon: <FileSpreadsheet className="w-4 h-4" />, text: 'Export to Excel (.xlsx)', color: 'bg-[#1D6F42]' };
        }
    };

    const { icon, text, color } = getButtonContent();

    return (
        <div className="flex gap-3">
            <button
                onClick={handleExport}
                disabled={isSyncing || success}
                className={`flex items-center gap-2 px-4 py-2 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg hover:scale-105 active:scale-95 relative overflow-hidden group ${color}`}
            >
                {/* Shimmer Effect using Tailwind */}
                {!isSyncing && !success && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"
                        style={{ animation: 'shimmer 2s infinite' }} />
                )}
                {icon}
                <span className="relative z-10 tracking-tight">{text}</span>
            </button>
            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
