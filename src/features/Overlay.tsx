import React from "react"
import cssText from "data-text:~/style.css"

export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = cssText
    return style
}

interface OverlayProps {
    rect: DOMRect | null
    visible: boolean
}

export function Overlay({ rect, visible }: OverlayProps) {
    if (!visible || !rect) return null

    // Ensure rect values are valid
    const { top, left, width, height } = rect

    return (
        <div
            style={{
                position: "fixed",
                top: top,
                left: left,
                width: width,
                height: height,
                pointerEvents: "none",
                zIndex: 9999,
                backgroundColor: "rgba(100, 116, 139, 0.25)", // Slate-500 gray mask
                border: "2px solid rgba(100, 116, 139, 0.4)",
                borderRadius: "4px",
                boxShadow: "0 0 0 2px rgba(100, 116, 139, 0.1)",
                transition: "all 0.15s ease-out"
            }}
            className="plasmo-overlay"
        >
            <div className="plasmo-absolute plasmo-top-0 plasmo-right-0 plasmo-mt-2 plasmo-mr-2 plasmo-bg-slate-900 plasmo-text-white plasmo-text-[9px] plasmo-font-bold plasmo-px-2 plasmo-py-1 plasmo-rounded plasmo-shadow-lg plasmo-flex plasmo-items-center plasmo-gap-1.5 plasmo-border plasmo-border-slate-700">
                <div className="plasmo-w-1.5 plasmo-h-1.5 plasmo-rounded-full plasmo-bg-emerald-500 plasmo-animate-pulse"></div>
                PATTERN_DETECTED // EXTRACT
            </div>
        </div>
    )
}
