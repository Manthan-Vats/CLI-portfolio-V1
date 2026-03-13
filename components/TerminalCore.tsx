"use client"
import "@xterm/xterm/css/xterm.css"

import { useEffect, useRef, useCallback } from "react"
import { Terminal } from "@xterm/xterm"
import { FitAddon } from "@xterm/addon-fit"
import { CommandProcessor } from "@/lib/command-processor"
import type { ThemeName, ThemeColors } from "@/contexts/theme-context"

interface TerminalCoreProps {
  currentTheme: ThemeName
  themes: Record<ThemeName, ThemeColors>
  setTheme: (theme: ThemeName) => void
}

export default function TerminalCore({ currentTheme, themes, setTheme }: TerminalCoreProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const terminalInstance = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const isInitialized = useRef(false)

  // Debounced fit function with enhanced error handling
  const debouncedFit = useCallback(() => {
    if (fitAddonRef.current && terminalInstance.current) {
      // Check if terminal is properly mounted and services are available
      const terminalElement = terminalRef.current
  if (terminalElement && 
    terminalElement.offsetWidth > 0 && 
    terminalElement.offsetHeight > 0 &&
    (terminalInstance.current as any)._core &&
    (terminalInstance.current as any)._core._renderService) {
        try {
          fitAddonRef.current.fit()
        } catch (error) {
          // Silently handle the specific dimension error that occurs during initialization
          if (!(error instanceof Error) || !error.message?.includes('dimensions')) {
            console.warn('Fit addon error (ignored):', error)
          }
        }
      }
    }
  }, [])

  useEffect(() => {
    // Exit if the component isn't mounted or the terminal is already initialized.
    if (!terminalRef.current || isInitialized.current || terminalInstance.current) {
      return
    }

    // Additional check for React StrictMode double mounting
    const container = terminalRef.current
    if (!container || container.children.length > 0) {
      return
    }

    const term = new Terminal({
      theme: {
        ...themes[currentTheme],
        foreground: themes[currentTheme].brightWhite,
        background: themes[currentTheme].background,
        cursor: themes[currentTheme].brightWhite,
        cursorAccent: themes[currentTheme].background,
        selectionBackground: themes[currentTheme].selectionBackground,
      },
      fontFamily: "SF Mono, Monaco, Consolas, monospace",
      fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? 11 : 14,
      lineHeight: 1.4,
      cursorBlink: true,
      allowTransparency: true,
      scrollback: 1000,
      convertEol: true,
      letterSpacing: 0.2,
      fontWeight: "bold",
      fontWeightBold: "900",
    })
    
    terminalInstance.current = term
    isInitialized.current = true

    const fitAddon = new FitAddon()
    fitAddonRef.current = fitAddon
    term.loadAddon(fitAddon)

    // Open terminal first
    term.open(terminalRef.current)
    term.focus()

    // Use IntersectionObserver to ensure the terminal is actually visible before fitting
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          // Terminal is visible, safe to fit
          setTimeout(() => {
            if (fitAddonRef.current && terminalInstance.current) {
              try {
                // Double-check dimensions exist before fitting
                const terminalElement = terminalRef.current
                if (terminalElement && 
                terminalElement.offsetWidth > 0 && 
                terminalElement.offsetHeight > 0 &&
                (terminalInstance.current as any)._core &&
                (terminalInstance.current as any)._core._renderService) {
                  fitAddonRef.current.fit()
                }
              } catch (error) {
                // Silently handle the specific dimension error
                if (!(error instanceof Error) || !error.message?.includes('dimensions')) {
                  console.warn('Fit addon error (ignored):', error)
                }
              }
            }
          }, 100)
          observer.disconnect()
        }
      })
    }, { threshold: 0.1 })

    if (terminalRef.current) {
      observer.observe(terminalRef.current)
    }

    const commandProcessor = new CommandProcessor(term, setTheme, () => currentTheme)

    const displayPrompt = () => {
      term.write("\x1b[1;32mvisitor@manthan-portfolio.vercel.app\x1b[0m:\x1b[1;34m~\x1b[0m$ ")
    }
    
    // We call the `clear` command's logic directly to show the welcome screen
    commandProcessor.processCommand("clear")
    displayPrompt()

    // --- Optimized Input Handling to Reduce Flickering ---
    let inputBuffer = ""
    let cursorPosition = 0
    const commandHistory: string[] = []
    let historyIndex = -1

    // Optimized redraw function - only redraws when necessary
    const redrawInputLine = () => {
      // Use more efficient cursor positioning to reduce flickering
      term.write("\r\x1b[K") // Return to beginning and clear line
      displayPrompt()
      term.write(inputBuffer)
      
      // Calculate cursor position more efficiently
      const moveBack = inputBuffer.length - cursorPosition
      if (moveBack > 0) {
        term.write(`\x1b[${moveBack}D`)
      }
    }

    // Optimized character insertion to reduce flickering
    const insertCharacter = (char: string) => {
      if (cursorPosition === inputBuffer.length) {
        // Simple append case - no need for full redraw
        inputBuffer += char
        cursorPosition++
        term.write(char)
      } else {
        // Insert in middle - need redraw but optimized
        inputBuffer = inputBuffer.slice(0, cursorPosition) + char + inputBuffer.slice(cursorPosition)
        cursorPosition++
        redrawInputLine()
      }
    }

    term.onData((data) => {
      const code = data.charCodeAt(0)

      switch (data) {
        case "\r": // Enter
          term.write("\r\n")
          if (inputBuffer.trim()) {
            commandHistory.push(inputBuffer)
            commandProcessor.processCommand(inputBuffer)
          }
          inputBuffer = ""
          cursorPosition = 0
          historyIndex = -1
          displayPrompt()
          break
        
          case "\x7F": // Backspace
          if (cursorPosition > 0) {
            if (cursorPosition === inputBuffer.length) {
              // Simple backspace at end - no need for full redraw
              inputBuffer = inputBuffer.slice(0, -1)
              cursorPosition--
              term.write("\b \b") // Move back, write space, move back again
            } else {
              // Backspace in middle - need redraw
              inputBuffer = inputBuffer.slice(0, cursorPosition - 1) + inputBuffer.slice(cursorPosition)
              cursorPosition--
              redrawInputLine()
            }
          }
          break

        case "\x1b[A": // Up arrow
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++
            inputBuffer = commandHistory[commandHistory.length - 1 - historyIndex]
            cursorPosition = inputBuffer.length
            redrawInputLine()
          }
          break

        case "\x1b[B": // Down arrow
           if (historyIndex > 0) {
            historyIndex--
            inputBuffer = commandHistory[commandHistory.length - 1 - historyIndex]
            cursorPosition = inputBuffer.length
            redrawInputLine()
          } else {
            historyIndex = -1
            inputBuffer = ""
            cursorPosition = 0
            redrawInputLine()
          }
          break

        case "\x1b[C": // Right arrow
          if (cursorPosition < inputBuffer.length) {
            cursorPosition++
            term.write(data)
          }
          break

        case "\x1b[D": // Left arrow
          if (cursorPosition > 0) {
            cursorPosition--
            term.write(data)
          }
          break
        
        case "\t": // Tab
          const suggestions = commandProcessor.getAutocompleteSuggestions(inputBuffer);
          if (suggestions.length === 1) {
            inputBuffer = suggestions[0] + ' '; // Add space for convenience
            cursorPosition = inputBuffer.length;
            redrawInputLine();
          } else if (suggestions.length > 1) {
            term.write('\r\n' + suggestions.join('  ') + '\r\n');
            displayPrompt();
            term.write(inputBuffer);
          }
          break;

        default: // Printable characters - use optimized insertion
          if (code >= 32 && code <= 126) {
            insertCharacter(data)
          }
      }
    })

    // Enhanced resize handler with debouncing
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        debouncedFit()
      }, 100)
    }
    
    window.addEventListener("resize", handleResize)

    return () => {
      observer?.disconnect()
      clearTimeout(resizeTimeout)
      window.removeEventListener("resize", handleResize)
      isInitialized.current = false
      if (terminalInstance.current) {
        try {
          terminalInstance.current.dispose()
        } catch (error) {
          // Ignore disposal errors
        }
        terminalInstance.current = null
      }
      fitAddonRef.current = null
    }
  }, [debouncedFit, currentTheme, themes, setTheme]) // Added dependencies for proper effect management

  // This separate effect handles theme changes after the initial load.
  useEffect(() => {
    if (terminalInstance.current && isInitialized.current) {
      terminalInstance.current.options.theme = {
        ...themes[currentTheme],
        foreground: themes[currentTheme].brightWhite,
        background: themes[currentTheme].background,
        cursor: themes[currentTheme].brightWhite,
        cursorAccent: themes[currentTheme].background,
        selectionBackground: themes[currentTheme].selectionBackground,
      }
    }
  }, [currentTheme, themes])

  return (
    <div
      ref={terminalRef}
      className="w-full h-full overflow-x-hidden"
      style={{ minHeight: '100%', minWidth: '100%' }}
    />
  )
}