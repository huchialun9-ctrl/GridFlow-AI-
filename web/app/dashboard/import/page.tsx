'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { Upload, FileSpreadsheet, ArrowRight, Sparkles, Loader2, Save, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient'; // Ensure this client exists and is configured

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [rawData, setRawData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [isCleaning, setIsCleaning] = useState(false);
    const [cleanedData, setCleanedData] = useState<any[]>([]);
    const [cleaningReport, setCleaningReport] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            if (data) {
                try {
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Array of arrays
                    
                    if (json.length > 0) {
                        const headerRow = json[0] as string[];
                        const dataRows = json.slice(1);
                        setHeaders(headerRow);
                        setRawData(dataRows);
                        // Reset cleaned state on new file
                        setCleanedData([]);
                        setCleaningReport(null);
                    }
                } catch (error) {
                    console.error("Error parsing file:", error);
                    alert("Failed to parse file. Please upload a valid CSV or Excel file.");
                }
            }
        };
        reader.readAsBinaryString(selectedFile);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxFiles: 1
    });

    const handleAIClean = async () => {
        setIsCleaning(true);
        try {
            // Send only a sample of data if it's too large, or implement chunking
            // For now, send up to 50 rows + headers for cleaning demonstration
            const payload = {
                filename: file?.name,
                headers: headers,
                rows: rawData.slice(0, 50) 
            };

            const res = await fetch('/api/clean', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            
            if (data.cleanedRows) {
                setCleanedData(data.cleanedRows);
                setCleaningReport(data.report);
            }

        } catch (error) {
            console.error("AI Cleaning failed", error);
            alert("AI Cleaning failed. Check console.");
        } finally {
            setIsCleaning(false);
        }
    };

    const handleSaveDataset = async () => {
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Format data for saving (array of objects)
            // Assuming cleanedData is [{ header: val, ... }]
            // Or if cleanedData is [[val, val]], needs conversion. 
            // The API should return array of objects.
            
            const datasetName = file?.name ? `Cleaned - ${file.name}` : 'Imported Dataset';

            const { error } = await supabase
                .from('datasets') // Assuming this table exists from Phase 1/2
                .insert({
                    user_id: user.id,
                    name: datasetName,
                    source_url: 'File Import',
                    status: 'completed',
                    row_count: cleanedData.length,
                    data: cleanedData // Storing JSON directly
                });

            if (error) throw error;
            alert("Dataset saved successfully!");

        } catch (error) {
           console.error("Save failed", error);
           alert("Failed to save dataset.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-indigo-500" />
                    Smart Data Importer
                </h1>
                <p className="text-sm text-slate-500 font-mono mt-1">
                    Upload CSV/Excel // AI Cleaning // Schema Alignment
                </p>
            </div>

            {/* Upload Area */}
            <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                    isDragActive 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
            >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Upload className="w-8 h-8" />
                </div>
                {isDragActive ? (
                    <p className="text-indigo-600 font-bold">Drop the file here...</p>
                ) : (
                    <div>
                        <p className="text-slate-900 dark:text-slate-50 font-bold text-lg">
                            {file ? file.name : "Drag & drop your file here"}
                        </p>
                        <p className="text-slate-500 text-sm mt-2">
                             Support for CSV, Excel (.xlsx, .xls)
                        </p>
                    </div>
                )}
            </div>

            {/* Preview & Action Area */}
            {file && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Raw Data Preview */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden flex flex-col h-[500px]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                                <FileSpreadsheet className="w-5 h-5 text-slate-400" />
                                Raw Data Preview
                            </h2>
                            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">
                                {rawData.length} rows detected
                            </span>
                        </div>
                        
                        <div className="flex-1 overflow-auto border border-slate-100 dark:border-slate-800 rounded-lg">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 dark:bg-slate-950 font-mono text-slate-500 sticky top-0">
                                    <tr>
                                        {headers.map((h, i) => (
                                            <th key={i} className="px-3 py-2 border-b border-r border-slate-200 dark:border-slate-800 last:border-r-0 whitespace-nowrap">
                                                {h || `Col ${i+1}`}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {rawData.slice(0, 20).map((row, i) => (
                                        <tr key={i}>
                                            {(row as any[]).map((cell, j) => (
                                                <td key={j} className="px-3 py-2 border-r border-slate-100 dark:border-slate-800 last:border-r-0 truncate max-w-[150px] text-slate-600 dark:text-slate-400">
                                                    {String(cell)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {rawData.length > 20 && (
                                <div className="p-2 text-center text-xs text-slate-400 italic bg-slate-50/50">
                                    ... {rawData.length - 20} more rows hidden
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                            <button
                                onClick={handleAIClean}
                                disabled={isCleaning}
                                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2 disabled:opacity-50"
                            >
                                {isCleaning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                Analyze & Clean with AI
                            </button>
                        </div>
                    </div>

                    {/* Cleaned Data Result */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-hidden flex flex-col h-[500px]">
                         <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-emerald-500" />
                                AI Cleaned Result
                            </h2>
                            {cleanedData.length > 0 && (
                                 <span className="text-xs font-mono bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded">
                                    Ready to Save
                                </span>
                            )}
                        </div>

                        {cleanedData.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                                {isCleaning ? (
                                    <>
                                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                                        <p className="font-medium text-slate-900 dark:text-slate-50">AI is analyzing your data structure...</p>
                                        <p className="text-sm mt-2">Identifying headers, fixing formats, and removing junk data.</p>
                                    </>
                                ) : (
                                    <>
                                        <ArrowRight className="w-10 h-10 mb-4 opacity-50" />
                                        <p>Run "Analyze & Clean" to see optimized results here.</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                {cleaningReport && (
                                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <p>{cleaningReport}</p>
                                    </div>
                                )}
                                <div className="flex-1 overflow-auto border border-emerald-100 dark:border-emerald-900/30 rounded-lg bg-emerald-50/10">
                                     <table className="w-full text-xs text-left">
                                        <thead className="bg-emerald-50 dark:bg-emerald-900/20 font-mono text-emerald-700 dark:text-emerald-400 sticky top-0">
                                            <tr>
                                                {Object.keys(cleanedData[0] || {}).map((h, i) => (
                                                    <th key={i} className="px-3 py-2 border-b border-emerald-100 dark:border-emerald-800/50 whitespace-nowrap">
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-emerald-50 dark:divide-emerald-900/20">
                                            {cleanedData.map((row, i) => (
                                                <tr key={i}>
                                                    {Object.values(row).map((cell: any, j) => (
                                                        <td key={j} className="px-3 py-2 text-slate-600 dark:text-slate-300 truncate max-w-[150px]">
                                                            {typeof cell === 'object' ? JSON.stringify(cell) : String(cell)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                    <button
                                        onClick={handleSaveDataset}
                                        disabled={isSaving}
                                        className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                        Save to My Datasets
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
