# Bring It Home — New Features Specification
## 5 Features to Penetrate the World Cup App Market

**Context**: The World Cup 2026 app landscape is dominated by FotMob (4.9★), OneFootball (4.8★), Apple Sports (4.7★), and SuperBru (192K predictor players). Competing on live scores or raw stats is suicide. These features target the gaps nobody fills.

**Core Insight**: The World Cup's magic is social and emotional, but every digital product treats it as informational. These features bridge that gap.

---

## Feature 1: "Rival Mode" — Banter-as-a-Feature

### The Problem It Solves
Research shows the #1 emotional payoff in the WC isn't your team winning — it's *earning the right to trash talk your friend whose team lost*. Sports psychologists call it "BIRGing" (Basking In Reflected Glory) and "CORFing" (Cutting Off Reflected Failure). No app serves this behavior. The real World Cup experience lives in WhatsApp group chats, not score apps.

### User Story
> As a fan, I want to challenge my friends to a prediction rivalry so that every match becomes a personal stakes contest between us, and I can rub it in when their team loses.

### Feature Specification

#### 1.1 Rival Setup Flow
```
[Pick Your Team] → [Share Invite Link] → [Friend Picks Their Team] → [Rivalry Created]
```

- User selects their team from the 48 qualified nations
- Generates a shareable link (similar to existing bracket share)
- Rival accepts → both see a "Rivalry Card" showing the matchup
- Supports multiple rivalries (1 user can have 5-10 active rivals)

#### 1.2 Rivalry Card
A persistent visual showing:
- Both users' team flags + names
- Head-to-head prediction score: "You 7 — 4 Rahul"
- Current tournament status: "Your team: Alive ✅ | Their team: Eliminated 💀"
- Banter meter: escalating based on prediction gap
- Last banter sent

#### 1.3 AI Banter Engine
After each match, Gemini generates contextual banter prompts:

**When your rival's team loses:**
> "Hey @Rahul, your team's defense today was about as organized as a queue at a Mumbai chai stall 💀"

**When your rival's team is eliminated:**
> "📜 Official Certificate of Elimination: @Rahul's hopes and dreams, 2026-2026. Cause of death: Group F. Survived by: nothing."

**When you correctly predict an upset your rival didn't:**
> "@Rahul called it 2-1 Germany. I called Japan. The scoreboard doesn't lie. 🎯"

**Tone controls**: User can set banter intensity (Mild / Spicy / Savage)

#### 1.4 Prediction Duel
For each match:
- Both rivals predict: Score, MOTM, First Goal Scorer
- Predictions locked before kickoff
- After match: side-by-side comparison with points
- Running score: "Season record: You 14 — 8 Rahul"

#### 1.5 Shareable Moments
Auto-generated cards (via html2canvas, already in the repo):
- "I Called It" card when you get exact score right
- "Rivalry Update" card after each matchday
- "Elimination Eulogy" when rival's team is knocked out
- "Tournament Wrapped" — full rivalry summary at tournament end

### Architecture

```
src/
├── lib/
│   ├── rivals.ts              # Rival data structures, scoring logic
│   └── banter-engine.ts       # Gemini prompt templates for banter
├── app/
│   ├── api/
│   │   ├── rivals/
│   │   │   ├── route.ts       # POST create rivalry, GET list rivalries
│   │   │   └── [id]/route.ts  # GET rivalry details, PUT update predictions
│   │   └── banter/
│   │       └── route.ts       # POST generate banter via Gemini
│   └── rivals/
│       ├── page.tsx           # Rivalry dashboard
│       └── [id]/page.tsx      # Individual rivalry view
├── components/
│   └── rivals/
│       ├── RivalryCard.tsx    # The main rivalry display card
│       ├── PredictionDuel.tsx # Side-by-side prediction input
│       ├── BanterFeed.tsx     # AI-generated banter timeline
│       └── ShareCard.tsx      # Shareable moment generator
└── types/index.ts             # Add Rival, Rivalry, Prediction types
```

### Data Model

```typescript
// Add to src/types/index.ts

export interface Rival {
  id: string;                    // UUID
  name: string;                  // Display name
  teamId: string;                // Their chosen team (e.g., 'BRA')
  avatarSeed: string;            // For generating consistent avatar
}

export interface Rivalry {
  id: string;                    // UUID
  createdAt: string;             // ISO timestamp
  inviteCode: string;            // 6-char shareable code
  user: Rival;
  opponent: Rival;
  predictions: RivalryPrediction[];
  banterHistory: BanterMessage[];
  score: { user: number; opponent: number };
}

export interface RivalryPrediction {
  matchId: string;
  userPrediction: {
    homeScore: number;
    awayScore: number;
    motm?: string;
    firstScorer?: string;
  } | null;
  opponentPrediction: {
    homeScore: number;
    awayScore: number;
    motm?: string;
    firstScorer?: string;
  } | null;
  actual?: {
    homeScore: number;
    awayScore: number;
    motm?: string;
    firstScorer?: string;
  };
  userPoints: number;
  opponentPoints: number;
  locked: boolean;
}

export interface BanterMessage {
  id: string;
  timestamp: string;
  text: string;
  type: 'auto' | 'achievement' | 'elimination';
  triggeredBy: 'match_result' | 'prediction' | 'elimination';
}
```

### State Management

```typescript
// Add to src/lib/store.ts (Zustand)

interface RivalrySlice {
  rivalries: Rivalry[];
  activeRivalryId: string | null;
  banterIntensity: 'mild' | 'spicy' | 'savage';
  addRivalry: (rivalry: Rivalry) => void;
  updatePrediction: (rivalryId: string, matchId: string, prediction: PredictionInput) => void;
  setActiveRivalry: (id: string | null) => void;
  setBanterIntensity: (level: 'mild' | 'spicy' | 'savage') => void;
}
```

### Banter Engine Prompts

```typescript
// src/lib/banter-engine.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

const BANTER_SYSTEM_PROMPT = `You are a witty sports commentator generating friendly banter between World Cup rivals.
Rules:
- Keep it under 140 characters (shareable on social)
- Be funny but never cruel, racist, or political
- Reference specific match events when provided
- Match the intensity level: mild (family-friendly), spicy (pub banter), savage (no mercy)
- Use 1-2 emojis max
- Never use hashtags`;

interface BanterContext {
  winnerTeam: string;
  loserTeam: string;
  score: string;
  keyEvent?: string;          // "90th minute equalizer" / "penalty miss"
  rivalName: string;
  intensity: 'mild' | 'spicy' | 'savage';
  type: 'match_loss' | 'elimination' | 'wrong_prediction' | 'streak_broken';
}

export async function generateBanter(ctx: BanterContext): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Generate ${ctx.intensity} banter for this situation:
${ctx.rivalName}'s team (${ctx.loserTeam}) just lost to ${ctx.winnerTeam} ${ctx.score}.
${ctx.keyEvent ? `Key moment: ${ctx.keyEvent}` : ''}
Type: ${ctx.type}

One line only. Address ${ctx.rivalName} directly.`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: BANTER_SYSTEM_PROMPT,
  });

  return result.response.text().trim();
}
```

### Scoring System

```typescript
// src/lib/rivals.ts

export function scorePrediction(
  prediction: { homeScore: number; awayScore: number },
  actual: { homeScore: number; awayScore: number }
): number {
  // Exact score: 10 points
  if (prediction.homeScore === actual.homeScore &&
      prediction.awayScore === actual.awayScore) {
    return 10;
  }

  // Correct result (W/D/L) + correct goal difference: 7 points
  const predDiff = prediction.homeScore - prediction.awayScore;
  const actDiff = actual.homeScore - actual.awayScore;
  const predResult = Math.sign(predDiff);
  const actResult = Math.sign(actDiff);

  if (predResult === actResult && predDiff === actDiff) {
    return 7;
  }

  // Correct result only: 5 points
  if (predResult === actResult) {
    return 5;
  }

  // Correct total goals: 2 points
  const predTotal = prediction.homeScore + prediction.awayScore;
  const actTotal = actual.homeScore + actual.awayScore;
  if (predTotal === actTotal) {
    return 2;
  }

  // Wrong: 0 points
  return 0;
}
```

### Sharing Implementation

```typescript
// src/components/rivals/ShareCard.tsx
// Uses html2canvas (already a dependency in the project)

import html2canvas from 'html2canvas';

export async function generateShareImage(cardRef: React.RefObject<HTMLDivElement>): Promise<string> {
  if (!cardRef.current) throw new Error('Card ref not found');

  const canvas = await html2canvas(cardRef.current, {
    backgroundColor: '#0a0a0f',
    scale: 2,
    useCORS: true,
  });

  return canvas.toDataURL('image/png');
}

// Share via Web Share API or download
export async function shareCard(imageUrl: string, text: string) {
  if (navigator.share) {
    const blob = await (await fetch(imageUrl)).blob();
    const file = new File([blob], 'rivalry-update.png', { type: 'image/png' });
    await navigator.share({ text, files: [file] });
  } else {
    // Fallback: download
    const link = document.createElement('a');
    link.download = 'rivalry-update.png';
    link.href = imageUrl;
    link.click();
  }
}
```

### Storage Strategy
- **Before launch**: localStorage via Zustand persist (same as current bracket/prediction storage)
- **V2**: Serverless KV store (Vercel KV or Upstash Redis) for cross-device sync
- **Invite system**: 6-char invite codes encoded in URL params, similar to existing bracket share

### Estimated Effort: 3-4 days

---

## Feature 2: "What Should I Watch?" — The Overwhelm Solver

### The Problem It Solves
48 teams × 104 matches × 16 venues × 3 time zones = cognitive overload. The 2026 format is 50% larger than 2022. Casual fans who watch football every 4 years are completely lost. Even hardcore fans can't track 12 groups simultaneously. App store reviews specifically cite the expanded format as confusing.

No app acts as a **curator**. They all dump the full schedule and say "figure it out."

### User Story
> As a casual fan, I want the app to tell me which matches I absolutely must watch today, so that I don't miss the exciting games but also don't need to watch all 4 simultaneous matches.

### Feature Specification

#### 2.1 Quick Onboarding (3 questions)

```
Question 1: "What team are you supporting?" → 48 team picker with search
Question 2: "How much football do you watch?" → Casual / Regular / Hardcore
Question 3: "What's your timezone?" → Auto-detected, user confirms
```

Stored in Zustand. Can be changed anytime in settings.

#### 2.2 Daily Briefing Card (Home Page)

A card on the home page that answers: "What should I watch today?"

```
┌──────────────────────────────────────────┐
│  📅 Today's Matches — June 15, 2026     │
│                                          │
│  🔥 MUST WATCH                           │
│  ┌────────────────────────────────────┐  │
│  │ 🇯🇵 Japan vs Germany 🇩🇪    7:00 PM │  │
│  │ "High upset probability (38%).     │  │
│  │  Japan shocked Germany in 2022.    │  │
│  │  History could repeat."            │  │
│  └────────────────────────────────────┘  │
│                                          │
│  👀 WORTH WATCHING                       │
│  🇧🇷 Brazil vs Scotland 🏴   4:00 PM    │
│  "Vinícius Jr's first WC start.       │  │
│   Brazil are favorites but Scotland   │  │
│   has nothing to lose."               │  │
│                                          │
│  😴 SKIP (catch highlights)             │
│  🇹🇳 Tunisia vs Sweden 🇸🇪   1:00 PM    │
│  🇶🇦 Qatar vs Bosnia 🇧🇦   1:00 PM      │
│                                          │
│  📱 Your team plays tomorrow:            │
│  🇦🇷 Argentina vs Austria 🇦🇹  4:00 PM  │
└──────────────────────────────────────────┘
```

#### 2.3 Match Importance Algorithm

```typescript
// src/lib/match-importance.ts

interface MatchImportance {
  score: number;       // 0-100
  tier: 'must_watch' | 'worth_watching' | 'skip';
  reason: string;      // AI-generated 1-2 sentence explanation
}

export function calculateImportance(
  match: Match,
  userTeam: string,
  userLevel: 'casual' | 'regular' | 'hardcore',
  tournamentState: TournamentState
): MatchImportance {
  let score = 0;
  const reasons: string[] = [];

  // Factor 1: User's team involved (+50)
  if (match.homeTeam.id === userTeam || match.awayTeam.id === userTeam) {
    score += 50;
    reasons.push('Your team is playing');
  }

  // Factor 2: Upset probability from Monte Carlo sim (+0-25)
  const upsetProb = getUpsetProbability(match);
  if (upsetProb > 0.3) {
    score += Math.round(upsetProb * 25);
    reasons.push(`${Math.round(upsetProb * 100)}% upset chance`);
  }

  // Factor 3: Star player presence (+0-15)
  const starPlayers = getStarPlayers(match); // top 50 players by OVR
  if (starPlayers.length > 0) {
    score += Math.min(15, starPlayers.length * 5);
    reasons.push(`Stars: ${starPlayers.slice(0, 2).map(p => p.name).join(', ')}`);
  }

  // Factor 4: Elimination implications (+0-20)
  if (tournamentState.stage === 'group' && tournamentState.matchday >= 2) {
    const elimImplication = getEliminationImplication(match, tournamentState);
    if (elimImplication.couldEliminate) {
      score += 20;
      reasons.push(`Could eliminate ${elimImplication.teamAtRisk}`);
    }
  }

  // Factor 5: Historical rivalry (+0-10)
  const rivalry = getHistoricalRivalry(match.homeTeam.id, match.awayTeam.id);
  if (rivalry.isClassic) {
    score += 10;
    reasons.push(rivalry.narrative); // "Classic rivalry — 4th WC meeting"
  }

  // Factor 6: Knockout match automatic boost (+30)
  if (tournamentState.stage !== 'group') {
    score += 30;
    reasons.push('Knockout stage — win or go home');
  }

  // Adjust for user level
  if (userLevel === 'casual') {
    // Casual fans get more aggressive filtering
    // Only show top 2-3 matches per day
  }

  const tier = score >= 60 ? 'must_watch'
             : score >= 30 ? 'worth_watching'
             : 'skip';

  return { score, tier, reason: reasons[0] || '' };
}
```

#### 2.4 "Casual Fan" Narrative Mode

For users who selected "Casual" in onboarding, replace stats/tactics with narrative context:

```typescript
// Instead of: "Morocco — FIFA Rank #14, 4-3-3, Hakimi RB, Amrabat CDM"
// Show: "Root for Morocco because they knocked out Belgium and Spain in 2022
//        and nobody sees them coming. Their fullback Hakimi is the fastest
//        defender in the tournament. The underdog story writes itself."
```

Generated via Gemini with a prompt template:

```typescript
const CASUAL_TEAM_PROMPT = `Write a 2-sentence "why you should root for" blurb for this team.
Target audience: someone who watches football once every 4 years.
Tone: excited friend explaining at a bar, not a commentator.
Include: one fun fact, one player to watch, their underdog/favourite status.
Team: {teamName}, FIFA rank #{rank}, group stage opponents: {opponents}
Previous WC result: {lastResult}`;
```

#### 2.5 Smart Notifications

```typescript
// Notification tiers:
// MUST_WATCH team plays in 15 min → push notification
// Your team plays in 60 min → push notification
// Upset alert: underdog leading at half-time → push notification
// SKIP match: no notification ever

// Implementation: use existing Next.js service worker (manifest.json already exists)
```

### Architecture

```
src/
├── lib/
│   ├── match-importance.ts     # Importance scoring algorithm
│   ├── casual-narratives.ts    # Gemini prompt templates for casual fans
│   └── smart-notifications.ts  # Push notification logic
├── app/
│   └── api/
│       └── briefing/
│           └── route.ts        # GET daily briefing for user preferences
├── components/
│   ├── briefing/
│   │   ├── DailyBriefing.tsx   # The main "what to watch" card
│   │   ├── MatchTierCard.tsx   # Individual match with tier badge
│   │   └── CasualExplainer.tsx # Narrative team/match context
│   └── onboarding/
│       └── WatchPreferences.tsx # 3-question setup
└── types/index.ts              # Add WatchPreferences, MatchImportance types
```

### Estimated Effort: 2-3 days

---

## Feature 3: "Beat the Algorithm" — AI Prediction Engine with Explainability

### The Problem It Solves
Opta's AI predictions are public. Polymarket has $1.8B in volume. But neither lets you *argue with the model*. The prediction itself isn't the product — the **conversation about the prediction** is. "You think France beats Japan? Here's why I disagree" is more engaging than any probability number.

This is also the **strongest AI PM portfolio signal**. It demonstrates: explainable AI UX, user trust calibration, interactive model interfaces — the hardest problems in AI product design.

### User Story
> As a fan, I want to see the AI's prediction for every match with a clear explanation, then make my own prediction, and track whether I'm beating the algorithm over the tournament.

### Feature Specification

#### 3.1 Match Prediction Interface

```
┌──────────────────────────────────────────────┐
│  🇫🇷 France vs Japan 🇯🇵                      │
│  ─────────────────────────────────────────── │
│  🤖 AI PREDICTION                            │
│  France 67% — Draw 18% — Japan 15%           │
│                                              │
│  WHY?                                        │
│  "France's midfield depth (Tchouaméni,       │
│   Camavinga, Zaïre-Emery) controls tempo.    │
│   Mbappé's 97 pace exploits Japan's high     │
│   defensive line. But Japan's pressing       │
│   troubled Germany in 2022 — don't sleep     │
│   on them."                                  │
│                                              │
│  ⚙️ TOGGLE FACTORS                           │
│  [✓] Current form                            │
│  [✓] Historical matchups                     │
│  [ ] Home advantage (neutral venue)          │
│  [✓] Key player availability                 │
│  [ ] What if Mbappé is injured?              │
│      → France drops to 52% ↓                 │
│                                              │
│  YOUR PREDICTION                             │
│  [France ▼] [2] — [1] [Japan ▼]             │
│  Confidence: ████████░░ 80%                  │
│                                              │
│  [Lock In Prediction 🔒]                     │
│                                              │
│  ─────────────────────────────────────────── │
│  📊 YOUR RECORD vs AI                        │
│  You: 58% accurate | AI: 71%                 │
│  You beat the AI on 3 upsets! 🎯             │
└──────────────────────────────────────────────┘
```

#### 3.2 Explainability Engine

Each prediction comes with a structured explanation:

```typescript
// src/lib/prediction-explainer.ts

interface PredictionExplanation {
  summary: string;           // 2-sentence human-readable explanation
  factors: PredictionFactor[];
  whatIf: WhatIfScenario[];
  historicalContext: string;  // "These teams met 3 times. France won 2."
}

interface PredictionFactor {
  name: string;              // "Midfield Control"
  impact: number;            // -20 to +20 on win probability
  explanation: string;       // "Rodri's 86 DEF anchors Spain's build-up"
  toggleable: boolean;       // User can turn this on/off
}

interface WhatIfScenario {
  label: string;             // "What if Mbappé is injured?"
  adjustedProbability: {
    home: number;
    draw: number;
    away: number;
  };
  explanation: string;       // "France drops from 67% to 52% without their primary goal threat"
}
```

#### 3.3 Factor-Toggling Architecture

The existing Monte Carlo simulator (`src/app/api/simulator/route.ts`) already takes `formA`, `formB`, `neutral` as inputs. Extend it:

```typescript
// src/app/api/simulator/route.ts — EXTENDED

interface SimRequest {
  teamAId: string;
  teamBId: string;
  formA: number;
  formB: number;
  neutral: boolean;
  // NEW: toggleable factors
  factors?: {
    useCurrentForm?: boolean;      // default true
    useHistoricalMatchups?: boolean; // default true
    homeAdvantage?: boolean;        // default false for WC
    keyPlayerMissing?: string[];    // player IDs to "remove"
    weatherImpact?: boolean;        // stadium weather via API
  };
}

// Modify the simulation loop:
function runSimulation(req: SimRequest): SimResult {
  const iterations = 10000;
  let teamARating = getTeamRating(req.teamAId);
  let teamBRating = getTeamRating(req.teamBId);

  // Apply factor toggles
  if (req.factors?.keyPlayerMissing) {
    for (const playerId of req.factors.keyPlayerMissing) {
      const player = getPlayer(playerId);
      if (player) {
        // Star player absence reduces team rating
        const impact = (player.attributes.ovr - 70) * 0.15;
        if (player.teamId === req.teamAId) teamARating -= impact;
        if (player.teamId === req.teamBId) teamBRating -= impact;
      }
    }
  }

  if (!req.factors?.useCurrentForm) {
    // Neutralize form impact
    req.formA = 7.5;
    req.formB = 7.5;
  }

  if (req.factors?.homeAdvantage) {
    // +3% to home team (though WC is mostly neutral)
    teamARating += 2;
  }

  // ... rest of Monte Carlo simulation
}
```

#### 3.4 AI Narrative Generation

```typescript
// src/lib/prediction-narratives.ts

const PREDICTION_NARRATIVE_PROMPT = `You are an expert football analyst generating a match prediction explanation.

Match: {homeTeam} ({homeRank}) vs {awayTeam} ({awayRank})
AI Prediction: {homeWin}% / {draw}% / {awayWin}%
Venue: {stadium}, {city}
Key factors: {factors}

Write a 2-3 sentence analysis explaining WHY the AI predicts this result.
Reference specific players by name and their attributes.
Mention one historical fact if relevant.
Tone: Confident analyst, not hedging. Take a clear position.
Max 200 characters.`;
```

#### 3.5 Accuracy Tracking

```typescript
// src/lib/prediction-tracker.ts

interface PredictionRecord {
  matchId: string;
  userPrediction: { home: number; away: number; confidence: number };
  aiPrediction: { homeWin: number; draw: number; awayWin: number };
  actual: { home: number; away: number } | null;
  userCorrect: boolean | null;
  aiCorrect: boolean | null;
}

interface PredictionStats {
  totalPredictions: number;
  userAccuracy: number;        // % correct results
  aiAccuracy: number;          // % correct results
  userUpsetsCalled: number;    // Times user predicted upset correctly
  aiUpsetsCalled: number;
  currentStreak: number;       // Consecutive correct predictions
  bestStreak: number;
  percentile: number;          // "Better than X% of fans" (local leaderboard)
}

// Percentile is computed against all users who've made predictions
// (stored in localStorage, compared against anonymous aggregate via API)
```

#### 3.6 "Called It" Achievement System

```typescript
// Achievements tied to predictions:
const PREDICTION_ACHIEVEMENTS = [
  { id: 'first-prediction', name: 'Fortune Teller', desc: 'Made your first prediction', icon: '🔮' },
  { id: 'exact-score', name: 'Clairvoyant', desc: 'Predicted the exact score', icon: '🎯' },
  { id: 'upset-caller', name: 'Giant Killer', desc: 'Correctly predicted an upset', icon: '⚡' },
  { id: 'beat-ai-3', name: 'Human > Machine', desc: 'Beat the AI on 3 consecutive matches', icon: '🧠' },
  { id: 'beat-ai-10', name: 'The Oracle', desc: 'Beat the AI on 10+ matches', icon: '👁️' },
  { id: 'streak-5', name: 'Hot Streak', desc: '5 correct predictions in a row', icon: '🔥' },
  { id: 'all-group-stage', name: 'Completionist', desc: 'Predicted every group stage match', icon: '📋' },
  { id: 'final-prediction', name: 'Main Character', desc: 'Correctly predicted the final result', icon: '🏆' },
];
```

### Architecture

```
src/
├── lib/
│   ├── prediction-explainer.ts   # Factor analysis + what-if scenarios
│   ├── prediction-narratives.ts  # Gemini prompt templates
│   ├── prediction-tracker.ts     # Accuracy tracking + stats
│   └── prediction-achievements.ts # Achievement definitions
├── app/
│   ├── api/
│   │   ├── simulator/route.ts    # MODIFIED: add factor toggles
│   │   └── predictions/
│   │       ├── route.ts          # GET/POST user predictions
│   │       └── leaderboard/route.ts # GET anonymous aggregate stats
│   └── predictions/
│       └── page.tsx              # Predictions hub
├── components/
│   └── predictions/
│       ├── MatchPrediction.tsx   # Full prediction interface
│       ├── FactorToggles.tsx     # Interactive factor switches
│       ├── AIExplanation.tsx     # Narrative explanation card
│       ├── AccuracyTracker.tsx   # User vs AI running score
│       ├── AchievementToast.tsx  # Pop-up when achievement unlocked
│       └── PredictionCard.tsx    # Shareable prediction card
└── types/index.ts
```

### Estimated Effort: 4-5 days

---

## Feature 4: "Group Stage Chaos" — Interactive Elimination Scenarios

### The Problem It Solves
"Can my team still qualify?" is the most-Googled World Cup question every tournament. With 12 groups instead of 8, the permutations are exponentially more complex. The existing group simulator (`IfThisHappens.tsx`) is already one of the app's best features — but it only handles one group at a time and doesn't show cross-group implications or real-time elimination probability.

### User Story
> As a fan, I want to explore every possible scenario for my team's group — mash a "randomize" button to see different futures, understand exactly what results my team needs, and feel the drama when elimination is on the line.

### Feature Specification

#### 4.1 "Can [Team] Still Qualify?" — Single Answer

A prominent button/widget on the team page and group page:

```
┌──────────────────────────────────────────┐
│  Can Argentina still qualify?            │
│                                          │
│  ✅ YES — and here's what needs          │
│  to happen:                              │
│                                          │
│  GUARANTEED if:                          │
│  • Argentina beat Jordan (any score)     │
│                                          │
│  STILL POSSIBLE if:                      │
│  • Argentina draw Jordan AND             │
│    Austria don't beat Algeria by 3+      │
│                                          │
│  ELIMINATED if:                          │
│  • Argentina lose AND Austria win        │
│                                          │
│  Current probability: 94%               │
│  ████████████████████░░░░ 94%           │
└──────────────────────────────────────────┘
```

#### 4.2 "Chaos Mode" — Random Scenario Generator

A "Randomize" button that generates a random set of remaining results and shows consequences:

```typescript
// src/lib/chaos-engine.ts

interface ChaosScenario {
  id: string;
  results: Record<string, { home: number; away: number }>;  // matchId → score
  qualifiers: string[];       // Team IDs that qualify
  eliminatedTeams: string[];
  upsets: string[];           // "Japan beat Germany 2-1"
  narrative: string;          // AI-generated "In this timeline..."
}

export function generateChaosScenario(
  group: Group,
  fixedResults: Record<string, MatchResult>,  // Already-played matches
  remainingMatches: Match[]
): ChaosScenario {
  const results: Record<string, { home: number; away: number }> = {};

  for (const match of remainingMatches) {
    // Generate random but realistic scores
    // Weighted by team ratings (better teams more likely to win)
    const homeStrength = getTeamRating(match.homeTeam.id);
    const awayStrength = getTeamRating(match.awayTeam.id);
    const ratio = homeStrength / (homeStrength + awayStrength);

    const rand = Math.random();
    let homeScore: number, awayScore: number;

    if (rand < ratio * 0.7) {
      // Home win
      homeScore = Math.floor(Math.random() * 3) + 1;
      awayScore = Math.floor(Math.random() * homeScore);
    } else if (rand < ratio * 0.7 + 0.25) {
      // Draw
      homeScore = awayScore = Math.floor(Math.random() * 3);
    } else {
      // Away win
      awayScore = Math.floor(Math.random() * 3) + 1;
      homeScore = Math.floor(Math.random() * awayScore);
    }

    results[match.id] = { home: homeScore, away: awayScore };
  }

  const standings = computeStandings({ ...fixedResults, ...results });
  const qualifiers = standings.slice(0, 2).map(s => s.teamId);
  const eliminated = standings.slice(2).map(s => s.teamId);

  return {
    id: crypto.randomUUID(),
    results,
    qualifiers,
    eliminatedTeams: eliminated,
    upsets: findUpsets(results, remainingMatches),
    narrative: '', // Generated by Gemini
  };
}
```

#### 4.3 Elimination Drama Animation

When a scenario results in a team being eliminated, show a dramatic animation:

```typescript
// src/components/groups/EliminationBanner.tsx

export function EliminationBanner({ teamId, teamName }: { teamId: string; teamName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center"
    >
      <div className="text-3xl mb-2">💀</div>
      <p className="text-red-400 font-bold">{teamName} ELIMINATED</p>
      <p className="text-gray-500 text-xs mt-1">In this scenario</p>
    </motion.div>
  );
}
```

#### 4.4 Cross-Group Implications

For the Round of 32, group results affect other groups through seeding:

```typescript
// src/lib/cross-group.ts

interface CrossGroupImplication {
  sourceGroup: string;        // "Group A"
  targetGroup: string;        // "Group B"
  implication: string;        // "If Mexico finishes 1st in Group A, they face Group B runner-up"
  affectedTeams: string[];    // Teams whose R32 matchup changes
}

export function getCrossGroupImplications(
  groupResults: Record<string, StandingRow[]>
): CrossGroupImplication[] {
  // R32 matchup rules for 2026 format:
  // A1 vs B2 (or C2), B1 vs A2, etc.
  // Show which R32 matchup changes based on group position
  // ...
}
```

#### 4.5 Live Tournament Mode

During the actual tournament, this feature becomes real-time:

```typescript
// After each real match result:
// 1. Auto-update standings
// 2. Recalculate qualification probabilities
// 3. Show "THIS JUST HAPPENED" banner
// 4. If a team is mathematically eliminated → dramatic notification
// 5. If a team has qualified → celebration animation
```

### Architecture Changes

```
src/
├── lib/
│   ├── chaos-engine.ts         # Random scenario generator
│   ├── qualification-calc.ts   # "Can X still qualify?" calculator
│   └── cross-group.ts          # Cross-group R32 implications
├── components/
│   └── groups/
│       ├── IfThisHappens.tsx    # MODIFIED: add chaos mode button
│       ├── ChaosMode.tsx       # Random scenario UI
│       ├── QualificationCheck.tsx # "Can X qualify?" widget
│       ├── EliminationBanner.tsx # Dramatic elimination animation
│       └── CrossGroupMap.tsx    # Visual map of cross-group implications
```

### Estimated Effort: 2-3 days (builds heavily on existing IfThisHappens.tsx)

---

## Feature 5: "Fan Passport" — Your Tournament Identity

### The Problem It Solves
Research confirmed: **no major "World Cup Wrapped" product exists**. Spotify Wrapped proved that personalized, shareable recap content is the highest-virality format in consumer apps. The app already has a thin Wrapped feature (`WCWrapped.tsx`), but it needs to become the app's signature social/viral mechanic.

The key insight: Wrapped works because it gives people a **social identity artifact** — "this is who I am as a [music listener / World Cup fan]." The Fan Passport extends this from an end-of-tournament summary to an **ongoing, accumulating identity** throughout the tournament.

### User Story
> As a fan, I want to collect stamps and achievements throughout the tournament that build into my personal World Cup story, which I can share on social media and compare with friends.

### Feature Specification

#### 5.1 Passport Structure

```
┌──────────────────────────────────────────┐
│  🛂 MY FAN PASSPORT                     │
│  ─────────────────────────────────────── │
│  [Photo/Avatar]                          │
│  Skand's World Cup 2026                  │
│  Supporting: 🇦🇷 Argentina               │
│  Fan Level: ⭐⭐⭐ "Match Analyst"        │
│  Active since: June 11, 2026            │
│                                          │
│  ═══ STAMPS ════════════════════════════ │
│                                          │
│  GROUP STAGE         [6/12 stamps]       │
│  🟢 First Prediction  🟢 First "Called It" │
│  🟢 Upset Caller      🟢 Bracket Builder  │
│  ⚫ Sweep (all right)  ⚫ 5-Match Streak  │
│  🟢 Group Guru        🟢 Chaos Explorer   │
│  ⚫ Perfect Group      ⚫ Data Nerd        │
│  ⚫ Social Sharer      ⚫ Night Owl        │
│                                          │
│  ROUND OF 32         [0/8 stamps]        │
│  ⚫ ⚫ ⚫ ⚫ ⚫ ⚫ ⚫ ⚫                      │
│                                          │
│  QUARTERFINALS       [0/6 stamps]        │
│  ⚫ ⚫ ⚫ ⚫ ⚫ ⚫                            │
│                                          │
│  SEMIFINALS          [0/4 stamps]        │
│  ⚫ ⚫ ⚫ ⚫                                │
│                                          │
│  FINAL               [0/4 stamps]        │
│  ⚫ ⚫ ⚫ ⚫                                │
│                                          │
│  ═══ JOURNEY STATS ════════════════════  │
│  Matches predicted: 24                   │
│  Accuracy: 62%                           │
│  Upsets called: 3                        │
│  AI beaten: 8 times                      │
│  Rivalries active: 2                     │
│  Banter sent: 14                         │
│  Share cards created: 7                  │
│                                          │
│  [Share My Passport 📱]                  │
└──────────────────────────────────────────┘
```

#### 5.2 Stamp System

```typescript
// src/lib/passport-stamps.ts

export interface Stamp {
  id: string;
  name: string;
  description: string;
  icon: string;
  stage: 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'final' | 'meta';
  category: 'prediction' | 'social' | 'exploration' | 'achievement';
  condition: (state: UserState) => boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export const STAMPS: Stamp[] = [
  // ═══════ GROUP STAGE ═══════
  {
    id: 'first-prediction',
    name: 'Fortune Teller',
    description: 'Made your first match prediction',
    icon: '🔮',
    stage: 'group',
    category: 'prediction',
    condition: (s) => s.totalPredictions >= 1,
    rarity: 'common',
  },
  {
    id: 'exact-score',
    name: 'Clairvoyant',
    description: 'Predicted an exact scoreline',
    icon: '🎯',
    stage: 'group',
    category: 'prediction',
    condition: (s) => s.exactScorePredictions >= 1,
    rarity: 'rare',
  },
  {
    id: 'upset-caller',
    name: 'Giant Killer',
    description: 'Correctly predicted an upset',
    icon: '⚡',
    stage: 'group',
    category: 'prediction',
    condition: (s) => s.upsetsCalled >= 1,
    rarity: 'uncommon',
  },
  {
    id: 'bracket-builder',
    name: 'Architect',
    description: 'Completed your knockout bracket',
    icon: '🏗️',
    stage: 'group',
    category: 'exploration',
    condition: (s) => s.bracketComplete,
    rarity: 'common',
  },
  {
    id: 'chaos-explorer',
    name: 'Multiverse Explorer',
    description: 'Generated 10+ chaos scenarios',
    icon: '🌀',
    stage: 'group',
    category: 'exploration',
    condition: (s) => s.chaosScenarios >= 10,
    rarity: 'uncommon',
  },
  {
    id: 'beat-ai-5',
    name: 'Human > Machine',
    description: 'Beat the AI on 5+ predictions',
    icon: '🧠',
    stage: 'group',
    category: 'achievement',
    condition: (s) => s.aiBeatCount >= 5,
    rarity: 'uncommon',
  },
  {
    id: 'five-streak',
    name: 'On Fire',
    description: '5 correct predictions in a row',
    icon: '🔥',
    stage: 'group',
    category: 'achievement',
    condition: (s) => s.bestStreak >= 5,
    rarity: 'rare',
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Made a prediction after midnight local time',
    icon: '🦉',
    stage: 'group',
    category: 'meta',
    condition: (s) => s.lateNightPredictions >= 1,
    rarity: 'common',
  },
  {
    id: 'social-sharer',
    name: 'Town Crier',
    description: 'Shared 3+ cards to social media',
    icon: '📣',
    stage: 'group',
    category: 'social',
    condition: (s) => s.sharesCount >= 3,
    rarity: 'common',
  },
  {
    id: 'rivalry-started',
    name: 'Challenger',
    description: 'Started a rivalry with a friend',
    icon: '⚔️',
    stage: 'group',
    category: 'social',
    condition: (s) => s.rivalries >= 1,
    rarity: 'common',
  },
  {
    id: 'data-nerd',
    name: 'Stat Padder',
    description: 'Viewed 20+ player cards',
    icon: '📊',
    stage: 'group',
    category: 'exploration',
    condition: (s) => s.playerCardsViewed >= 20,
    rarity: 'common',
  },
  {
    id: 'globetrotter',
    name: 'Globetrotter',
    description: 'Explored all 16 stadiums',
    icon: '🌍',
    stage: 'group',
    category: 'exploration',
    condition: (s) => s.stadiumsViewed >= 16,
    rarity: 'uncommon',
  },

  // ═══════ KNOCKOUT STAGE ═══════
  {
    id: 'bracket-alive',
    name: 'Still Standing',
    description: 'Your bracket pick survived the Round of 32',
    icon: '💪',
    stage: 'r32',
    category: 'prediction',
    condition: (s) => s.bracketPickSurvived.r32,
    rarity: 'uncommon',
  },
  {
    id: 'banter-king',
    name: 'Banter King',
    description: 'Sent 10+ banter messages to rivals',
    icon: '👑',
    stage: 'r32',
    category: 'social',
    condition: (s) => s.banterSent >= 10,
    rarity: 'uncommon',
  },
  {
    id: 'quarter-oracle',
    name: 'Quarter Oracle',
    description: 'Predicted all 4 quarterfinalists correctly',
    icon: '🔮',
    stage: 'qf',
    category: 'prediction',
    condition: (s) => s.correctQFPredictions >= 4,
    rarity: 'legendary',
  },
  {
    id: 'final-caller',
    name: 'Main Character',
    description: 'Correctly predicted the World Cup winner',
    icon: '🏆',
    stage: 'final',
    category: 'achievement',
    condition: (s) => s.predictedWinner,
    rarity: 'legendary',
  },
];
```

#### 5.3 Fan Level System

```typescript
// src/lib/fan-levels.ts

export const FAN_LEVELS = [
  { level: 1, name: 'Casual Viewer',    minStamps: 0,  stars: 1, icon: '👀' },
  { level: 2, name: 'Match Goer',       minStamps: 3,  stars: 1, icon: '🎟️' },
  { level: 3, name: 'Armchair Analyst',  minStamps: 6,  stars: 2, icon: '📺' },
  { level: 4, name: 'Match Analyst',     minStamps: 10, stars: 3, icon: '📋' },
  { level: 5, name: 'Tournament Expert', minStamps: 15, stars: 4, icon: '🎓' },
  { level: 6, name: 'World Cup Oracle',  minStamps: 22, stars: 5, icon: '🔮' },
  { level: 7, name: 'Football God',      minStamps: 30, stars: 5, icon: '⚽' },
];

export function getFanLevel(stampCount: number): typeof FAN_LEVELS[0] {
  return [...FAN_LEVELS].reverse().find(l => stampCount >= l.minStamps) ?? FAN_LEVELS[0];
}
```

#### 5.4 Shareable Passport Card

Generate beautiful share cards at key moments:

```typescript
// src/components/passport/PassportShareCard.tsx

interface ShareCardProps {
  type: 'mid-tournament' | 'end-tournament' | 'stamp-earned';
  passport: PassportData;
}

// Mid-tournament card:
// "Day 18 of 30. I've predicted 24 matches, called 3 upsets,
//  and my team is still alive. Stamp progress: 14/34."

// End-tournament card (the "Wrapped"):
// Full stats + emotional journey + AI narrative

// Stamp earned card:
// "🎯 STAMP EARNED: Clairvoyant — I predicted France 2-1 Japan exact score!"
```

#### 5.5 AI-Generated Journey Narrative (Tournament Wrapped)

At tournament end, Gemini generates a personalized narrative:

```typescript
// src/lib/passport-narrative.ts

const JOURNEY_PROMPT = `Generate a personalized World Cup 2026 journey narrative for this fan.

Fan data:
- Supported: {team} (result: {teamResult})
- Predictions made: {totalPredictions} ({accuracy}% accurate)
- Best prediction: {bestPrediction}
- Worst prediction: {worstPrediction}
- Upsets called: {upsetsCalled}
- Beat the AI: {aiBeatCount} times
- Rivalries: {rivalryResults}
- Stamps earned: {stampCount}/{totalStamps}
- Fan level: {fanLevel}
- Most watched stage: {mostActiveStage}

Write a 4-paragraph narrative of their World Cup journey.
Paragraph 1: Set the scene — how they started the tournament
Paragraph 2: Their highs — best predictions, moments of glory
Paragraph 3: Their lows — worst calls, team disappointments
Paragraph 4: The verdict — their legacy as a World Cup fan

Tone: Warm, personal, slightly dramatic (like a documentary narrator).
Reference specific matches and predictions by name.
Max 300 words.`;
```

### Architecture

```
src/
├── lib/
│   ├── passport-stamps.ts      # Stamp definitions + conditions
│   ├── passport-tracker.ts     # Event tracking for stamp progression
│   ├── fan-levels.ts           # Level system
│   └── passport-narrative.ts   # Gemini narrative generator
├── app/
│   ├── api/
│   │   └── passport/
│   │       └── narrative/route.ts  # POST generate journey narrative
│   └── passport/
│       └── page.tsx            # Fan Passport page
├── components/
│   └── passport/
│       ├── PassportView.tsx    # Full passport display
│       ├── StampGrid.tsx       # Grid of earned/unearned stamps
│       ├── FanLevelBadge.tsx   # Level display with stars
│       ├── JourneyStats.tsx    # Stats summary
│       ├── JourneyNarrative.tsx # AI-generated story
│       └── PassportShareCard.tsx # Shareable image generator
└── types/index.ts              # PassportData, Stamp, FanLevel types
```

### State Management

All passport data stored in Zustand with localStorage persist (same pattern as existing bracket/prediction storage):

```typescript
// Add to src/lib/store.ts

interface PassportSlice {
  stamps: Record<string, { earnedAt: string }>;   // stamp id → earned timestamp
  events: PassportEvent[];                          // All tracked events for stamp calculation
  sharedCards: number;
  playerCardsViewed: Set<string>;
  stadiumsViewed: Set<string>;
  chaosScenarios: number;
  lateNightPredictions: number;

  trackEvent: (event: PassportEvent) => void;
  checkStamps: () => string[];  // Returns newly earned stamp IDs
}
```

### Estimated Effort: 3-4 days

---

## Feature Integration Map

These features are designed to feed into each other:

```
┌─────────────────┐
│   Rival Mode    │──── predictions feed into ────┐
└────────┬────────┘                                │
         │ banter earns stamps                     │
         ▼                                         ▼
┌─────────────────┐                     ┌──────────────────┐
│  Fan Passport   │◄── stamps from ─────│ Beat the Algorithm│
└────────┬────────┘                     └────────┬─────────┘
         │ journey uses all data                  │
         ▼                                        │
┌─────────────────┐                               │
│  What to Watch  │─── "your match coming up" ────┘
└────────┬────────┘
         │ match context for
         ▼
┌─────────────────┐
│ Group Chaos     │─── scenarios earn stamps ──► Fan Passport
└─────────────────┘
```

**Every feature generates data for the Fan Passport.** The Passport is the connective tissue that makes the whole app feel like a cohesive product, not a collection of tools.

---

## Implementation Roadmap

### Sprint 1 (Days 1-3): Foundation
- **Beat the Algorithm** — extends existing Monte Carlo sim
- **Group Stage Chaos** — extends existing IfThisHappens.tsx
- Both are lowest risk because they build on existing code

### Sprint 2 (Days 4-6): Social Layer
- **Rival Mode** — social graph + banter engine
- **What Should I Watch** — onboarding + importance algorithm

### Sprint 3 (Days 7-9): Identity & Polish
- **Fan Passport** — stamp system + share cards + narrative
- Integration testing across all features
- Share card design polish

### Sprint 4 (Days 10-12): Launch Prep
- Performance optimization (lazy loading, skeleton states)
- OG image generation for social sharing
- Analytics events for tracking feature adoption
- Final QA pass

**Total: ~12-15 days for all 5 features**

---

## Tech Stack Additions Required

```json
// Additional dependencies (add to package.json):
{
  "dependencies": {
    // Already present — no new deps needed for most features
    // html2canvas: "^1.4.1"     ✅ Already in repo
    // @google/generative-ai     ✅ Already in repo
    // framer-motion              ✅ Already in repo
    // zustand                    ✅ Already in repo
    // swr                        ✅ Already in repo

    // Optional additions:
    "nanoid": "^5.0.0"          // Short unique IDs for invite codes (lighter than uuid)
  }
}
```

The existing stack (Next.js 14, Zustand, Gemini, framer-motion, html2canvas, SWR) covers everything. No major new dependencies needed. That's the beauty of building features that are product-layer, not infrastructure-layer.
