import React from "react"

export function PrivacyBadge() {
    return (
        <div className="plasmo-flex plasmo-items-center plasmo-justify-center plasmo-gap-1 plasmo-mt-4 plasmo-p-2 plasmo-bg-slate-50 dark:plasmo-bg-slate-800/50 plasmo-rounded plasmo-border plasmo-border-slate-100 dark:plasmo-border-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="plasmo-w-3 plasmo-h-3 plasmo-text-slate-400">
                <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.25h.5a.75.75 0 01.75.75v.25h.5a.75.75 0 01.75.75v.25H9v-.25A.75.75 0 019 4.25v-.25h-.5A.75.75 0 018 3.75v-.25h-.5A.75.75 0 017 3.25V3a.75.75 0 01.75-.75h2.5zM7 3.25h.5v.25h.5v.25H7v-.25A.75.75 0 017 3.25zm5.5 1.5h.5v.25h.5v.25h-5v-.25h.5v-.25h.5v-.25h.5v-.25h2.5v.5zM10 1a2 2 0 012 2v1h2.5A1.5 1.5 0 0116 5.5v10a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 15.5v-10A1.5 1.5 0 015.5 4H8V3a2 2 0 012-2z" clipRule="evenodd" />
                <path d="M10 6.5a.75.75 0 01.75.75v.25h.5a.75.75 0 01.75.75v.25h.5a.75.75 0 01.75.75v.75A.75.75 0 0113 10.75v.25h-.5a.75.75 0 01-.75.75v.25h-.5a.75.75 0 01-.75.75v.25h-1a.75.75 0 01-.75-.75v-.25h-.5a.75.75 0 01-.75-.75v-.25h-.5a.75.75 0 01-.75-.75V9.25a.75.75 0 01.75-.75h.5V8.25a.75.75 0 01.75-.75h.5V7.25a.75.75 0 01.75-.75z" />
            </svg>
            <span className="plasmo-text-[10px] plasmo-font-medium plasmo-text-slate-500">
                Local Processing Only
            </span>
        </div>
    )
}
