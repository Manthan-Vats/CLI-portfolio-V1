import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Improve font loading performance
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "MANTHAN - Dual Mode Portfolio",
  description: "A unique dual-mode portfolio featuring CLI-style terminal and modern GUI interfaces",
  generator: 'v0.dev',
  // Add performance hints
  other: {
    'theme-color': '#282a36',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}