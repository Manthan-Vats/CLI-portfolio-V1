"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, easeOut } from "framer-motion"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'

// CORRECT: Rely only on next/dynamic for client-side components.
const MatrixAnimation = dynamic(
  () => import("@/components/matrix-animation"),
  { 
    ssr: false,
    // This provides a fallback while the component is loading on the client.
    loading: () => <div className="absolute inset-0 bg-black" />
  }
)

export default function LandingPage() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [hoveredMode, setHoveredMode] = useState<string | null>(null)
  const [typewriterText, setTypewriterText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  
  // REMOVED: The [isClient, setIsClient] state is no longer needed.

  const fullText = "Welcome, Developer."

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypewriterText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, 100)

    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)

    return () => {
      clearInterval(timer)
      clearInterval(cursorTimer)
    }
  }, []) // The dependency array is now empty.

  const handleModeSelect = (mode: "terminal" | "gui") => {
    setSelectedMode(mode)
    setTimeout(() => {
      if (mode === "gui") {
        window.open("https://your-gui-portfolio.com", "_blank")
      } else {
        router.push("/terminal") // Using router.push is slightly better for Next.js navigation
      }
    }, 1000)
  }

  // REMOVED: The `if (!isClient)` block is gone.
  // The component now returns the main JSX directly.

  // ... (the rest of your containerVariants, itemVariants, splitVariants remain the same)
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 }}, exit: { opacity: 0, transition: { duration: 0.5 }}}
  const itemVariants = { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: easeOut }}}
  const splitVariants = { terminal: { x: hoveredMode === "terminal" ? -20 : 0, scale: hoveredMode === "terminal" ? 1.05 : 1, transition: { duration: 0.3, ease: easeOut }}, gui: { x: hoveredMode === "gui" ? 20 : 0, scale: hoveredMode === "gui" ? 1.05 : 1, transition: { duration: 0.3, ease: easeOut }}}

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      <MatrixAnimation />
      
      {/* ... (the rest of your JSX for the landing page remains identical) ... */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-50" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,0,0.03) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0,255,0,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <AnimatePresence mode="wait">
        {!selectedMode ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
          >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="text-center mb-16">
              <motion.div className="text-2xl md:text-3xl font-mono mb-4 text-green-300">
                {typewriterText}
                <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>|</span>
              </motion.div>
              
              <motion.h1
                variants={itemVariants}
                className="text-7xl md:text-9xl font-mono font-bold mb-6 bg-gradient-to-r from-green-400 via-green-300 to-cyan-400 bg-clip-text text-transparent"
              >
                MANTHAN
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
              >
                Full-Stack Developer & Creative Technologist
                <br />
                <span className="text-green-400">Choose your preferred interface experience</span>
              </motion.p>
            </motion.div>

            {/* Split Interface Selection */}
            <motion.div 
              variants={itemVariants}
              className="w-full max-w-6xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-8 md:gap-4">
                
                {/* Terminal Mode */}
                <motion.div
                  variants={splitVariants}
                  animate="terminal"
                  className="relative group"
                  onMouseEnter={() => setHoveredMode("terminal")}
                  onMouseLeave={() => setHoveredMode(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  
                  <motion.div
                    className="relative bg-gray-900/50 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 h-96 flex flex-col justify-between overflow-hidden group-hover:border-green-400/50 transition-all duration-300"
                    whileHover={{ y: -10 }}
                  >
                    {/* Terminal Preview */}
                    <div className="flex-1 mb-6">
                      <div className="flex items-center mb-4">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="ml-4 text-sm text-gray-400">terminal</div>
                      </div>
                      
                      <div className="font-mono text-sm space-y-2 text-green-400">
                        <div>$ whoami</div>
                        <div className="text-cyan-400">manthan@developer</div>
                        <div>$ ls skills/</div>
                        <div className="text-gray-300">react/ node/ python/ docker/</div>
                        <div>$ portfolio --interactive</div>
                        <div className="text-green-300">Loading CLI experience...</div>
                      </div>
                    </div>

                    <div className="text-center">
                      <motion.button
                        onClick={() => handleModeSelect("terminal")}
                        className="w-full py-4 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white font-mono text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="mr-2">$</span>
                        Enter Terminal Mode
                      </motion.button>
                      
                      <p className="text-xs text-gray-400 mt-3">
                        For developers who speak CLI
                      </p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* GUI Mode */}
                <motion.div
                  variants={splitVariants}
                  animate="gui"
                  className="relative group"
                  onMouseEnter={() => setHoveredMode("gui")}
                  onMouseLeave={() => setHoveredMode(null)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  
                  <motion.div
                    className="relative bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 h-96 flex flex-col justify-between overflow-hidden group-hover:border-blue-400/50 transition-all duration-300"
                    whileHover={{ y: -10 }}
                  >
                    {/* GUI Preview */}
                    <div className="flex-1 mb-6">
                      <div className="flex items-center mb-4">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="ml-4 text-sm text-gray-400">portfolio.dev</div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center px-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full mr-3"></div>
                          <div className="text-sm text-gray-300">Manthan - Full Stack Developer</div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-16 bg-gray-800/50 rounded-lg border border-gray-700/50"></div>
                          <div className="h-16 bg-gray-800/50 rounded-lg border border-gray-700/50"></div>
                          <div className="h-16 bg-gray-800/50 rounded-lg border border-gray-700/50"></div>
                        </div>
                        
                        <div className="h-4 bg-gray-800/30 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-800/30 rounded w-1/2"></div>
                      </div>
                    </div>

                    <div className="text-center">
                      <motion.button
                        onClick={() => handleModeSelect("gui")}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-mono text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        → Enter GUI Portfolio
                      </motion.button>
                      
                      <p className="text-xs text-gray-400 mt-3">
                        Traditional visual experience
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div 
              variants={itemVariants}
              className="mt-16 text-center text-gray-500 font-mono text-sm"
            >
              <p>Built with ❤️, ☕, and late-night coding sessions</p>
              <div className="flex justify-center space-x-6 mt-4">
                <span className="hover:text-green-400 transition-colors cursor-pointer">GitHub</span>
                <span className="hover:text-blue-400 transition-colors cursor-pointer">LinkedIn</span>
                <span className="hover:text-purple-400 transition-colors cursor-pointer">Twitter</span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="relative z-10 min-h-screen flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                className="text-4xl font-mono mb-8 text-green-300"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {selectedMode === "terminal" ? ">" : "→"} Initializing {selectedMode === "terminal" ? "Terminal" : "GUI"} Interface...
              </motion.div>
              
              <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden">
                <motion.div
                  className={`h-full ${selectedMode === "terminal" ? "bg-gradient-to-r from-green-500 to-cyan-500" : "bg-gradient-to-r from-blue-500 to-purple-500"} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}