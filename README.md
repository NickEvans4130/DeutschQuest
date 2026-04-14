# DeutschQuest

A German language learning web app for A2-level English speakers targeting B1/B2, with a focus on Bavarian dialect exposure. Combines three content pillars — news digests, vocabulary flashcards, and dialect ear training — into a single ~10-minute daily session wrapped in an RPG character progression system.

![DeutschQuest Screenshot Placeholder](./docs/screenshot.png)

---

## Setup

### Prerequisites

- Node.js 18+
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Install and run

```bash
git clone git@github.com:NickEvans4130/DeutschQuest.git
cd DeutschQuest
npm install
```

Create a `.env` file in the project root:

```
VITE_GEMINI_API_KEY=your_key_here
```

Then start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Architecture

```
src/
  components/
    layout/         # AppShell, BottomNav, Header
    rpg/            # CharacterCard, XPBar, LevelBadge, StatPanel
    session/        # SessionRouter, ProgressStepper, SessionSummary
    modules/
      news/         # NewsReader with vocab highlighting
      flashcard/    # FlashCard (flip animation + SM-2 rating), CardStack
      dialect/      # DialectCard with accordion sections
    shared/         # Button, Badge, Modal, LoadingSpinner, StreakBadge
  screens/
    HomeScreen.tsx        # Character dashboard + session CTA
    SessionScreen.tsx     # Full-screen session wrapper
    ProgressScreen.tsx    # Overview / Word Bank / History tabs
    SettingsScreen.tsx    # CEFR, class, interests, dialect intensity
    OnboardingScreen.tsx  # 3-step onboarding flow
  store/
    usePlayerStore.ts     # XP, stats, level, character class
    useSessionStore.ts    # Active session, session history, daily content
    useWordBankStore.ts   # SRS word bank with due-date tracking
    useStreakStore.ts     # Streak counter with shield mechanic
  lib/
    gemini.ts             # Gemini API wrapper
    contentPipeline.ts    # Daily content generation with caching
    srs.ts                # SM-2 spaced repetition algorithm
    xp.ts                 # XP calculations and leveling thresholds
    fallbackContent.ts    # 3 static sessions for offline use
  types/
    player.ts             # Player, CharacterClass, PlayerStats
    content.ts            # Flashcard, NewsContent, DialectContent, DailyContent
    session.ts            # SessionRecord, ActiveSession, ModuleResult
```

**Tech stack:** React + TypeScript (Vite), Tailwind CSS v4, Zustand (with localStorage persistence), React Router, Lucide React icons, Google Gemini API.

---

## Content generation and daily caching

On session start, `contentPipeline.ts` checks `localStorage` for a cached entry under the key `dq_daily_content_YYYY-MM-DD`. If found, it is used directly — no API call is made.

If there is no cache, a single prompt is sent to `gemini-2.0-flash` requesting a full session object (news, 6 flashcards, dialect phrase) as JSON. The response is validated and stored in localStorage before hydrating the session store.

If the API is unavailable or the key is missing, the app falls back to one of three hardcoded static sessions in `fallbackContent.ts`. The user sees a warning banner but can still complete a full session.

Your Gemini API key goes in `.env` as `VITE_GEMINI_API_KEY`. A free tier is sufficient for personal daily use.

---

## RPG system

### Character classes

| Class | German name | Focus |
|---|---|---|
| Language Warrior | Sprachkrieger | Grammar and structure |
| Wanderer | Wanderer | Practical travel vocab |
| Scholar | Gelehrter | News comprehension and reading |
| Bavarian | Bayer | Dialect-heavy, informal register |

### Stats (0-100)

| Stat | German | Raised by |
|---|---|---|
| Vocabulary | Wortschatz | Flashcard correct answers |
| Listening | Horverstehen | Dialect module completions |
| Reading | Leseverstehen | News module completions |
| Grammar | Grammatik | Grammar-tagged flashcard correct answers |

### Leveling

- Levels 1-50. XP to next level: `level * 200`.
- Session base XP: 100, scaled by weighted module scores and a streak bonus of `1.0 + 0.05 * consecutiveDays` (capped at 2.0x).
- Level titles: 1 = Anfanger, 5 = Reisender, 10 = Stadtbewohner, 20 = Einheimischer, 30 = Bayer, 40 = Kenner, 50 = Meister.
- SVG avatar advances through 6 visual tiers at level milestones 10, 20, 30, 40, 50.

### Streak system

- Tracked by calendar day. A Streak Shield forgives one missed day per 7-day period.
- Milestone badges unlock at 7, 30, and 100 consecutive days (cosmetic only).

### Daily session (~10 minutes)

Five modules in order:

1. **News digest** — German news item simplified to A2/B1 with 3 vocab highlights
2. **Flashcard round 1** — 6 new cards + 2 SRS due cards
3. **Dialect moment** — one Bavarian phrase with Standard German equivalent, etymology, dialogue
4. **Flashcard round 2** — up to 8 SRS due cards from the word bank
5. **Session summary** — XP earned, stat gains, level progress bar

---

## Roadmap

- TTS via Web Speech API for pronunciation of phrases and flashcards
- Anki export (APKG) of word bank for power users
- Multiplayer streak comparison via a lightweight leaderboard
- Offline PWA mode (service worker + background sync)
- Grammar explanation cards triggered by grammar-tagged flashcard failures
- Listening comprehension module using audio clips
