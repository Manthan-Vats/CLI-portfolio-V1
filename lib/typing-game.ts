import type { Terminal } from "@xterm/xterm"

interface GameStats {
  wpm: number
  accuracy: number
  username?: string
  date: string
}

export class TypingGame {
  private terminal: Terminal
  private gameActive = false
  private startTime = 0
  private currentText = ""
  private userInput = ""
  private correctChars = 0
  private totalChars = 0
  private duration = 30
  private gameTimer?: NodeJS.Timeout
  private countdownInterval?: NodeJS.Timeout
  private onDataDisposable?: { dispose(): void }
  private timeLeft = 0
  private isFirstPlay = true

  private words = [
    "apple", "banana", "cat", "dog", "elephant", "flower", "grape", "house", 
    "ice", "jump", "keyboard", "laptop", "mouse", "notebook", "orange", "pencil", 
    "queen", "rabbit", "sun", "tree", "water", "yellow", "zebra", "mountain", 
    "ocean", "river", "forest", "desert", "island", "bridge", "castle", "garden",
    "rainbow", "thunder", "lightning", "butterfly", "dragonfly", "honeybee", 
    "ladybug", "firefly", "cricket", "grasshopper", "telescope", "microscope",
    "calculator", "computer", "smartphone", "headphones", "microphone", "camera"
  ]

  private sentences = [
    "The quick brown fox jumps over the lazy dog.",
    "Never underestimate the power of a good book.",
    "Innovation distinguishes between a leader and a follower.",
    "To be or not to be, that is the question.",
    "The only way to do great work is to love what you do.",
    "Life is 10% what happens to you and 90% how you react to it.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It is during our darkest moments that we must focus to see the light.",
    "The way to get started is to quit talking and begin doing.",
    "Your time is limited, so don't waste it living someone else's life.",
    "If life were predictable it would cease to be life, and be without flavor.",
    "In the end, we will remember not the words of our enemies, but the silence of our friends.",
    "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    "Programming is not about typing, it's about thinking.",
    "Code is like humor. When you have to explain it, it's bad.",
    "First, solve the problem. Then, write the code.",
    "Experience is the name everyone gives to their mistakes.",
    "The best way to predict the future is to invent it.",
    "Simplicity is the ultimate sophistication in software design."
  ]

  private advanced = [
    "function quickSort(arr) { if (arr.length <= 1) return arr; const pivot = arr[0]; }",
    "const fibonacci = (n) => n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);",
    "import React, { useState, useEffect } from 'react'; export default Component;",
    "SELECT * FROM users WHERE age > 18 AND status = 'active' ORDER BY created_at DESC;",
    "git commit -m 'feat: add user authentication with JWT tokens and bcrypt hashing'",
    "docker run -d -p 3000:3000 --name myapp -e NODE_ENV=production myapp:latest",
    "The algorithm's time complexity is O(n log n) while space complexity remains O(1).",
    "Machine learning models require extensive training data and proper validation techniques.",
    "Cybersecurity involves protecting systems from digital attacks and unauthorized access."
  ]

  constructor(terminal: Terminal) {
    this.terminal = terminal
    this.loadFirstPlayStatus()
  }

  start(args: string[]) {
    if (this.gameActive) {
      this.terminal.write("\x1b[31m❌ Game already in progress! Please wait for it to finish.\x1b[0m\r\n")
      return
    }

    // Parse arguments for mode and duration
    let mode = "medium"
    let duration = 30

    for (let i = 0; i < args.length; i++) {
      if (args[i] === "--mode" && args[i + 1]) {
        mode = args[i + 1]
        i++
      } else if (args[i] === "--duration" && args[i + 1]) {
        duration = Number.parseInt(args[i + 1])
        if (isNaN(duration) || duration < 10 || duration > 300) {
          this.terminal.write("\x1b[31m❌ Duration must be between 10-300 seconds\x1b[0m\r\n")
          return
        }
        i++
      } else if (args[i] === "--help" || args[i] === "-h") {
        this.showHelp()
        return
      }
    }

    this.duration = duration
    this.generateText(mode)
    this.startGame()
  }

  private loadFirstPlayStatus() {
    const played = localStorage.getItem("typing-game-played")
    this.isFirstPlay = !played
  }

  private saveFirstPlayStatus() {
    localStorage.setItem("typing-game-played", "true")
    this.isFirstPlay = false
  }

  private showHelp() {
    this.terminal.write("\r\n\x1b[1;36m🎮 TYPING GAME HELP\x1b[0m\r\n")
    this.terminal.write("═".repeat(50) + "\r\n")
    this.terminal.write("\x1b[33mUsage:\x1b[0m typinggame [options]\r\n\r\n")
    this.terminal.write("\x1b[33mOptions:\x1b[0m\r\n")
    this.terminal.write("  --mode <easy|medium|advanced>  Set difficulty level\r\n")
    this.terminal.write("  --duration <10-300>            Set game duration in seconds\r\n")
    this.terminal.write("  --help, -h                     Show this help message\r\n\r\n")
    this.terminal.write("\x1b[33mModes:\x1b[0m\r\n")
    this.terminal.write("  \x1b[32measy\x1b[0m     - Simple words\r\n")
    this.terminal.write("  \x1b[33mmedium\x1b[0m   - Complete sentences\r\n")
    this.terminal.write("  \x1b[31madvanced\x1b[0m - Code snippets and complex text\r\n\r\n")
    this.terminal.write("\x1b[33mExamples:\x1b[0m\r\n")
    this.terminal.write("  typinggame\r\n")
    this.terminal.write("  typinggame --mode easy --duration 60\r\n")
    this.terminal.write("  typinggame --mode advanced --duration 120\r\n")
  }

  private generateText(mode: string) {
    switch (mode.toLowerCase()) {
      case "easy":
        // Generate 15-20 random words
        const shuffled = [...this.words].sort(() => Math.random() - 0.5)
        this.currentText = shuffled.slice(0, 15 + Math.floor(Math.random() * 6)).join(" ")
        break
      case "medium":
        this.currentText = this.sentences[Math.floor(Math.random() * this.sentences.length)]
        break
      case "advanced":
        this.currentText = this.advanced[Math.floor(Math.random() * this.advanced.length)]
        break
      default:
        this.currentText = this.sentences[Math.floor(Math.random() * this.sentences.length)]
    }
  }

  private startGame() {
    this.gameActive = true
    this.userInput = ""
    this.correctChars = 0
    this.totalChars = 0
    this.startTime = Date.now()
    this.timeLeft = this.duration

    // Clear any existing timers
    this.clearTimers()

    this.displayGameHeader()
    this.displayTextToType()
    this.startCountdown()
    this.setupInputHandling()

    // Set up game timer
    this.gameTimer = setTimeout(() => {
      this.endGame()
    }, this.duration * 1000)
  }

  private displayGameHeader() {
    this.terminal.write("\r\n\x1b[1;32m🚀 TYPING TEST STARTED!\x1b[0m\r\n")
    this.terminal.write("═".repeat(80) + "\r\n")
    this.terminal.write(`\x1b[36m⏱️  Duration: ${this.duration} seconds\x1b[0m\r\n`)
    this.terminal.write(`\x1b[36m📝 Characters: ${this.currentText.length}\x1b[0m\r\n`)
    this.terminal.write("═".repeat(80) + "\r\n")
  }

  private displayTextToType() {
    this.terminal.write("\x1b[1;37m📖 Text to type:\x1b[0m\r\n")
    this.terminal.write("\x1b[90m" + "─".repeat(80) + "\x1b[0m\r\n")
    // Display text with subtle highlighting for better visibility
    this.terminal.write(`\x1b[97m\x1b[100m ${this.currentText} \x1b[0m\r\n`)
    this.terminal.write("\x1b[90m" + "─".repeat(80) + "\x1b[0m\r\n")
    this.terminal.write("\x1b[1;33m⌨️  Your typing:\x1b[0m ")
  }

  private updateComparisonView() {
    // Save current cursor position
    this.terminal.write("\x1b[s")
    
    // Move to a position below the original text to show comparison
    this.terminal.write("\x1b[8;1H") // Move to line 8, column 1
    this.terminal.write("\x1b[K") // Clear line
    this.terminal.write("\x1b[1;36m🔍 Live comparison:\x1b[0m ")
    
    // Display character-by-character comparison
    for (let i = 0; i < Math.max(this.currentText.length, this.userInput.length); i++) {
      const originalChar = this.currentText[i] || ' '
      const typedChar = this.userInput[i]
      
      if (i === this.userInput.length) {
        // Current position cursor
        this.terminal.write(`\x1b[43m\x1b[30m${originalChar}\x1b[0m`)
      } else if (typedChar === undefined) {
        // Not yet typed - gray
        this.terminal.write(`\x1b[90m${originalChar}\x1b[0m`)
      } else if (typedChar === originalChar) {
        // Correct - bright green background
        this.terminal.write(`\x1b[102m\x1b[30m${typedChar}\x1b[0m`)
      } else {
        // Incorrect - bright red background with the expected character shown
        this.terminal.write(`\x1b[101m\x1b[37m${originalChar}\x1b[0m`)
      }
    }
    
    // Show live stats
    const currentAccuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 100
    this.terminal.write("\x1b[9;1H") // Move to line 9
    this.terminal.write("\x1b[K") // Clear line
    this.terminal.write(`\x1b[36m📊 Progress: ${this.userInput.length}/${this.currentText.length} | Accuracy: ${currentAccuracy}%\x1b[0m`)
    
    // Restore cursor position
    this.terminal.write("\x1b[u")
  }

  private startCountdown() {
    this.updateCountdown()
    this.countdownInterval = setInterval(() => {
      this.timeLeft--
      this.updateCountdown()
      
      if (this.timeLeft <= 0) {
        this.endGame()
      }
    }, 1000)
  }

  private updateCountdown() {
    // Save cursor position, move to top right, display time, restore cursor
    this.terminal.write("\x1b[s") // Save cursor
    this.terminal.write("\x1b[1;70H") // Move to line 1, column 70
    
    const timeColor = this.timeLeft <= 10 ? "\x1b[31m" : this.timeLeft <= 30 ? "\x1b[33m" : "\x1b[32m"
    this.terminal.write(`${timeColor}⏰ ${this.timeLeft}s\x1b[0m`)
    
    this.terminal.write("\x1b[u") // Restore cursor
  }

  private setupInputHandling() {
    // Clean up any existing listener
    if (this.onDataDisposable) {
      this.onDataDisposable.dispose()
    }

    this.onDataDisposable = this.terminal.onData((data) => {
      if (!this.gameActive) return

      const code = data.charCodeAt(0)

      if (code === 13) {
        // Enter - end game early
        this.endGame()
        return
      }

      if (code === 27) {
        // Escape - quit game
        this.terminal.write("\r\n\x1b[33m⚠️  Game cancelled by user\x1b[0m\r\n")
        this.endGame()
        return
      }

      if (code === 127 || code === 8) {
        // Backspace
        if (this.userInput.length > 0) {
          this.userInput = this.userInput.slice(0, -1)
          this.terminal.write("\b \b")
        }
        return
      }

      if (code >= 32 && code <= 126) {
        // Printable characters
        this.userInput += data
        this.totalChars++

        const currentIndex = this.userInput.length - 1
        if (currentIndex < this.currentText.length) {
          if (this.currentText[currentIndex] === data) {
            this.correctChars++
            // Bright green with subtle underline for correct characters
            this.terminal.write(`\x1b[92m\x1b[4m${data}\x1b[0m`)
          } else {
            // Bright red with strike-through effect for incorrect characters
            this.terminal.write(`\x1b[91m\x1b[9m${data}\x1b[0m`)
          }
        } else {
          // Yellow with dim styling for extra characters
          this.terminal.write(`\x1b[93m\x1b[2m${data}\x1b[0m`)
        }

        // Update the live comparison view
        this.updateComparisonView()

        // Check if completed
        if (this.userInput.length >= this.currentText.length) {
          this.endGame()
        }
      }
    })
  }

  private clearTimers() {
    if (this.gameTimer) {
      clearTimeout(this.gameTimer)
      this.gameTimer = undefined
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
      this.countdownInterval = undefined
    }
  }

  private endGame() {
    if (!this.gameActive) return

    this.gameActive = false
    this.clearTimers()

    // Clean up input handler
    if (this.onDataDisposable) {
      this.onDataDisposable.dispose()
      this.onDataDisposable = undefined
    }

    const endTime = Date.now()
    const timeElapsed = (endTime - this.startTime) / 1000 / 60 // minutes

    const wordsTyped = this.userInput.length / 5 // Standard: 5 characters = 1 word
    const wpm = Math.round(wordsTyped / timeElapsed) || 0
    const accuracy = this.totalChars > 0 ? Math.round((this.correctChars / this.totalChars) * 100) : 0

    this.displayResults(wpm, accuracy)
    
    // Save to leaderboard
    this.saveScore({ wpm, accuracy, date: new Date().toLocaleDateString() })
    this.showLeaderboard()

    // Show help for first-time users
    if (this.isFirstPlay) {
      this.showFirstTimeHelp()
      this.saveFirstPlayStatus()
    }
  }

  private displayResults(wpm: number, accuracy: number) {
    this.terminal.write("\r\n\r\n")
    this.terminal.write("\x1b[1;32m🎉 GAME COMPLETE!\x1b[0m\r\n")
    this.terminal.write("═".repeat(50) + "\r\n")
    
    // Performance rating
    let rating = "📝"
    let ratingText = "Keep practicing!"
    let ratingColor = "\x1b[37m"
    
    if (wpm >= 60 && accuracy >= 95) {
      rating = "🏆"
      ratingText = "EXCELLENT!"
      ratingColor = "\x1b[33m"
    } else if (wpm >= 40 && accuracy >= 90) {
      rating = "🥇"
      ratingText = "Great job!"
      ratingColor = "\x1b[32m"
    } else if (wpm >= 25 && accuracy >= 80) {
      rating = "🥈"
      ratingText = "Good work!"
      ratingColor = "\x1b[36m"
    }

    this.terminal.write(`${ratingColor}${rating} ${ratingText}\x1b[0m\r\n\r\n`)
    this.terminal.write(`\x1b[1;33m⚡ WPM:\x1b[0m ${wpm}\r\n`)
    this.terminal.write(`\x1b[1;33m🎯 Accuracy:\x1b[0m ${accuracy}%\r\n`)
    this.terminal.write(`\x1b[1;33m✅ Correct:\x1b[0m ${this.correctChars}/${this.totalChars} characters\r\n`)
  }

  private showFirstTimeHelp() {
    this.terminal.write("\r\n\x1b[1;36m🆕 FIRST TIME PLAYER GUIDE\x1b[0m\r\n")
    this.terminal.write("═".repeat(50) + "\r\n")
    this.terminal.write("Try different modes and durations:\r\n\r\n")
    this.terminal.write("\x1b[32m• typinggame --mode easy\x1b[0m\r\n")
    this.terminal.write("\x1b[33m• typinggame --mode medium --duration 60\x1b[0m\r\n")
    this.terminal.write("\x1b[31m• typinggame --mode advanced\x1b[0m\r\n\r\n")
    this.terminal.write("Type \x1b[36mtypinggame --help\x1b[0m for more options!\r\n")
  }

  private saveScore(stats: GameStats) {
    try {
      const leaderboard = this.getLeaderboard()
      leaderboard.push(stats)
      leaderboard.sort((a, b) => {
        // Sort by WPM first, then by accuracy
        if (b.wpm !== a.wpm) return b.wpm - a.wpm
        return b.accuracy - a.accuracy
      })
      leaderboard.splice(10) // Keep only top 10

      localStorage.setItem("typing-leaderboard", JSON.stringify(leaderboard))
    } catch (error) {
      console.warn("Could not save score to leaderboard:", error)
    }
  }

  private getLeaderboard(): GameStats[] {
    try {
      const stored = localStorage.getItem("typing-leaderboard")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn("Could not load leaderboard:", error)
      return []
    }
  }

  private showLeaderboard() {
    const leaderboard = this.getLeaderboard()

    this.terminal.write("\r\n\x1b[1;32m🏆 LEADERBOARD (Top 10)\x1b[0m\r\n")
    this.terminal.write("═".repeat(60) + "\r\n")
    this.terminal.write("\x1b[1;33mRank  WPM    Accuracy  Date\x1b[0m\r\n")
    this.terminal.write("─".repeat(60) + "\r\n")

    if (leaderboard.length === 0) {
      this.terminal.write("\x1b[90mNo scores yet. Be the first!\x1b[0m\r\n")
    } else {
      leaderboard.forEach((score, index) => {
        const rank = (index + 1).toString().padEnd(4)
        const wpm = (score.wpm || 0).toString().padEnd(6)
        const accuracy = (score.accuracy || 0).toString().padEnd(9)
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "  "
        
        this.terminal.write(`${medal} ${rank} ${wpm} ${accuracy}%  ${score.date}\r\n`)
      })
    }
    this.terminal.write("═".repeat(60) + "\r\n")
  }
}