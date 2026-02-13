
'use client'

import React from 'react'

interface DatasetModalProps {
    isOpen: boolean;
    onClose: () => void;
    dataset: any;
}

export default function DatasetModal({ isOpen, onClose, dataset }: DatasetModalProps) {
    if (!isOpen || !dataset) return null;

    const headers = dataset.headers || [];
    const rows = dataset.rows || [];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[80vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{dataset.name}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">SOURCE: {dataset.source_url}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto p-0">
                    <table className="w-full text-xs text-left font-mono">
                        <thead className="sticky top-0 bg-white dark:bg-slate-900 shadow-sm z-10">
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                {headers.map((header: string, i: number) => (
                                    <th key={i} className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider border-r border-slate-100 dark:border-slate-800 last:border-0 whitespace-nowrap bg-slate-50 dark:bg-slate-900">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {rows.map((row: any[], rowIndex: number) => (
                                <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    {row.map((cell: any, cellIndex: number) => (
                                        <td key={cellIndex} className="px-4 py-3 text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800 last:border-0">
                                            {typeof cell === 'object' ? JSON.stringify(cell) : String(cell)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {rows.length === 0 && (
                        <div className="p-12 text-center text-slate-400 font-mono">
                            DATA_SET_EMPTY
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
