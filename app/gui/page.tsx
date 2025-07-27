"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export default function GuiPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center"
    >
      <div className="text-center text-white">
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            GUI Portfolio
          </h1>
          <p className="text-xl text-gray-300">Modern interface coming soon...</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
            <h2 className="text-2xl font-semibold mb-4">Future Features</h2>
            <ul className="text-left space-y-2 text-gray-300">
              <li>• Interactive project showcase</li>
              <li>• Animated skill visualizations</li>
              <li>• Modern contact forms</li>
              <li>• Responsive design system</li>
              <li>• Dark/Light theme toggle</li>
            </ul>
          </div>

          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors duration-300"
          >
            ← Back to Landing
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
