import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { DataGrid } from "./components/DataGrid"
import { Toolbar } from "./components/Toolbar"
import { StatusBadge, type StatusType } from "./components/StatusBadge"
import { Integrations } from "./components/Integrations"
import { PrivacyBadge } from "./components/PrivacyBadge"
import "./style.css"

function Sidepanel() {
    const [data, setData] = useState<string[][]>([])
    const [headers, setHeaders] = useState<string[]>([])
    const [status, setStatus] = useState<StatusType | null>(null)
    const [detectedCount, setDetectedCount] = useState<number>(0)
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        const messageListener = (message: any, sender: any, sendResponse: any) => {
            if (message.type === "EXTRACTION_START") {
                setIsProcessing(true)
            } else if (message.type === "TABLE_SELECTED") {
                console.log("Received table data", message.payload)
                setHeaders(message.payload.headers)
                setData(message.payload.data)
                setStatus("CSV")
                setIsProcessing(false)
            } else if (message.type === "SHADOW_SCAN_RESULT") {
                setDetectedCount(message.payload.count)
            }
        }
        chrome.runtime.onMessage.addListener(messageListener)
        // Query active tab to trigger scan
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "TRIGGER_SCAN" }).catch(() => {
                    // Ignore error if content script not ready
                })
            }
        })
        return () => chrome.runtime.onMessage.removeListener(messageListener)
    }, [])

    const handleExport = () => {
        if (data.length === 0) return
        console.log("Exporting...")
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "GridFlow Data")
        XLSX.writeFile(wb, "gridflow_export.xlsx")
    }

    const handleSettings = () => {
        console.log("Open settings")
    }

    return (
        <div className="plasmo-flex plasmo-flex-col plasmo-h-screen plasmo-bg-white plasmo-text-slate-900 dark:plasmo-bg-slate-900 dark:plasmo-text-slate-50">
            <Toolbar onExport={handleExport} onSettings={handleSettings} />

            <div className="plasmo-flex-1 plasmo-overflow-hidden plasmo-flex plasmo-flex-col plasmo-relative">
                {isProcessing && (
                    <div className="plasmo-absolute plasmo-inset-0 plasmo-z-50 plasmo-bg-white/80 dark:plasmo-bg-slate-900/80 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-flex-col plasmo-gap-2">
                        <div className="plasmo-animate-spin plasmo-rounded-full plasmo-h-8 plasmo-w-8 plasmo-border-b-2 plasmo-border-slate-800 dark:plasmo-border-slate-200"></div>
                        <span className="plasmo-text-xs plasmo-font-mono plasmo-text-slate-500">Extracting data...</span>
                    </div>
                )}

                {data.length > 0 ? (
                    <div className="plasmo-flex-1 plasmo-flex plasmo-flex-col">
                        <div className="plasmo-px-2 plasmo-py-1 plasmo-border-b plasmo-border-slate-100 dark:plasmo-border-slate-800 plasmo-flex plasmo-gap-2 plasmo-items-center">
                            <span className="plasmo-text-[10px] plasmo-text-slate-400">Captured Table</span>
                            {status && <StatusBadge status={status} />}
                        </div>
                        <DataGrid data={data} headers={headers} />
                    </div>
                ) : (
                    <div className="plasmo-flex-1 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-flex-col plasmo-p-4">
                        <div className="plasmo-text-xs plasmo-text-slate-500 plasmo-text-center plasmo-mb-2">
                            {detectedCount > 0 ? (
                                <span className="plasmo-font-semibold plasmo-text-slate-700 dark:plasmo-text-slate-300">
                                    {detectedCount} Potential Datasets Found
                                </span>
                            ) : (
                                "No data detected"
                            )}
                        </div>
                        <div className="plasmo-text-[10px] plasmo-text-slate-400 plasmo-text-center plasmo-mb-4">
                            Hover over a table or grid to select it.
                        </div>

                        <PrivacyBadge />
                    </div>
                )}
            </div>
            <Integrations />
        </div>
    )
}

export default Sidepanel
