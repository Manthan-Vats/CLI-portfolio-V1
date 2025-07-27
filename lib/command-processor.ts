import type { Terminal } from "@xterm/xterm"
import { TypingGame } from "./typing-game"
import { portfolioData } from "./portfolio-data"
import type { ThemeName } from "@/contexts/theme-context"

export class CommandProcessor {
  private terminal: Terminal
  private typingGame: TypingGame
  private commandHistory: string[] = []
  private setTheme: (theme: ThemeName) => void
  private getCurrentTheme: () => ThemeName

  constructor(terminal: Terminal, setTheme: (theme: ThemeName) => void, getCurrentTheme: () => ThemeName) {
    this.terminal = terminal
    this.typingGame = new TypingGame(terminal)
    this.setTheme = setTheme
    this.getCurrentTheme = getCurrentTheme
  }

  processCommand(input: string) {
    const trimmed = input.trim()
    if (!trimmed) return

    this.commandHistory.push(trimmed)

    // Check if it's a math expression
    if (this.isMathExpression(trimmed)) {
      this.handleMath(trimmed)
      return
    }

    const [command, ...args] = trimmed.split(" ")
    const cmd = command.toLowerCase()

    switch (cmd) {
      case "clear":
        this.handleClear()
        break
      case "help":
        this.handleHelp()
        break
      case "history":
        this.handleHistory(args)
        break
      case "pwd":
        this.handlePwd()
        break
      case "about":
        this.handleAbout()
        break
      case "skills":
        this.handleSkills()
        break
      case "projects":
        this.handleProjectsList()
        break
      case "project":
        this.handleProject(args)
        break
      case "resume":
        this.handleResume()
        break
      case "updates":
      case "activity":
        this.handleUpdates()
        break
      case "education":
        this.handleEducation()
        break
      case "typinggame":
      case "type":
        this.handleTypingGame(args)
        break
      case "themes":
        this.handleThemes(args)
        break
      case "switchgui":
        this.handleSwitchGui()
        break
      case "contact":
        this.handleContact(args)
        break
      case "email":
        this.handleEmail()
        break
      case "codeforces":
        this.handleCodeforces()
        break
      case "leetcode":
        this.handleLeetcode()
        break
      case "welcome":
        this.handleWelcome()
        break
      default:
        this.terminal.write(`\x1b[31mCommand not found: ${command}\x1b[0m\r\n`)
        this.terminal.write("Type 'help' for available commands.\r\n")
    }
  }

  private isMathExpression(input: string): boolean {
    return /^[\d\s+\-*/().]+$/.test(input) && /[\d]/.test(input)
  }

  private handleMath(expression: string) {
    try {
      // Simple math evaluation (safe for basic operations)
      const result = Function('"use strict"; return (' + expression + ")")()
      this.terminal.write(`\x1b[1;33m${result}\x1b[0m\r\n`)
    } catch (error) {
      this.terminal.write(`\x1b[1;31mInvalid expression\x1b[0m\r\n`)
    }
  }

  private handleClear() {
    // Clear screen completely and reset to initial state
    this.terminal.write("\x1b[2J\x1b[H")
    // Clear command history for this session display
    this.terminal.clear()
    // Display fresh header as if starting from beginning
    this.displayHeader()

  }

  private handleWelcome() {
    // Just display the header without clearing
    this.terminal.write("\r\n")
    this.displayHeader()

  }

  private displayHeader() {
    const currentTheme = this.getCurrentTheme()

    // Enhanced welcome message with theme-specific colors
    this.terminal.write("\r\n")
    this.terminal.write("\x1b[1;32mWelcome Visitor\x1b[0m\r\n\r\n")
    this.terminal.write("\x1b[1;36mHi :) I'm\x1b[0m\r\n\r\n")

    // Get theme-specific color for ASCII art
    const themeColorCode = this.getThemeColorCode(currentTheme)

    // Display MANTHAN ASCII art (no text reference to image)
    this.displayManthanAscii(themeColorCode)

    // Enhanced spacing and greeting
    this.terminal.write("\r\n")
    this.terminal.write("\x1b[1;37m Welcome to the matrix of my portfolio! Ready to dive deep? \x1b[0m\r\n")
    this.terminal.write("\x1b[1;33m ---x---x---x---\x1b[0m\r\n\r\n")
    this.terminal.write("\x1b[1;37m Type 'help' to unlock the secrets of available commands \x1b[0m\r\n")
    this.terminal.write("\x1b[1;33m ---x---x---x---\x1b[0m\r\n\r\n")

    // Add spacing
    for (let i = 0; i < 2; i++) {
      this.terminal.write("\r\n")
    }
  }

  private displayManthanAscii(themeColorCode: string) {
    // MANTHAN ASCII Art
    const manthanAsciiLines = [
      "███╗   ███╗ █████╗ ███╗   ██╗████████╗██╗  ██╗ █████╗ ███╗   ██╗",
      "████╗ ████║██╔══██╗████╗  ██║╚══██╔══╝██║  ██║██╔══██╗████╗  ██║",
      "██╔████╔██║███████║██╔██╗ ██║   ██║   ███████║███████║██╔██╗ ██║",
      "██║╚██╔╝██║██╔══██║██║╚██╗██║   ██║   ██╔══██║██╔══██║██║╚██╗██║",
      "██║ ╚═╝ ██║██║  ██║██║ ╚████║   ██║   ██║  ██║██║  ██║██║ ╚████║",
      "╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝",
    ]

    // Display MANTHAN ASCII art
    manthanAsciiLines.forEach((line) => {
      this.terminal.write(`\x1b[1;${themeColorCode}m${line}\x1b[0m\r\n`)
    })
  }

  private getThemeColorCode(theme: ThemeName): string {
    switch (theme) {
      case "evil":
        return "31;1" // Red color code for evil theme
      case "dracula":
        return "35;1" // Bright Magenta for dracula
      case "gruvbox":
        return "33;1" // Bright Yellow for gruvbox
      case "nord":
        return "36;1" // Bright Cyan for nord
      default:
        return "35;1"
    }
  }

  private handleHelp() {
    const commands = [
      "\x1b[1;32mAvailable Commands:\x1b[0m",
      "",
      "\x1b[1;33mclear\x1b[0m          - Clear the terminal screen",
      "\x1b[1;33mhistory\x1b[0m        - Show command history",
      "\x1b[1;33mpwd\x1b[0m            - Show current directory",
      "\x1b[1;33mabout\x1b[0m          - Display bio information",
      "\x1b[1;33mskills\x1b[0m         - Show technical skills",
      "\x1b[1;33mprojects\x1b[0m       - List all projects",
      "\x1b[1;33mproject <id>\x1b[0m   - View project details",
      "\x1b[1;33mresume\x1b[0m         - Display resume",
      "\x1b[1;33mupdates\x1b[0m        - Show recent activities",
      "\x1b[1;33meducation\x1b[0m      - Display academic background",
      "\x1b[1;33mtypinggame\x1b[0m     - Start typing test",
      "\x1b[1;33mthemes\x1b[0m         - Switch color themes",
      "\x1b[1;33mswitchgui\x1b[0m      - Switch to GUI mode",
      "\x1b[1;33mcontact\x1b[0m        - Show contact options",
      "\x1b[1;33memail\x1b[0m          - Show email contact",
      "\x1b[1;33mcodeforces\x1b[0m     - Open Codeforces profile",
      "\x1b[1;33mleetcode\x1b[0m       - Open LeetCode profile",
      "\x1b[1;33mwelcome\x1b[0m        - Show welcome screen again",
      "",
      "\x1b[1;37mYou can also perform basic math operations (e.g., 2 + 3 * 4)\x1b[0m",
      "",
    ]

    commands.forEach((cmd) => this.terminal.write(cmd + "\r\n"))
  }

  private handleHistory(args: string[]) {
    if (args[0] === "-c" || args[0] === "clear") {
      this.commandHistory = []
      this.terminal.write("\x1b[1;32mCommand history cleared.\x1b[0m\r\n")
      return
    }

    this.terminal.write("\x1b[1;32mCommand History:\x1b[0m\r\n")
    this.commandHistory.forEach((cmd, index) => {
      this.terminal.write(`\x1b[1;36m${index + 1}\x1b[0m  \x1b[1;37m${cmd}\x1b[0m\r\n`)
    })
  }

  private handlePwd() {
    this.terminal.write("\x1b[1;37mYou are currently in the root of Manthan's portfolio.\x1b[0m\r\n")
  }

  private handleAbout() {
    const bio = portfolioData.about
    this.terminal.write("\x1b[1;32mAbout Me\x1b[0m\r\n")
    this.terminal.write("\x1b[1;33m" + "─".repeat(80) + "\x1b[0m\r\n\r\n")

    // Enhanced word wrap with better contrast
    this.writeWrappedText(bio, 100, "\x1b[1;37m", "\x1b[0m")
    this.terminal.write("\r\n")
  }

  private writeWrappedText(text: string, maxWidth = 100, startColor = "", endColor = "") {
    const words = text.split(" ")
    let currentLine = ""

    words.forEach((word) => {
      if ((currentLine + word).length > maxWidth) {
        this.terminal.write(startColor + currentLine.trim() + endColor + "\r\n")
        currentLine = word + " "
      } else {
        currentLine += word + " "
      }
    })

    if (currentLine.trim()) {
      this.terminal.write(startColor + currentLine.trim() + endColor + "\r\n")
    }
  }

  private handleSkills() {
    this.terminal.write("\x1b[1;32mTechnical Skills\x1b[0m\r\n\r\n")

    // Rearranged skill categories as requested
    const skillRows = [
      // Top row: Languages and Frontend
      [
        {
          title: "Languages",
          items: ["C", "C++", "Python"],
        },
        {
          title: "Frontend",
          items: ["HTML", "CSS", "React", "Next.js"],
        },
      ],
      // Middle row: Backend and Database & Services
      [
        {
          title: "Backend",
          items: ["Node.js", "Express.js", "FastAPI(Python)"],
        },
        {
          title: "Databases & Services",
          items: ["MongoDB", "PostgreSQL", "Supabase", "Firebase"],
        },
      ],
      // Bottom row: DevOps & Platforms
      [
        {
          title: "DevOps & Platforms",
          items: ["Git", "GitHub", "Linux"],
        },
      ],
    ]

    // Display each row
    skillRows.forEach((row, rowIndex) => {
      // Calculate max height for this row
      const maxHeight = Math.max(...row.map((category) => category.items.length))

      // Display titles
      row.forEach((category, colIndex) => {
        this.terminal.write(`\x1b[1;33m${category.title.padEnd(30)}\x1b[0m`)
        if (colIndex < row.length - 1) {
          this.terminal.write("    ") // Spacing between columns
        }
      })
      this.terminal.write("\r\n")

      // Display top borders
      row.forEach((category, colIndex) => {
        this.terminal.write(`\x1b[1;36m┌${"─".repeat(28)}┐\x1b[0m`)
        if (colIndex < row.length - 1) {
          this.terminal.write("    ")
        }
      })
      this.terminal.write("\r\n")

      // Display content rows
      for (let i = 0; i < maxHeight; i++) {
        row.forEach((category, colIndex) => {
          const item = category.items[i] || ""
          this.terminal.write(`\x1b[1;36m│\x1b[0m \x1b[1;37m${item.padEnd(26)}\x1b[0m \x1b[1;36m│\x1b[0m`)
          if (colIndex < row.length - 1) {
            this.terminal.write("    ")
          }
        })
        this.terminal.write("\r\n")
      }

      // Display bottom borders
      row.forEach((category, colIndex) => {
        this.terminal.write(`\x1b[1;36m└${"─".repeat(28)}┘\x1b[0m`)
        if (colIndex < row.length - 1) {
          this.terminal.write("    ")
        }
      })
      this.terminal.write("\r\n")

      // Add spacing between rows (except after the last one)
      if (rowIndex < skillRows.length - 1) {
        this.terminal.write("\r\n")
      }
    })

    this.terminal.write("\r\n\r\n")

    // Competitive Programming Section - Side by side boxes
    this.terminal.write("\x1b[1;32mCompetitive Programming\x1b[0m\r\n\r\n")

    // Codeforces and LeetCode side by side
    const cfLines = [
      "┌─────────────────────────────────┐",
      "│ \x1b[1;33mCodeforces:\x1b[0m                     │",
      "│   • Handle: manthan_cs          │",
      "│   • Max Rating: 1600 (Expert)   │",
      "└─────────────────────────────────┘",
    ]

    const lcLines = [
      "┌─────────────────────────────────┐",
      "│ \x1b[1;33mLeetCode:\x1b[0m                       │",
      "│   • Handle: manthan_dev         │",
      "│   • Contest Rating: 2000+       │",
      "└─────────────────────────────────┘",
    ]

    // Display side by side with proper spacing
    for (let i = 0; i < cfLines.length; i++) {
      this.terminal.write(`\x1b[1;36m${cfLines[i]}\x1b[0m    \x1b[1;36m${lcLines[i]}\x1b[0m\r\n`)
    }

    this.terminal.write("\r\n")
    this.terminal.write("\x1b[1;37mUse 'codeforces' or 'leetcode' commands to visit profiles\x1b[0m\r\n")
  }

  private handleCodeforces() {
    window.open("https://codeforces.com/profile/manthan_cs", "_blank")
    this.terminal.write("\x1b[1;32mOpening Codeforces profile...\x1b[0m\r\n")
  }

  private handleLeetcode() {
    window.open("https://leetcode.com/manthan_dev", "_blank")
    this.terminal.write("\x1b[1;32mOpening LeetCode profile...\x1b[0m\r\n")
  }

  private handleProjectsList() {
    const projects = portfolioData.projects
    this.terminal.write("\x1b[1;32mProjects\x1b[0m\r\n")
    this.terminal.write("\x1b[1;33m" + "─".repeat(80) + "\x1b[0m\r\n\r\n")

    projects.forEach((project, index) => {
      this.terminal.write(`\x1b[1;33m${index + 1}. ${project.name}\x1b[0m\r\n`)
      this.writeWrappedText(`   ${project.description}`, 100, "\x1b[1;37m", "\x1b[0m")
      this.terminal.write("\r\n")
    })

    this.terminal.write('\x1b[1;36mUse "project <id>" for detailed information.\x1b[0m\r\n')
    this.terminal.write("\x1b[1;36mAvailable commands:\x1b[0m\r\n")
    this.terminal.write("\x1b[1;37m• project <id> github - Open GitHub repository\x1b[0m\r\n")
    this.terminal.write("\x1b[1;37m• project <id> demo   - Open live demo\x1b[0m\r\n")
  }

  private handleProject(args: string[]) {
    if (args.length === 0) {
      this.terminal.write("\x1b[1;31mUsage: project <id> [github|demo]\x1b[0m\r\n")
      this.terminal.write('\x1b[1;37mExample: "project 1" or "project 1 github"\x1b[0m\r\n\r\n')
      this.terminal.write("\x1b[1;36mAvailable commands:\x1b[0m\r\n")
      this.terminal.write("\x1b[1;37m• project <id> github - Open GitHub repository\x1b[0m\r\n")
      this.terminal.write("\x1b[1;37m• project <id> demo   - Open live demo\x1b[0m\r\n")
      return
    }

    const projectId = Number.parseInt(args[0])
    const projects = portfolioData.projects

    if (isNaN(projectId) || projectId < 1 || projectId > projects.length) {
      this.terminal.write(`\x1b[1;31mInvalid project ID. Use 1-${projects.length}\x1b[0m\r\n`)
      return
    }

    const project = projects[projectId - 1]

    if (args[1] === "github") {
      window.open(project.github, "_blank")
      this.terminal.write(`\x1b[1;32mOpening GitHub repository for ${project.name}...\x1b[0m\r\n`)
    } else if (args[1] === "demo") {
      if (project.demo !== "N/A") {
        window.open(project.demo, "_blank")
        this.terminal.write(`\x1b[1;32mOpening live demo for ${project.name}...\x1b[0m\r\n`)
      } else {
        this.terminal.write(`\x1b[1;31mNo live demo available for ${project.name}\x1b[0m\r\n`)
      }
    } else {
      // Show project details
      this.terminal.write(`\x1b[1;32m${project.name}\x1b[0m\r\n`)
      this.terminal.write("\x1b[1;33m" + "─".repeat(80) + "\x1b[0m\r\n\r\n")
      this.terminal.write("\x1b[1;36mDescription:\x1b[0m\r\n")
      this.writeWrappedText(project.description, 100, "\x1b[1;37m", "\x1b[0m")
      this.terminal.write(`\r\n\x1b[1;36mGitHub:\x1b[0m \x1b[1;37m${project.github}\x1b[0m\r\n`)
      if (project.demo !== "N/A") {
        this.terminal.write(`\x1b[1;36mLive Demo:\x1b[0m \x1b[1;37m${project.demo}\x1b[0m\r\n`)
      }
      this.terminal.write(`\r\n\x1b[1;36mAvailable commands:\x1b[0m\r\n`)
      this.terminal.write(`\x1b[1;37m• project ${projectId} github - Open GitHub repository\x1b[0m\r\n`)
      this.terminal.write(`\x1b[1;37m• project ${projectId} demo   - Open live demo\x1b[0m\r\n`)
    }
  }

  private handleResume() {
    this.terminal.write("\x1b[1;32mResume\x1b[0m\r\n")
    this.terminal.write("\x1b[1;33m" + "─".repeat(80) + "\x1b[0m\r\n\r\n")
    this.terminal.write("\x1b[1;37mASCII Resume coming soon...\x1b[0m\r\n\r\n")
    this.terminal.write("\x1b[1;36mDownload PDF:\x1b[0m \x1b[1;37m/assets/manthan_resume.pdf\x1b[0m\r\n")
  }

  private handleUpdates() {
    const updates = portfolioData.updates
    this.terminal.write("\x1b[1;32mRecent Activities\x1b[0m\r\n")
    this.terminal.write("\x1b[1;33m" + "─".repeat(80) + "\x1b[0m\r\n\r\n")

    updates.forEach((update) => {
      this.terminal.write(`\x1b[1;36m${update.date}\x1b[0m \x1b[1;37m${update.activity}\x1b[0m\r\n\r\n`)
    })
  }

  private handleEducation() {
    const education = portfolioData.education
    this.terminal.write("\x1b[1;32mEducation\x1b[0m\r\n")
    this.terminal.write("\x1b[1;33m" + "─".repeat(80) + "\x1b[0m\r\n\r\n")

    Object.entries(education).forEach(([key, value]) => {
      if (key === "highlights") {
        this.terminal.write(`\x1b[1;33m${key.charAt(0).toUpperCase() + key.slice(1)}:\x1b[0m\r\n`)
        ;(value as string[]).forEach((highlight) => {
          this.terminal.write(`\x1b[1;37m  • ${highlight}\x1b[0m\r\n`)
        })
        this.terminal.write("\r\n")
      } else {
        this.terminal.write(
          `\x1b[1;33m${key.charAt(0).toUpperCase() + key.slice(1)}:\x1b[0m \x1b[1;37m${value}\x1b[0m\r\n\r\n`,
        )
      }
    })
  }

  private handleTypingGame(args: string[]) {
    this.typingGame.start(args)
  }

  private handleThemes(args: string[]) {
    const availableThemes: ThemeName[] = ["evil", "dracula", "gruvbox", "nord"]

    if (args.length === 0) {
      this.terminal.write("\x1b[1;32mAvailable Themes\x1b[0m\r\n")
      this.terminal.write("\x1b[1;33m" + "─".repeat(40) + "\x1b[0m\r\n\r\n")
      availableThemes.forEach((theme) => {
        this.terminal.write(`\x1b[1;37m• ${theme}\x1b[0m\r\n`)
      })
      this.terminal.write('\n\x1b[1;36mUse "themes <name>" to switch themes.\x1b[0m\r\n')
    } else {
      const theme = args[0].toLowerCase() as ThemeName
      if (availableThemes.includes(theme)) {
        this.setTheme(theme)
        this.terminal.write(`\x1b[1;32mSwitched to ${theme} theme successfully!\x1b[0m\r\n`)
      } else {
        this.terminal.write(`\x1b[1;31mUnknown theme: ${theme}\x1b[0m\r\n`)
        this.terminal.write("\x1b[1;37mAvailable themes: " + availableThemes.join(", ") + "\x1b[0m\r\n")
      }
    }
  }

  private handleSwitchGui() {
    this.terminal.write("\x1b[1;32mSwitching to GUI mode...\x1b[0m\r\n")
    setTimeout(() => {
      window.location.href = "/gui"
    }, 1000)
  }

  private handleContact(args: string[]) {
    if (args.length === 0) {
      this.terminal.write("\x1b[1;32mContact Options\x1b[0m\r\n")
      this.terminal.write("\x1b[1;33m" + "─".repeat(80) + "\x1b[0m\r\n\r\n")
      this.terminal.write("\x1b[1;37mAvailable platforms:\x1b[0m\r\n\r\n")
      this.terminal.write("\x1b[1;37m• \x1b[1;36mcontact linkedin\x1b[0m - Open LinkedIn profile\x1b[0m\r\n")
      this.terminal.write("\x1b[1;37m• \x1b[1;36mcontact github\x1b[0m   - Open GitHub profile\x1b[0m\r\n")
      this.terminal.write("\x1b[1;37m• \x1b[1;36mcontact twitter\x1b[0m  - Open X (Twitter) profile\x1b[0m\r\n")
      this.terminal.write("\x1b[1;37m• \x1b[1;36mcontact insta\x1b[0m    - Open Instagram profile\x1b[0m\r\n")
      this.terminal.write("\x1b[1;37m• \x1b[1;36memail\x1b[0m            - Show email contact\x1b[0m\r\n")
      return
    }

    const platform = args[0].toLowerCase()

    switch (platform) {
      case "linkedin":
        window.open("https://www.linkedin.com/in/manthan-vats-102476359", "_blank")
        this.terminal.write("\x1b[1;32mOpening LinkedIn profile...\x1b[0m\r\n")
        break
      case "github":
        window.open("https://github.com/Manthan-Vats", "_blank")
        this.terminal.write("\x1b[1;32mOpening GitHub profile...\x1b[0m\r\n")
        break
      case "twitter":
      case "x":
        window.open("https://x.com/ralph_hood1", "_blank")
        this.terminal.write("\x1b[1;32mOpening X (Twitter) profile...\x1b[0m\r\n")
        break
      case "insta":
      case "instagram":
        window.open("https://www.instagram.com/_manthanvats?igsh=MTN4aWEwNjRhdXpqMw==", "_blank")
        this.terminal.write("\x1b[1;32mOpening Instagram profile...\x1b[0m\r\n")
        break
      default:
        this.terminal.write(`\x1b[1;31mUnknown platform: ${platform}\x1b[0m\r\n`)
        this.terminal.write("\x1b[1;37mAvailable: linkedin, github, twitter, insta\x1b[0m\r\n")
    }
  }

  private handleEmail() {
    this.terminal.write("\x1b[1;32mEmail Contact\x1b[0m\r\n")
    this.terminal.write("\x1b[1;33m" + "─".repeat(40) + "\x1b[0m\r\n\r\n")
    this.terminal.write("\x1b[1;37mfitz.chiv07@gmail.com\x1b[0m\r\n")
  }

  getAutocompleteSuggestions(input: string): string[] {
    const commands = [
      "clear",
      "help",
      "history",
      "pwd",
      "about",
      "skills",
      "projects",
      "project",
      "resume",
      "updates",
      "education",
      "typinggame",
      "themes",
      "switchgui",
      "contact",
      "email",
      "codeforces",
      "leetcode",
      "welcome",
    ]

    const projectCommands = ["project 1", "project 2", "project 3", "project 4", "project 5"]
    const contactCommands = ["contact linkedin", "contact github", "contact twitter", "contact insta"]
    const themeCommands = ["themes evil", "themes dracula", "themes gruvbox", "themes nord"]
    const allCommands = [...commands, ...projectCommands, ...contactCommands, ...themeCommands]

    return allCommands.filter((cmd) => cmd.startsWith(input.toLowerCase()))
  }
}
