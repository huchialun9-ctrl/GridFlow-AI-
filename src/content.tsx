import { useEffect, useState } from "react"
import { Overlay } from "./features/Overlay"
import styleText from "data-text:~/style.css"
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
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null)

  useEffect(() => {
    // Helper: Check if element is a valid table container
    const isValidTable = (el: HTMLElement): boolean => {
      if (el.tagName === 'TABLE') return true

      const role = el.getAttribute('role')
      if (role === 'grid' || role === 'table') return true

      // Advanced Heuristic: Computed Style
      // We check this last as it forces layout reflow (expensive)
      // But user explicitly requested it for modern grids
      const style = window.getComputedStyle(el)
      return style.display === 'grid' ||
        style.display === 'table' ||
        style.display === 'inline-grid' ||
        style.display === 'inline-table'
    }

    // Helper: Validate minimum row limit (Advanced Refinement)
    const hasEnoughRows = (el: HTMLElement): boolean => {
      // For TABLE
      if (el.tagName === 'TABLE') {
        return (el as HTMLTableElement).rows.length > 2
      }

      // For Grid/Div, count direct children that look like items
      // Heuristic: Direct children count
      return el.children.length > 2
    }

    // Helper: Deep Clean (Advanced Refinement)
    const cleanText = (text: string) => {
      // 1. Replace newlines with space
      // 2. Remove zero-width chars (user request: \u200B-\u200D\uFEFF)
      // 3. Trim
      return text.replace(/[\n\r]+/g, ' ')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim()
    }

    // Shadow Scraping: Scan on load
    const scanPage = () => {
      const tables = document.querySelectorAll("table")
      const grids = document.querySelectorAll('[role="grid"], [role="table"]')
      // Note: We can't query computed style efficiently for shadow scan without killing FPS
      // So we sticking to explicit tags/roles + maybe a few common classes for background scan
      const count = tables.length + grids.length

      console.log("Shadow Scan:", count, "potential datasets")

      chrome.runtime.sendMessage({
        type: "SHADOW_SCAN_RESULT",
        payload: { count }
      }).catch(() => { })
    }

    scanPage()

    const messageListener = (msg: any) => {
      if (msg.type === "TRIGGER_SCAN") {
        scanPage()
      }
    }
    chrome.runtime.onMessage.addListener(messageListener)

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Traverse up
      let current: HTMLElement | null = target
      let found: HTMLElement | null = null

      for (let i = 0; i < 5; i++) {
        if (!current || current === document.body) break

        if (isValidTable(current)) {
          // Added Validation: Min Row Limit
          if (hasEnoughRows(current)) {
            found = current
            break
          }
        }
        current = current.parentElement
      }

      if (found) {
        const rect = found.getBoundingClientRect()
        if (rect.width > 20 && rect.height > 20) {
          setHoveredRect(rect)
          setTargetElement(found)
          setIsVisible(true)
          return
        }
      }

      setIsVisible(false)
      setTargetElement(null)
    }

    const extractTableData = (element: HTMLElement): string[][] => {
      if (element.tagName === 'TABLE') {
        const table = element as HTMLTableElement
        return Array.from(table.rows).map(row =>
          Array.from(row.cells).map(cell => cleanText(cell.innerText))
        )
      }

      // Grid/Div Extraction
      const children = Array.from(element.children) as HTMLElement[]
      if (children.length === 0) return []

      return children.map(child => {
        // Check if child has structure (columns)
        // Heuristic: If child has >1 children, treat those as columns
        const cols = Array.from(child.children) as HTMLElement[]
        if (cols.length > 1) {
          return cols.map(col => cleanText(col.innerText))
        }
        // Fallback: single column row
        return [cleanText(child.innerText)]
      })
    }

    const handleClick = (e: MouseEvent) => {
      if (targetElement && isVisible) {
        e.preventDefault()
        e.stopPropagation()

        console.log("Element selected:", targetElement)

        // Signal loading state (M1 Refinement)
        chrome.runtime.sendMessage({ type: "EXTRACTION_START" })

        // Small timeout to allow UI to show loading
        setTimeout(() => {
          const data = extractTableData(targetElement)
          const headers = data.length > 0 ? data[0] : []
          const body = data.length > 0 ? data.slice(1) : []

          chrome.runtime.sendMessage({
            type: "TABLE_SELECTED",
            payload: {
              headers,
              data: body
            }
          })
        }, 50)
      }
    }

    document.addEventListener("mouseover", handleMouseOver, true)
    document.addEventListener("click", handleClick, true)

    return () => {
      document.removeEventListener("mouseover", handleMouseOver, true)
      document.removeEventListener("click", handleClick, true)
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [targetElement, isVisible])

  return (
    <Overlay rect={hoveredRect} visible={isVisible} />
  )
}

export default ContentScript
