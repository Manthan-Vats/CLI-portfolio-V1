export const portfolioData = {
  about:
    "I'm a first-year CS student at Manipal University Jaipur (CGPA: 9.27/10) who builds things. Started with competitive programming—loved the problem-solving part—and discovered I'm equally passionate about shipping real products. C++ got me to Pupil on Codeforces, but React and TypeScript are where I spend most of my time now. Right now I'm working with a healthcare AI startup on clinical decision-support tools for Indian physicians, exploring federated learning for privacy-preserving ML, and mentoring junior students in DSA. I believe the best learning happens at the intersection of theory and practice—whether it's visualizing graph algorithms in real-time or building anonymous campus platforms that solve actual problems. Real problems, real code, real impact. That's what drives me.",

  skills: {
    Technical: {
      Frontend: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
      ],
      Backend: [
        "FastAPI",
        "Node.js",
        "Express.js",
        "Python",
        "REST APIs",
      ],
      Databases: ["PostgreSQL", "MongoDB", "Firebase"],
      Languages: ["C++", "Python", "TypeScript", "JavaScript", "Java", "SQL"],
    },
    "ML & Security": [
      "PyTorch",
      "Scikit-learn",
      "Federated Learning",
      "Network Security",
      "Data Structures",
    ],
    "Tools & Platforms": [
      "Git",
      "GitHub",
      "Vercel",
      "WebSockets",
      "Linux",
      "VS Code",
    ],
    "Competitive Programming": {
      Profiles: ["Codeforces"],
      Rating: "Pupil",
      "Contest Achievements": ["Div. 2/3 Regular Contestant", "1st Place Campus CP Contests"],
      History: ["Startup Weekend 2025 - 1st Place", "Multiple Hackathons"],
    },
  },

  projects: [
    {
      name: "Graphway",
      description:
        "Interactive live graph algorithm visualizer. Draw graphs, run A*, Dijkstra, Ford-Fulkerson, Topological Sort, and step through every decision in real time.",
      problem:
        "Learning graph algorithms from textbooks sucks. You can't see what's happening step by step.",
      solution:
        "Draw graphs with your mouse, pick an algorithm, and watch it find the shortest path or solve the problem in real-time. Supports directed/undirected graphs, weighted edges, JSON export.",
      tech: ["React", "TypeScript", "Zustand", "Vite"],
      github: "https://github.com/Manthan-Vats/Graphway",
      demo: "https://graphway.vercel.app",
    },
    {
      name: "FractalLoom",
      description:
        "8-parameter interactive fractal generator with Mandelbrot and Julia set explorers. Real-time WebGL rendering with 4 presets and PNG export.",
      problem:
        "Fractals look amazing but the math behind them is intimidating. Most people never get to explore them interactively.",
      solution:
        "Eight sliders control everything. Move one and watch a tree turn into a spiral. Move another and suddenly you've got alien geometry. Used by students exploring computational mathematics.",
      tech: ["React", "TypeScript", "WebGL", "Vite"],
      github: "https://github.com/Manthan-Vats/FractalLoom",
      demo: "https://fractal-loom.vercel.app",
    },
    {
      name: "Overheard",
      description:
        "Anonymous location-scoped platform for MUJ students. Post, vote, and react without identity pressure. Real-time WebSocket feed with campus-only visibility enforced at backend.",
      problem:
        "Students want to share thoughts freely but fear social judgment. Traditional social platforms require identity.",
      solution:
        "JWT auth with location-based visibility. Students can post anonymously within campus, see real-time updates via WebSockets, vote on posts. Backend enforces privacy guarantees.",
      tech: ["React", "FastAPI", "Python", "PostgreSQL", "WebSockets"],
      github: "https://github.com/Manthan-Vats/campuswhisper",
      demo: "N/A",
    },
    {
      name: "FederatedGuard IDS",
      description:
        "Federated ML intrusion detection system. Raw data stays local, threat models trained collaboratively across nodes. Benchmarking on CIC-IDS2017 and NSL-KDD datasets.",
      problem:
        "Centralized threat detection requires sharing raw traffic data—privacy nightmare. Organizations won't share data.",
      solution:
        "Federated learning approach: each node trains locally, shares only model parameters. Collective threat intel without exposing raw data. Research paper in progress.",
      tech: ["Python", "PyTorch", "Federated Learning"],
      github: "N/A",
      demo: "N/A",
    },
  ],

  updates: [
    {
      date: "[2026-02-10]",
      activity:
        "Launched FederatedGuard IDS research paper draft. Working with advisors on privacy experiments.",
    },
    {
      date: "[2026-01-15]",
      activity:
        "Overheard platform live for MUJ students. 200+ active users, real-time WebSocket feed working smoothly.",
    },
    {
      date: "[2025-12-01]",
      activity:
        "Started role as Founders Office Associate at healthcare AI startup. Focusing on product scoping and user research.",
    },
    {
      date: "[2025-10-20]",
      activity:
        "Won 1st Place at Startup Weekend Jaipur 2025 — built and pitched a full tech venture in 54 hours.",
    },
    {
      date: "[2025-08-15]",
      activity:
        "Launched FractalLoom — 8-parameter interactive fractal explorer with real-time WebGL rendering.",
    },
    {
      date: "[2025-05-10]",
      activity:
        "Graphway live and being used by peers for competitive programming interview prep.",
    },
    {
      date: "[2024-05-01]",
      activity:
        "Started mentoring Data Structures & Algorithms to junior students at Manipal University Jaipur.",
    },
  ],

  education: {
    degree: "Bachelor of Technology in Computer Science & Engineering",
    university: "Manipal University Jaipur",
    cgpa: "9.27 / 10",
    year: "1st Year (Aug 2024 – Present)",
    highlights: [
      "CGPA: 9.27/10 — consistent excellence in coursework",
      "DSA Mentor — teaching Data Structures to junior students (May 2024 – Present)",
      "Startup Weekend Jaipur 2025 — 1st Place (beat 20+ teams, built full venture in 54 hours)",
      "Regular Codeforces Div. 2/3 contestant — Pupil rating",
      "Published competitive programming solutions and algorithm visualizers",
    ],
  },

  contact: {
    social: {
      LinkedIn: "https://www.linkedin.com/in/manthan-vats-102476359",
      GitHub: "https://github.com/Manthan-Vats",
      Codeforces: "https://codeforces.com/profile/Taxman_",
    },
    direct: {
      Email: "mailto:manthan.ralph17@gmail.com",
      Phone: "+91-9508007517",
    },
  },
};
