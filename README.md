<p align="center">
  <img src="public/Nodle_Logo_Dark.svg" alt="Nodle Logo" width="360" />
</p>

<p align="center">
  <strong>A daily logic-deduction game for Tech Artists and Game Developers.</strong><br/>
  Guess the hidden node from multidimensional clues — like Wordle, but for node graphs.
</p>

<p align="center">
  <a href="https://nodle.online">🌐 Play Live</a> &nbsp;·&nbsp;
  <a href="#features">✨ Features</a> &nbsp;·&nbsp;
  <a href="#architecture">🏗️ Architecture</a> &nbsp;·&nbsp;
  <a href="#tech-stack">⚙️ Tech Stack</a> &nbsp;·&nbsp;
  <a href="#getting-started">🚀 Getting Started</a>
</p>

<br/>

---

## About

**Nodle** is a daily puzzle game where players guess a mystery node from professional DCC (Digital Content Creation) software. Each guess reveals multidimensional feedback — software, context, category, input/output counts, and frequency tier — turning every attempt into a logical deduction step.

The game is purpose-built for the Tech Art and Game Dev community, covering nodes from **Blender**, **Unreal Engine**, **Unity**, **Houdini**, and **Substance Designer**.

> Built as a solo full-stack project — from game design and data scraping to frontend implementation, backend APIs, and deployment.

---

## Features

### 🎮 Game Modes
| Mode | Description |
|---|---|
| **Classic Daily** | One puzzle per day from the entire node catalog. Same puzzle for all players worldwide. |
| **Tier 1 / 2 / 3** | Difficulty-tiered daily challenges filtered by node frequency. |
| **Software Dailies** | Dedicated daily puzzles per software: Blender, Unreal, Unity, Houdini, Substance. |
| **Practice** | Unlimited, non-competitive mode with customizable filters (software, tier). |

### 🧠 Core Mechanics
- **Multidimensional validation** — each guess reveals 6 independent clues (software, context, category, inputs ↑↓, outputs ↑↓, tier)
- **Cross-software domain matching** — partial-match logic maps equivalent contexts across engines (e.g. *Shader* ↔ *Material* ↔ *VOP*)
- **Deterministic daily puzzles** — seeded PRNG (Mulberry32) ensures all players get the same puzzle per day, per mode
- **Hard Mode** — additional constraints that force logical consistency across guesses

### 🏆 Competitive Features
- **Global Leaderboard** — server-side scoring ranked by attempts and solve time (Upstash Redis)
- **Custom nicknames** — personalized player identity across the leaderboard
- **Win streaks & statistics** — persistent stats with attempt distribution histograms
- **Shareable results** — Canvas-rendered result cards, exportable as PNG to clipboard

### ♿ Accessibility & UX
- **Dark / Light theme** — system-aware with manual toggle
- **Colorblind mode** — alternative color palette for validation feedback
- **i18n** — full English and Spanish localization via `next-intl`
- **Fuzzy search** — typo-tolerant node lookup powered by Fuse.js
- **Tutorial modal** — first-time-user onboarding
- **Responsive design** — mobile-first, fully playable on any device

### 📊 Analytics
- **PostHog integration** — privacy-respecting product analytics
- **EthicalAds** — non-intrusive, developer-friendly ad integration

---

## Architecture

```
nodle/
├── scrapers/                  # Data pipeline — per-software node scrapers
│   ├── blender/               #   Python (bpy API introspection)
│   ├── unreal/                #   Python (documentation parsing)
│   ├── unity/                 #   C# (Shader Graph reflection)
│   ├── houdini/               #   Python (HDK node extraction)
│   └── substance/             #   Python (Substance Designer parsing)
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           #   Modes Hub (landing page)
│   │   ├── daily/             #   9 daily mode routes
│   │   ├── practice/          #   Unlimited practice mode
│   │   └── api/leaderboard/   #   REST API (POST scores, GET rankings)
│   │
│   ├── components/            # 21 React components
│   │   ├── GameBoard.tsx      #   Core game grid with validation rendering
│   │   ├── SearchBar.tsx      #   Fuzzy-search autocomplete
│   │   ├── LeaderboardModal/  #   Real-time competitive rankings
│   │   └── ...
│   │
│   ├── lib/                   # Pure business logic (zero UI dependencies)
│   │   ├── daily.ts           #   PRNG-seeded daily puzzle selection
│   │   ├── validation.ts      #   Guess validation engine + domain mapping
│   │   ├── canvas.ts          #   Hi-DPI Canvas2D share-image renderer
│   │   ├── hardmode.ts        #   Hard mode constraint enforcement
│   │   └── leaderboard/       #   Pluggable backend (Upstash ↔ Mock)
│   │
│   ├── store/                 # Zustand state management (persisted)
│   │   ├── useGameStore.ts    #   Per-mode game state factory
│   │   ├── useSettingsStore.ts
│   │   └── useLocaleStore.ts
│   │
│   ├── types/                 # TypeScript interfaces
│   ├── messages/              # i18n (en.json, es.json)
│   ├── data/                  # nodes.json (1MB+ scraped catalog)
│   └── providers/             # PostHog, i18n, theme providers
│
└── public/                    # Static assets (SVG logos & icons)
```

### Key Design Decisions

| Decision | Rationale |
|---|---|
| **Seeded PRNG over server-side puzzle assignment** | Eliminates server dependency for puzzle selection. Every client independently computes the same puzzle from the UTC day index. |
| **Factory pattern for game stores** | `createGameStore(key)` generates independent Zustand stores per mode, each with its own localStorage key. Avoids state collision across 9+ game modes. |
| **Pluggable leaderboard backend** | Interface-driven design (`LeaderboardClient`) allows seamless switching between Upstash Redis (production) and an in-memory mock (development). |
| **Cross-software domain mapping** | The validation engine maps functionally equivalent node contexts (e.g., Blender's *Shader* = Unreal's *Material* = Houdini's *VOP*) to enable partial-match feedback across engines. |
| **Scrapers as independent tools** | Each scraper runs natively in its target DCC environment (Blender via `bpy`, Unity via C# Editor scripts) to extract real node metadata — not hardcoded data. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, React 19) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **State** | Zustand 5 (persisted to localStorage) |
| **Animations** | Framer Motion |
| **Search** | Fuse.js (fuzzy matching) |
| **i18n** | next-intl |
| **Theming** | next-themes |
| **Backend** | Upstash Redis (leaderboard) |
| **Analytics** | PostHog |
| **Data Pipeline** | Python + C# scrapers per DCC software |
| **Deployment** | Vercel |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/MontyAnim/Nodle.git
cd Nodle

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play locally.

### Environment Variables (Optional)

Create a `.env.local` file to enable the production leaderboard:

```env
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

> Without these variables, the app automatically falls back to an in-memory mock leaderboard.

---

## Data Pipeline

The node catalog (`src/data/nodes.json`) is generated by running software-specific scrapers that extract real node metadata:

| Software | Scraper | Method |
|---|---|---|
| Blender | `scrapers/blender/blender_scraper.py` | `bpy` API introspection at runtime |
| Unreal Engine | `scrapers/unreal/` | Documentation + Blueprint reflection |
| Unity | `scrapers/unity/ShaderGraphScraper.cs` | Editor script via Shader Graph reflection |
| Houdini | `scrapers/houdini/` | HDK / HOM node table extraction |
| Substance Designer | `scrapers/substance/` | Node definition parsing |

Each scraper outputs structured JSON conforming to the `NodeData` interface:

```typescript
interface NodeData {
  id: string;
  name: string;
  aliases: string[];
  software: string;
  context: string;       // e.g. "Shader", "Blueprint", "SOP"
  category: string;      // e.g. "Math", "Texture", "Input"
  inputs: number;
  outputs: number;
  color_hex: string;
  frequency_tier: number; // 1 (common) → 3 (rare)
}
```

---

## Author

**Diego Montúfar** — Tech Artist & Game Developer

- GitHub: [@MontyAnim](https://github.com/MontyAnim)

---

## License

This project is proprietary. All rights reserved.
