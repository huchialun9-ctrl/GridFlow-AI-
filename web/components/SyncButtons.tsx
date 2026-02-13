'use client';

import { useState } from 'react';
import { FileSpreadsheet, Check, Loader2 } from 'lucide-react';
import XLSX from 'xlsx-js-style';

export default function SyncButtons({ data }: { data: any }) {
    const [isSyncingSheets, setIsSyncingSheets] = useState(false);
    const [sheetsSuccess, setSheetsSuccess] = useState(false);

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
