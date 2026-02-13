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
                position: "fixed", // or absolute depending on context, usually fixed relative to viewport if using Overlay in ShadowDOM
                top: top,
                left: left,
                width: width,
                height: height,
                pointerEvents: "none", // Allow clicks to pass through to the element, or 'auto' if we want to capture click
                zIndex: 9999,
                backgroundColor: "rgba(148, 163, 184, 0.2)", // slate-400 with opacity
                border: "1px solid rgba(148, 163, 184, 0.5)",
                transition: "all 0.1s ease-out"
            }}
            className="plasmo-overlay"
        >
            <div className="plasmo-absolute plasmo-bottom-full plasmo-left-0 plasmo-mb-1 plasmo-bg-slate-800 plasmo-text-white plasmo-text-[10px] plasmo-px-1.5 plasmo-py-0.5 plasmo-rounded plasmo-shadow-sm">
                Select Table
            </div>
        </div>
    )
}
