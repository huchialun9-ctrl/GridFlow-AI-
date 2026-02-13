import { useEffect, useState } from "react"
import { Overlay } from "./features/Overlay"
import styleText from "data-text:./style.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText
  return style
}

const ContentScript = () => {
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [targetTable, setTargetTable] = useState<HTMLTableElement | null>(null)

  useEffect(() => {
    // Shadow Scraping: Scan on load
    const scanPage = () => {
      const tables = document.querySelectorAll("table")
      const grids = document.querySelectorAll('[role="grid"]')
      const count = tables.length + grids.length

      console.log("Shadow Scan:", count, "potential datasets")

      chrome.runtime.sendMessage({
        type: "SHADOW_SCAN_RESULT",
        payload: { count }
      }).catch(() => {
        // Extension context invalidated or sidepanel closed
      })
    }

    // Scan initially and on DOM changes (debounced)
    scanPage()

    // Listener for trigger
    const messageListener = (msg: any) => {
      if (msg.type === "TRIGGER_SCAN") {
        scanPage()
      }
    }
    chrome.runtime.onMessage.addListener(messageListener)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const table = target.closest("table")

      if (table) {
        const rect = table.getBoundingClientRect()
        setHoveredRect(rect)
        setTargetTable(table)
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setTargetTable(null)
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (targetTable && isVisible) {
        // Prevent default navigation or other actions if desired, but maybe just notify
        e.preventDefault()
        e.stopPropagation()

        console.log("Table selected:", targetTable)

        // Extract data
        const rows = Array.from(targetTable.rows)
        const extractedData = rows.map(row =>
          Array.from(row.cells).map(cell => cell.innerText.trim())
        )
        // Assume first row is header for M1 (simple heuristic)
        const headers = extractedData.length > 0 ? extractedData[0] : []
        const body = extractedData.length > 0 ? extractedData.slice(1) : []

        // Send to Sidepanel
        chrome.runtime.sendMessage({
          type: "TABLE_SELECTED",
          payload: {
            headers,
            data: body
          }
        })
      }
    }

    // Use capture to ensuring we get events
    document.addEventListener("mouseover", handleMouseOver, true)
    document.addEventListener("click", handleClick, true)

    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true)
      document.removeEventListener("click", handleClick, true)
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [targetTable, isVisible])

  return (
    <Overlay rect={hoveredRect} visible={isVisible} />
  )
}

export default ContentScript
