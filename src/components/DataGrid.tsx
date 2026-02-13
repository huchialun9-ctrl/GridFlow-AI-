import React from "react"

interface DataGridProps {
    data: string[][]
    headers?: string[]
}

export function DataGrid({ data, headers }: DataGridProps) {
    if (!data || data.length === 0) {
        return (
            <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-h-full plasmo-text-slate-400 plasmo-font-mono plasmo-text-xs">
                No data selected
            </div>
        )
    }

    return (
        <div className="plasmo-w-full plasmo-overflow-auto plasmo-flex-1">
            <table className="plasmo-w-full plasmo-border-collapse plasmo-text-xs plasmo-font-mono plasmo-text-left">
                {headers && (
                    <thead className="plasmo-sticky plasmo-top-0 plasmo-bg-white dark:plasmo-bg-slate-900 plasmo-z-10">
                        <tr>
                            {headers.map((header, i) => (
                                <th key={i} className="plasmo-p-2 plasmo-font-medium plasmo-text-slate-500 plasmo-border-b plasmo-border-slate-100 dark:plasmo-border-slate-800">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                )}
                <tbody className="plasmo-divide-y plasmo-divide-slate-50 dark:plasmo-divide-slate-800/50">
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:plasmo-bg-slate-50 dark:hover:plasmo-bg-slate-800/50">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="plasmo-p-2 plasmo-text-slate-700 dark:plasmo-text-slate-300 plasmo-whitespace-nowrap">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
