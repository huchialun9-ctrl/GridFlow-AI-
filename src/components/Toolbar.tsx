import React from "react"


interface ToolbarProps {
    onExport: () => void
    onSettings: () => void
}

export function Toolbar({ onExport, onSettings }: ToolbarProps) {
    return (
        <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-p-2 plasmo-border-b plasmo-border-slate-100 dark:plasmo-border-slate-800">
            <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                {/* Title or specific tools could go here */}
                <span className="plasmo-text-xs plasmo-font-semibold plasmo-text-slate-900 dark:plasmo-text-slate-100">GridFlow</span>
            </div>
            <div className="plasmo-flex plasmo-items-center plasmo-gap-1">
                <button
                    onClick={onExport}
                    className="plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-px-2 plasmo-py-1 plasmo-bg-slate-900 hover:plasmo-bg-slate-800 plasmo-text-white plasmo-text-[10px] plasmo-font-medium plasmo-rounded plasmo-transition-colors"
                >
                    <span>Export</span>
                </button>
                <button
                    onClick={onSettings}
                    className="plasmo-p-1 plasmo-text-slate-400 hover:plasmo-text-slate-600 dark:hover:plasmo-text-slate-200 plasmo-transition-colors"
                >
                    {/* Simple Gear Icon - Using Heroicons SVG directly if package not installed, or import if available. 
              Checking package.json, heroicons not installed. I will use SVG directly for M1 to avoid deps. */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4">
                        <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.047 7.047 0 010-2.228l-1.267-1.113a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
