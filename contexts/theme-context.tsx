"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type ThemeName = "evil" | "dracula" | "gruvbox" | "nord"

export interface ThemeColors {
  background: string
  foreground: string
  cursor: string
  cursorAccent: string
  selectionBackground: string
  black: string
  red: string
  green: string
  yellow: string
  blue: string
  magenta: string
  cyan: string
  white: string
  brightBlack: string
  brightRed: string
  brightGreen: string
  brightYellow: string
  brightBlue: string
  brightMagenta: string
  brightCyan: string
  brightWhite: string
}

const themes: Record<ThemeName, ThemeColors> = {
  evil: {
    background: "#000000",
    foreground: "#ffffff",
    cursor: "#841b1b",
    cursorAccent: "#000000",
    selectionBackground: "#413737",
    black: "#000000",
    red: "#841b1b",
    green: "#0d3218",
    yellow: "#841b1b",
    blue: "#0d3218",
    magenta: "#841b1b",
    cyan: "#0d3218",
    white: "#ffffff",
    brightBlack: "#413737",
    brightRed: "#841b1b",
    brightGreen: "#0d3218",
    brightYellow: "#841b1b",
    brightBlue: "#0d3218",
    brightMagenta: "#841b1b",
    brightCyan: "#0d3218",
    brightWhite: "#ffffff",
  },
  dracula: {
    background: "#282a36",
    foreground: "#f8f8f2",
    cursor: "#f8f8f2",
    cursorAccent: "#282a36",
    selectionBackground: "#44475a",
    black: "#21222c",
    red: "#ff5555",
    green: "#50fa7b",
    yellow: "#f1fa8c",
    blue: "#bd93f9",
    magenta: "#ff79c6",
    cyan: "#8be9fd",
    white: "#f8f8f2",
    brightBlack: "#6272a4",
    brightRed: "#ff6e6e",
    brightGreen: "#69ff94",
    brightYellow: "#ffffa5",
    brightBlue: "#d6acff",
    brightMagenta: "#ff92df",
    brightCyan: "#a4ffff",
    brightWhite: "#ffffff",
  },
  gruvbox: {
    background: "#282828",
    foreground: "#ebdbb2",
    cursor: "#ebdbb2",
    cursorAccent: "#282828",
    selectionBackground: "#3c3836",
    black: "#282828",
    red: "#cc241d",
    green: "#98971a",
    yellow: "#d79921",
    blue: "#458588",
    magenta: "#b16286",
    cyan: "#689d6a",
    white: "#a89984",
    brightBlack: "#928374",
    brightRed: "#fb4934",
    brightGreen: "#b8bb26",
    brightYellow: "#fabd2f",
    brightBlue: "#83a598",
    brightMagenta: "#d3869b",
    brightCyan: "#8ec07c",
    brightWhite: "#ebdbb2",
  },
  nord: {
    background: "#2e3440",
    foreground: "#d8dee9",
    cursor: "#d8dee9",
    cursorAccent: "#2e3440",
    selectionBackground: "#4c566a",
    black: "#3b4252",
    red: "#bf616a",
    green: "#a3be8c",
    yellow: "#ebcb8b",
    blue: "#81a1c1",
    magenta: "#b48ead",
    cyan: "#88c0d0",
    white: "#e5e9f0",
    brightBlack: "#4c566a",
    brightRed: "#bf616a",
    brightGreen: "#a3be8c",
    brightYellow: "#ebcb8b",
    brightBlue: "#81a1c1",
    brightMagenta: "#b48ead",
    brightCyan: "#8fbcbb",
    brightWhite: "#eceff4",
  },
}

interface ThemeContextType {
  currentTheme: ThemeName
  setTheme: (theme: ThemeName) => void
  themes: Record<ThemeName, ThemeColors>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Helper to get initial theme without causing re-renders
const getInitialTheme = (): ThemeName => {
  if (typeof window === 'undefined') return "dracula" // SSR safety
  
  const savedTheme = localStorage.getItem("terminal-theme") as ThemeName
  if (savedTheme && themes[savedTheme]) {
    return savedTheme
  }
  return "dracula"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize with the correct theme immediately, no re-render needed
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(getInitialTheme)

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme)

    // Update CSS variables for theme
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      const themeColors = themes[theme]

      Object.entries(themeColors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value)
      })

      // Save theme preference
      localStorage.setItem("terminal-theme", theme)
    }
  }

  // Apply initial theme CSS variables on mount (no state change)
  useEffect(() => {
    const themeColors = themes[currentTheme]
    const root = document.documentElement

    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value)
    })
  }, []) // Empty dependency array - only run once

  return <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}