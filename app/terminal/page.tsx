"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import DynamicTerminal from "@/components/DynamicTerminal"

export default function TerminalPage() {
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const { currentTheme, themes, setTheme } = useTheme()

  const handleClose = () => {
    setShowCloseConfirm(true)
  }

  const confirmClose = (confirm: boolean) => {
    setShowCloseConfirm(false)
    if (confirm) {
      window.close()
      // Fallback for browsers that don't allow window.close()
      window.location.href = "about:blank"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-screen bg-black p-4 relative overflow-hidden"
    >
      {/* Mac-style window - Full Screen */}
      <div className="w-full h-full bg-gray-900 rounded-lg border border-gray-700 overflow-hidden flex flex-col relative">
        {/* Mac-style title bar */}
        <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              title="Close"
            />
            <div className="w-3 h-3 bg-yellow-500 rounded-full opacity-50" />
            <div className="w-3 h-3 bg-green-500 rounded-full opacity-50" />
          </div>
          <div className="text-gray-400 text-sm font-mono">Terminal — manthan-portfolio</div>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* Terminal content area - Enhanced for proper sizing */}
        <div className="flex-1 overflow-hidden relative min-h-0">
          <div
            className="w-full h-full relative"
            style={{ backgroundColor: themes[currentTheme].background }}
          >
            <DynamicTerminal 
            currentTheme={currentTheme}
            themes={themes}
            setTheme={setTheme}
            />
          </div>
        </div>
      </div>

      {/* Close confirmation modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-600">
            <h3 className="text-white text-lg mb-4">Close Terminal?</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to close the portfolio?</p>
            <div className="flex space-x-4">
              <button
                onClick={() => confirmClose(true)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Close
              </button>
              <button
                onClick={() => confirmClose(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}