import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/theme-context";

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Improve font loading performance
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Manthan Vats — Portfolio",
  description:
    "A unique dual-mode portfolio featuring CLI-style terminal and modern GUI interfaces",
  generator: "v0.dev",
  // Add performance hints
  other: {
    "theme-color": "#282a36",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/images/logo_2.png" type="image/png" />
        {/* Preload Fira Code font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap"
        />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preconnect to important origins */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        {/* Critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body {
              margin: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background-color: #000;
              color: #fff;
            }
            .loading-terminal {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background-color: #000;
              color: #00ff00;
              font-family: monospace;
              font-size: 16px;
            }
          `,
          }}
        />

        {/* Resource hints for better loading */}
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
