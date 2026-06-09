/**
 * gemini.ts
 * Google Gemini SDK — server-side only.
 * Powers three AI features in Bring It Home:
 * 1. Matchday narrative chapter — auto-generated story for the timeline
 * 2. Tactical explainer — "Why did France win?" in plain English
 * 3. Wrapped insight — one-line personalised tournament summary
 *
 * Brand voice: bold, editorial, emotional. Short sentences. Present tense.
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_KEY = process.env.GEMINI_API_KEY ?? '';

function getModel() {
  if (!GEMINI_KEY) return null;
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
}

// ─── Matchday Narrative ───────────────────────────────────
interface MatchSummary {
  teamA: string; teamB: string;
  scoreA: number; scoreB: number;
  keyEvents: string[];
  playerOfMatch: string;
}

const FALLBACK_NARRATIVE =
  'The tournament writes another chapter. Every match matters more than the last.';

export async function generateMatchdayNarrative(
  day: number, date: string, matches: MatchSummary[]
): Promise<string> {
  const model = getModel();
  if (!model) return FALLBACK_NARRATIVE;

  const matchText = matches
    .map(m => `${m.teamA} ${m.scoreA}-${m.scoreB} ${m.teamB}. Key moments: ${m.keyEvents.join(', ')}. Player of match: ${m.playerOfMatch}.`)
    .join('\n');

  try {
    const result = await model.generateContent(
      `You write for "Bring It Home" — a World Cup 2026 fan app.
Brand voice: bold, editorial, emotional. Short sentences. Present tense. Make fans feel the stakes.
The tagline is: "Every team starts the tournament. Only one nation brings it home."

Write a 2-sentence matchday narrative for Day ${day} (${date}).
Like the opening of a great match report. No clichés. No "incredible" or "amazing".

Matches:\n${matchText}

Output only the 2 sentences. Nothing else.`
    );
    return result.response.text().trim() || FALLBACK_NARRATIVE;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[gemini] narrative error:', err);
    return FALLBACK_NARRATIVE;
  }
}

// ─── Tactical Explainer ───────────────────────────────────
interface MatchStats {
  teamA: string; teamB: string; winner: string;
  possession: [number, number];
  shots: [number, number];
  shotsOnTarget: [number, number];
  keyEvents: string[];
}

const FALLBACK_TACTICAL =
  '• Controlled possession in key areas\n• Clinical finishing when it mattered\n• Defensive shape held under pressure';

export async function generateTacticalExplainer(stats: MatchStats): Promise<string> {
  const model = getModel();
  if (!model) return FALLBACK_TACTICAL;

  try {
    const result = await model.generateContent(
      `You write for "Bring It Home" — a World Cup fan app with bold editorial voice.
Explain in 3 bullet points why ${stats.winner} won. Write for a casual fan. Plain English, no jargon.
Be specific. Use the actual numbers and events.

${stats.teamA} vs ${stats.teamB} — winner: ${stats.winner}
Possession: ${stats.possession[0]}% vs ${stats.possession[1]}%
Shots: ${stats.shots[0]} vs ${stats.shots[1]} (on target: ${stats.shotsOnTarget[0]} vs ${stats.shotsOnTarget[1]})
Key events: ${stats.keyEvents.join(', ')}

Output only 3 bullet points starting with "•". Nothing else.`
    );
    return result.response.text().trim() || FALLBACK_TACTICAL;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[gemini] tactical error:', err);
    return FALLBACK_TACTICAL;
  }
}

// ─── WC Wrapped Insight ───────────────────────────────────
interface UserWrappedData {
  correctPredictions: number;
  totalPredictions: number;
  favouriteTeam: string;
  mostViewedPlayer: string;
  streak: number;
  biggestUpsetCalled: string | null;
}

const FALLBACK_WRAPPED = 'Your World Cup journey is just getting started — keep predicting.';

export async function generateWrappedInsight(data: UserWrappedData): Promise<string> {
  const model = getModel();
  if (!model) return FALLBACK_WRAPPED;

  const accuracy = Math.round((data.correctPredictions / Math.max(data.totalPredictions, 1)) * 100);

  try {
    const result = await model.generateContent(
      `You write for "Bring It Home" — a World Cup fan app. Bold, witty, one-sentence summaries.
Write ONE sentence (max 18 words) summing up this fan's World Cup so far.
Be specific. Reference their actual data. Make them smile or cringe.

Accuracy: ${accuracy}%
Favourite team: ${data.favouriteTeam}
Streak: ${data.streak} days
${data.biggestUpsetCalled ? `Biggest upset called: ${data.biggestUpsetCalled}` : 'No major upsets called yet'}

Output only the sentence.`
    );
    return result.response.text().trim() || FALLBACK_WRAPPED;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error('[gemini] wrapped error:', err);
    return FALLBACK_WRAPPED;
  }
}
