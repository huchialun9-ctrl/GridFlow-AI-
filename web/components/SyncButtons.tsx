'use client';

import { useState } from 'react';
import { FileSpreadsheet, Check, Loader2 } from 'lucide-react';
import XLSX from 'xlsx-js-style';

import { supabase } from '@/lib/supabaseClient';

export default function SyncButtons({ data }: { data: any }) {
    const [isSyncingSheets, setIsSyncingSheets] = useState(false);
    const [sheetsSuccess, setSheetsSuccess] = useState(false);

    const handleSheetsSync = async () => {
        setIsSyncingSheets(true);
        try {
            if (!data.rows || data.rows.length === 0) {
                alert("No data to export.");
                setIsSyncingSheets(false);
                return;
            }

            // 1. Prepare Data
            let wsData = [];
            if (Array.isArray(data.rows[0])) {
                 wsData = [data.headers, ...data.rows];
            } else {
                wsData = data.rows;
            }

            // 2. Create Sheet & Styling (Keep existing styling logic)
            const ws = XLSX.utils.json_to_sheet(wsData);
            
            // ... (Styling logic omitted for brevity, assuming it remains or is re-implemented if needed)
            // For brevity in this tool call, I'll trust the existing styling logic if I could partial replace, 
            // but since I'm rewriting the function, I'll keep the core styling logic simple or copy it back?
            // Wait, I should probably keep the styling logic.
            // Let's re-include the robust styling logic from before to be safe.

            const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
            const colWidths: number[] = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
                let maxLen = 10;
                for (let R = range.s.r; R <= range.e.r; ++R) {
                    const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
                    const cell = ws[cellRef];
                    if (cell && cell.v) {
                        const len = String(cell.v).length;
                        if (len > maxLen) maxLen = len;
                    }
                }
                colWidths.push(Math.min(maxLen + 2, 50));
                const headerRef = XLSX.utils.encode_cell({ c: C, r: 0 });
                if (ws[headerRef]) {
                    ws[headerRef].s = {
                        font: { name: 'Arial', sz: 12, bold: true, color: { rgb: "FFFFFF" } },
                        fill: { fgColor: { rgb: "4F46E5" } },
                        alignment: { horizontal: "center", vertical: "center" },
                        border: { top: { style: 'thin', color: { rgb: "000000" } }, bottom: { style: 'thin', color: { rgb: "000000" } }, left: { style: 'thin', color: { rgb: "000000" } }, right: { style: 'thin', color: { rgb: "000000" } } }
                    };
                }
            }
            ws['!cols'] = colWidths.map(w => ({ wch: w }));

            // 3. Write to Buffer
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "GridFlow Data");
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // 4. Managed Export: Upload to Supabase Storage
            const filename = `${(data.name || 'export').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
            const filePath = `${data.user_id || 'guest'}/${Date.now()}_${filename}`;

            const { error: uploadError } = await supabase.storage
                .from('exports')
                .upload(filePath, blob, {
                    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

            if (uploadError) throw new Error('Cloud Upload Failed: ' + uploadError.message);

            // 5. Audit Log (Managed Asset)
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                await supabase.from('managed_exports').insert({
                    user_id: user.id,
                    dataset_id: data.id,
                    file_path: filePath,
                    file_name: filename,
                    file_size_bytes: blob.size
                });
            }

            // 6. Trigger Download
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
                {sheetsSuccess ? 'Cloud Sync & Downloaded' : 'Managed Cloud Export'}
            </button>
        </div>
    );
}
