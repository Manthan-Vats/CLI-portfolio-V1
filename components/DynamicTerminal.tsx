import dynamic from 'next/dynamic'
import type { ThemeName, ThemeColors } from "@/contexts/theme-context"

interface TerminalCoreProps {
  currentTheme: ThemeName
  themes: Record<ThemeName, ThemeColors>
  setTheme: (theme: ThemeName) => void
}

const DynamicTerminal = dynamic(() => import('./TerminalCore'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-green-400 font-mono animate-pulse">Loading terminal...</div>
    </div>
  )
})

export default function DynamicTerminalWrapper(props: TerminalCoreProps) {
  return <DynamicTerminal {...props} />
}