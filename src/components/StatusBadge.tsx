import React from "react"

export type StatusType = "CSV" | "Cleaned" | "Processing"

interface StatusBadgeProps {
    status: StatusType
}

const statusConfig: Record<StatusType, { bg: string; text: string }> = {
    CSV: { bg: "plasmo-bg-slate-100 dark:plasmo-bg-slate-800", text: "plasmo-text-slate-600 dark:plasmo-text-slate-400" },
    Cleaned: { bg: "plasmo-bg-emerald-50 dark:plasmo-bg-emerald-900/20", text: "plasmo-text-emerald-600 dark:plasmo-text-emerald-400" },
    Processing: { bg: "plasmo-bg-amber-50 dark:plasmo-bg-amber-900/20", text: "plasmo-text-amber-600 dark:plasmo-text-amber-400" }
}

export function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status]
    return (
        <span className={`plasmo-px-1.5 plasmo-py-0.5 plasmo-text-[10px] plasmo-font-mono plasmo-rounded ${config.bg} ${config.text}`}>
            [{status.toUpperCase()}]
        </span>
    )
}
