import { useEffect, useState } from "react"
import * as XLSX from "xlsx"
import { DataGrid } from "./components/DataGrid"
import { Toolbar } from "./components/Toolbar"
import { StatusBadge, type StatusType } from "./components/StatusBadge"
import "./style.css"

function Sidepanel() {
    const [data, setData] = useState<string[][]>([])
    const [headers, setHeaders] = useState<string[]>([])
    const [status, setStatus] = useState<StatusType | null>(null)

    useEffect(() => {
        const messageListener = (message: any, sender: any, sendResponse: any) => {
            if (message.type === "TABLE_SELECTED") {
                console.log("Received table data", message.payload)
                setHeaders(message.payload.headers)
                setData(message.payload.data)
                setStatus("CSV")
            }
        }
        chrome.runtime.onMessage.addListener(messageListener)
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

            <div className="plasmo-flex-1 plasmo-overflow-hidden plasmo-flex plasmo-flex-col">
                {data.length > 0 ? (
                    <div className="plasmo-flex-1 plasmo-flex plasmo-flex-col">
                        <div className="plasmo-px-2 plasmo-py-1 plasmo-border-b plasmo-border-slate-100 dark:plasmo-border-slate-800 plasmo-flex plasmo-gap-2 plasmo-items-center">
                            <span className="plasmo-text-[10px] plasmo-text-slate-400">Captured Table</span>
                            {status && <StatusBadge status={status} />}
                        </div>
                        <DataGrid data={data} headers={headers} />
                    </div>
                ) : (
                    <div className="plasmo-flex-1 plasmo-flex plasmo-items-center plasmo-justify-center plasmo-flex-col plasmo-gap-2 plasmo-p-4">
                        <div className="plasmo-text-xs plasmo-text-slate-500 plasmo-text-center">
                            No table detected. <br />
                            Hover over a table on the webpage.
                        </div>
                        {/* Mock button for dev testing */}
                        <button
                            onClick={() => {
                                setHeaders(["Column A", "Column B", "Price"])
                                setData([["Item 1", "Desc 1", "$10"], ["Item 2", "Desc 2", "$20"], ["Item 3", "Desc 3", "$30"]])
                                setStatus("CSV")
                            }}
                            className="plasmo-mt-4 plasmo-text-[10px] plasmo-text-blue-500 hover:plasmo-underline"
                        >
                            Load Mock Data
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sidepanel
