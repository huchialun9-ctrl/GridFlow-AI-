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
    // Helper: Check if element is a valid table container with structural pattern detection
    const isValidTable = (el: HTMLElement): boolean => {
      if (el.tagName === 'TABLE') return true

      const role = el.getAttribute('role')
      if (role === 'grid' || role === 'table') return true

      const style = window.getComputedStyle(el)
      if (style.display === 'grid' || style.display === 'table' || style.display === 'inline-grid') return true

      // NEW: Structural Similarity Detection
      // Check if direct children have high similarity in tags/classes
      const children = Array.from(el.children) as HTMLElement[]
      if (children.length > 3) {
        const tagCounts: Record<string, number> = {}
        const classCounts: Record<string, number> = {}
        
        children.slice(0, 10).forEach(child => {
          tagCounts[child.tagName] = (tagCounts[child.tagName] || 0) + 1
          if (child.className && typeof child.className === 'string') {
            classCounts[child.className] = (classCounts[child.className] || 0) + 1
          }
        })

        // If more than 70% of first 10 children share the same tag or class
        const maxTags = Math.max(...Object.values(tagCounts), 0)
        const maxClasses = Math.max(...Object.values(classCounts), 0)
        const sampleSize = Math.min(children.length, 10)
        
        if (maxTags / sampleSize > 0.7 || (maxClasses > 0 && maxClasses / sampleSize > 0.7)) {
          return true
        }
      }

      return false
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
      // 1. Native TABLE handling
      if (element.tagName === 'TABLE') {
        const table = element as HTMLTableElement
        return Array.from(table.rows).map(row =>
          Array.from(row.cells).map(cell => cleanText(cell.innerText))
        )
      }

      // 2. Recursive DOM Parsing for Grids/DIVs
      const children = Array.from(element.children) as HTMLElement[]
      if (children.length === 0) return [[cleanText(element.innerText)]]

      return children.map(rowEl => {
        // Find text-bearing elements or structural columns
        const potentialCols = Array.from(rowEl.querySelectorAll(':scope > *')) as HTMLElement[]
        
        if (potentialCols.length > 1) {
          // Flatten each column to single string
          return potentialCols.map(col => cleanText(col.innerText))
        }

        // Fallback: If row only has one main child, check its children
        const nestedChildren = Array.from(rowEl.children) as HTMLElement[]
        if (nestedChildren.length === 1 && nestedChildren[0].children.length > 1) {
            return Array.from(nestedChildren[0].children).map(c => cleanText((c as HTMLElement).innerText))
        }

        return [cleanText(rowEl.innerText)]
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
