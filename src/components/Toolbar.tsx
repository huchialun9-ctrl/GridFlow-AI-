import React from "react"


export interface ToolbarProps {
    onExport: () => void
    onSettings: () => void
    isAnonymized: boolean
    onToggleAnonymize: () => void
    onSync: () => void
}

export function Toolbar({ onExport, onSettings, isAnonymized, onToggleAnonymize, onSync }: ToolbarProps) {
    return (
        <div className="plasmo-flex plasmo-items-center plasmo-justify-between plasmo-p-2 plasmo-border-b plasmo-border-slate-100 dark:plasmo-border-slate-800">
            <div className="plasmo-flex plasmo-items-center plasmo-gap-1">
                {/* Sync Button */}
                <button
                    onClick={onSync}
                    className="plasmo-p-1 plasmo-text-slate-400 hover:plasmo-text-blue-600 dark:hover:plasmo-text-blue-400 plasmo-transition-colors"
                    title="Sync to Cloud"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4">
                        <path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            <div className="plasmo-flex plasmo-items-center plasmo-gap-2">
                <span className="plasmo-text-xs plasmo-font-semibold plasmo-text-slate-900 dark:plasmo-text-slate-100">GridFlow</span>

                {/* Anonymize Toggle */}
                <button
                    onClick={onToggleAnonymize}
                    className={`plasmo-flex plasmo-items-center plasmo-gap-1 plasmo-px-1.5 plasmo-py-0.5 plasmo-rounded-full plasmo-text-[8px] plasmo-font-medium plasmo-border ${isAnonymized
                        ? "plasmo-bg-emerald-50 plasmo-text-emerald-600 plasmo-border-emerald-200 dark:plasmo-bg-emerald-900/20 dark:plasmo-border-emerald-800"
                        : "plasmo-bg-slate-50 plasmo-text-slate-400 plasmo-border-slate-200 dark:plasmo-bg-slate-800 dark:plasmo-border-slate-700"
                        } plasmo-transition-all`}
                    title="Toggle Data Anonymization"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-3 plasmo-h-3">
                        <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06l-1.745-1.745a10.029 10.029 0 003.3-4.38 1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3a9.956 9.956 0 00-4.744 1.194L3.28 2.22zM7.752 6.69L9.362 8.3a.75.75 0 101.06-1.06l-1.61-1.61A7.468 7.468 0 019.999 5.5c3.125 0 5.86 1.71 7.214 4.148a7.51 7.51 0 01-2.903 3.39l1.673 1.673A9.95 9.95 0 0017.5 9.5a1.651 1.651 0 000-1.185A10.004 10.004 0 009.999 3c-1.393 0-2.696.3-3.882.836l1.635 1.635zM5.5 10c0 .942.203 1.83.565 2.636l1.295 1.294A2.5 2.5 0 0010 12.5c.783 0 1.503-.274 2.126-.74l1.698 1.698a7.502 7.502 0 01-11.458-3.96 1.65 1.65 0 010-1.185A7.508 7.508 0 015.5 5.25v1.278A8.995 8.995 0 005.5 10zm-1.68-1.55a10.016 10.016 0 005.155 7.026c.219.106.446.2.677.283l1.849 1.849a9.976 9.976 0 01-6.5-1.108 1.65 1.65 0 010-1.185A10.013 10.013 0 013.82 8.45z" clipRule="evenodd" />
                    </svg>
                    {isAnonymized ? "Masked" : "Raw"}
                </button>
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-4 plasmo-h-4">
                        <path fillRule="evenodd" d="M7.84 1.804A1 1 0 018.82 1h2.36a1 1 0 01.98.804l.331 1.652a6.993 6.993 0 011.929 1.115l1.598-.54a1 1 0 011.186.447l1.18 2.044a1 1 0 01-.205 1.251l-1.267 1.113a7.047 7.047 0 010 2.228l1.267 1.113a1 1 0 01.206 1.25l-1.18 2.045a1 1 0 01-1.187.447l-1.598-.54a6.993 6.993 0 01-1.929 1.115l-.33 1.652a1 1 0 01-.98.804H8.82a1 1 0 01-.98-.804l-.331-1.652a6.993 6.993 0 01-1.929-1.115l-1.598.54a1 1 0 01-1.186-.447l-1.18-2.044a1 1 0 01.205-1.251l1.267-1.114a7.047 7.047 0 010-2.228l-1.267-1.113a1 1 0 01-.206-1.25l1.18-2.045a1 1 0 011.187-.447l1.598.54A6.993 6.993 0 017.51 3.456l.33-1.652zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
