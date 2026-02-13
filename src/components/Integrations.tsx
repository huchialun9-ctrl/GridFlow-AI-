import React from "react"

export function Integrations() {
    const integrations = [
        { name: "Notion", color: "plasmo-bg-white dark:plasmo-bg-slate-800" },
        { name: "Airtable", color: "plasmo-bg-yellow-400" },
        { name: "Salesforce", color: "plasmo-bg-blue-500" },
        { name: "HubSpot", color: "plasmo-bg-orange-500" }
    ]

    return (
        <div className="plasmo-mt-auto plasmo-pt-4 plasmo-border-t plasmo-border-slate-100 dark:plasmo-border-slate-800">
            <div className="plasmo-flex plasmo-justify-between plasmo-items-center plasmo-mb-2">
                <h3 className="plasmo-text-[10px] plasmo-font-semibold plasmo-text-slate-400 plasmo-uppercase plasmo-tracking-wider">Integrations</h3>
                <span className="plasmo-text-[10px] plasmo-text-slate-300 dark:plasmo-text-slate-600">Coming Soon</span>
            </div>
            <div className="plasmo-flex plasmo-gap-2">
                {integrations.map((app) => (
                    <div
                        key={app.name}
                        className={`plasmo-w-6 plasmo-h-6 plasmo-rounded plasmo-flex plasmo-items-center plasmo-justify-center plasmo-grayscale plasmo-opacity-50 hover:plasmo-grayscale-0 hover:plasmo-opacity-100 plasmo-transition-all plasmo-cursor-not-allowed`}
                        title={`${app.name} (Coming Soon)`}
                    >
                        {/* Placeholder Icon */}
                        <div className={`plasmo-w-full plasmo-h-full plasmo-rounded plasmo-flex plasmo-items-center plasmo-justify-center plasmo-text-[8px] plasmo-font-bold plasmo-text-slate-500 plasmo-bg-slate-100 dark:plasmo-bg-slate-800`}>
                            {app.name[0]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
